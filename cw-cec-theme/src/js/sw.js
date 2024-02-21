importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js')
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

const domain = self.origin
const blacklist = [
    'https://dev-connect.crosswired.me',
]

let isDomainOnBlackList = false

blacklist.forEach((item) => {
    if (item === domain) isDomainOnBlackList = true
})

if (!isDomainOnBlackList) initWorkBoxCache()

function initWorkBoxCache() {
    if (workbox) {
        workbox.routing.registerRoute(
            new RegExp('^.*\/cw-cec-theme\/.*$'),
            new workbox.strategies.CacheFirst({
                cacheName: 'theme',
            })
        )
    
        workbox.routing.registerRoute(
            new RegExp('\.(?:woff|woff2)$'),
            new workbox.strategies.CacheFirst({
                cacheName: 'fonts',
            })
        )
    
        workbox.routing.registerRoute(
            new RegExp('^.*\/frontend-js-web\/.*$'),
            new workbox.strategies.CacheFirst({
                cacheName: 'libs',
            })
        )
    
        workbox.routing.registerRoute(
            new RegExp('^.*\/frontend-editor-ckeditor-web\/.*$'),
            new workbox.strategies.CacheFirst({
                cacheName: 'plugins',
            })
        )
    
        workbox.routing.registerRoute(
            new RegExp('^.*\/adaptive-media\/.*$'),
            new workbox.strategies.CacheFirst({
                cacheName: 'images',
                plugins: [
                    new workbox.expiration.ExpirationPlugin({
                        maxEntries: 100,
                        maxAgeSeconds: 604800,
                    })
                ]
            })
        )
    }
}

function preCache(event) {
    const preCacheResources = [
        '/o/cw-cec-theme/images/background/learning-banner.png',
        '/o/cw-cec-theme/images/background/community-banner.png',
        '/o/cw-cec-theme/images/people-chatting.png',
        '/o/cw-cec-theme/images/icons/icons.svg',
        '/o/cw-cec-theme/images/lexicon/icons.svg',
        '/o/cw-css-dynamic-include/css/font-awesome.css',
    ]

    event.waitUntil(
        caches.open('pre-cache')
        .then((cache) => {
            return cache.addAll(preCacheResources)
        })
    )
}

function deleteOldCaches(event) {
    const cacheAllowlist = [
        'fonts', 
        'images',
    ]

    event.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
}

self.addEventListener('install', (event) => {
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    deleteOldCaches(event)
    preCache(event)

    return clients.claim()
})

var map = new Map();

self.addEventListener('message', (event) => {
    importSecretKey(event.data.masterKey).then((response) => {
        map.set(event.data.id.toString(), {
            masterKey: response,
            url: event.data.url,
            sizeInByte: event.data.sizeInByte
        });
    });
})

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
    let id = url.searchParams.get('id');
    const file = map.get(id);
    if(file && req.url.includes(file.url)) {
        event.respondWith(handleRequest(file));
    }
})

async function handleRequest(file) {
    const res = await fetch(file.url);
    const decrypt = await decryptStreamFile(
        file,
        res
    );
    return new Response(decrypt.result, { headers: decrypt.headers })
}

function decryptStreamFile(file, res) {
    return new Promise((resolve, reject) => {
            const reader = res.body.getReader();
            let chunkIndex = 0;
            let chunkSize = ((1024 * 5) * 1024) + 32;
            let chunk = [];
            let result = new Uint8Array(0);
            let total = 0;
            let fullFile = new Blob;
            let finish = false;

            async function pump() {
                while (!finish) {
                    let data = await reader.read();
                    if(data.done) {
                       result = new Uint8Array(total);
                       let mergeOffset = 0;
                       chunk.forEach((item) => {
                          result.set(item, mergeOffset);
                          mergeOffset += item.length;
                       });

                       let offset = 0;
                       let isLastChunk = false;
                       const onChunkFile = async () => {
                          if (offset < result.byteLength) {
                            const remainingBytes = result.byteLength - offset;
                            let buffer = null;

                            if (remainingBytes > chunkSize) {
                                buffer = result.slice(offset, offset + chunkSize);
                                offset += chunkSize;
                            } else {
                                isLastChunk = true;
                                buffer = result.slice(offset, offset + remainingBytes);
                                offset += buffer.byteLength;
                            }
                            let decrypted = await decryptFile(buffer, file.masterKey);
                            fullFile = new Blob([fullFile, decrypted]);

                            if (isLastChunk) {
                               resolve({
                                   result: fullFile,
                                   headers: res.headers
                               });
                            }
                            onChunkFile();
                            }
                          };
                          onChunkFile();
                      finish = true;
                      return;
                    }
                    chunk.push(data.value);
                    total += data.value.length;
                }
            }
            pump();
    });
}

function decryptFile(buffer, key) {
    const IV_LENGTH = 16;
    return new Promise((resolve, reject) => {
        const cipher = buffer.slice(0, buffer.byteLength - IV_LENGTH);
        const iv = buffer.slice(cipher.byteLength, buffer.byteLength);
        crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, cipher)
        .then((deciphered) => {
            resolve(arrayBufferToBlob(deciphered));
        })
    })
}

function arrayBufferToBlob(ab) {
    return new Blob([new Uint8Array(ab)]);
}

function blobToArrayBuffer(blob) {
    var fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = resolve;
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(blob);
    });
}

function concatenate(...arrays) {
  let size = arrays.reduce((a,b) => a + b.byteLength, 0);
  let result = new Uint8Array(size);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.byteLength;
  }
  return result;
}

function importSecretKey(rawKey) {
    return crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );
}
