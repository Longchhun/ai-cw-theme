const browserSuportsServiceWorker = 'serviceWorker' in navigator

if (browserSuportsServiceWorker) {
    window.addEventListener('load', function() {
        navigator.serviceWorker
        .register('/o/cw-cec-theme/js/sw.js?v=' + themeVersion, {
            scope: '/'
        })
        .then((registration) => {})
        .catch((error) => {})
    })
}
