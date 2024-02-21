AUI().use('liferay-portlet-url');

var maintenanceModeUrl = '';

function replaceMaintenanceScreen() {
    document.getElementById("content").innerHTML = "";
    document.getElementById('cw-maintenance-block').style.display = "block";
}

function checkMatchMaintenanceUrl() {
    if (!maintenanceUrls || !maintenanceUrls.length) {
        return;
    }
    const currentUrl = window.location.href;
    for (let index = 0; index < maintenanceUrls.length; index++) {
        if (currentUrl.includes(maintenanceUrls[index])) {
            replaceMaintenanceScreen();
            maintenanceModeUrl = location.href;
            return;
        }
    }
}

function addNavigationListener() {
    var $globalNavigation = $('#global-navigation');
    var $globalNavigationToggle = $('#global-navigation-toggle');
    var $globalNavigationOverlay = $('#global-navigation-overlay');

    var $caret = $globalNavigationToggle.children('.icon-caret-down');

    var MOBILE_MAX_WIDTH = 767;
    var isMobile = $(window).width() <= MOBILE_MAX_WIDTH;
    var closeOnOutsideClick = function (event) {
        var target = event.target;

        var $isInsideGlobalNav = $(target).closest('#global-navigation').length > 0;
        var $isInsideGlobalNavToggle = $(target).closest('#global-navigation-toggle').length > 0;
        var $isInsideGlobalSearchBox = $(target).closest('#searchBox').length > 0;
        var $isGlobalNavToggle = $(target).is('#global-navigation-toggle');

        if (!$isInsideGlobalNav && !$isGlobalNavToggle && !$isInsideGlobalNavToggle) {
            $caret.removeClass('icon-rotate-360');
            $globalNavigation.removeClass('open');

            if (!$isInsideGlobalSearchBox && !isMobile) {
                if (window.searchBox._isMounted) {
                    window.searchBox.closeSearchBox();
                }
                $globalNavigationOverlay.removeClass('open');
            }
        }
    };

    var toggleGlobalNavigation = function () {
        $caret.toggleClass('icon-rotate-360');
        $globalNavigation.toggleClass('open');
        $globalNavigationOverlay.toggleClass('open');

        if (window.searchBox._isMounted) {
            window.searchBox.closeSearchBox();
        }
        if (isMobile) {
            $('body').toggleClass('mobile-menu-open');
        }
        $('.ips-services').addClass('d-none');
        $('.cw-services').removeClass('d-none');
    };

    if ($globalNavigation.length > 0 && $globalNavigationToggle.length > 0) {
        $globalNavigationToggle.on('click', toggleGlobalNavigation);

        $(document).on('click', closeOnOutsideClick);
    }

    var $mobileNavMenus = $('.js-mobile-list-toggle');

    if ($mobileNavMenus.length > 0) {
        $mobileNavMenus.on('click', function () {
            var $target = $(this);
            $('.cw-navigation__group--right ul.cw-navigation__list.open')
                .not($target.next('.cw-navigation__list'))
                .removeClass('open');
            if (!$('.lexicon-icon-times-circle').hasClass('.icon-rotate-45')) {
                $('.lexicon-icon-times-circle')
                    .not($target.find('.lexicon-icon-times-circle'))
                    .addClass('icon-rotate-45');
            }
            $target.next('.cw-navigation__list').toggleClass('open');
            $target.find('.lexicon-icon-times-circle').toggleClass('icon-rotate-45');
        });
    }
    $('.ips_service').on('click', function () {
        $('.cw-services').addClass('d-none');
        $('.ips-services').removeClass('d-none');
    });
}

function addLogoutListener() {
    $('a[href$="/c/portal/logout"]').click(function () {
        logoutFromOpenMRS();
    });

    function logoutFromOpenMRS() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        const openMRSURL = document.getElementById('openMRSURL').value;
        iframe.src = openMRSURL + '/appui/header/logout.action?successUrl=openmrs';
        document.body.appendChild(iframe);
    }
}

function updateChatUnreadCount(count) {
    const unreadCount = arguments.length ? count : window.chatUnreadCount;
    window.chatUnreadCount = unreadCount;
    if (unreadCount > 0) {
        $('#cw-unread-message').text(unreadCount).removeClass('hide');
    } else {
        $('#cw-unread-message').addClass('hide');
    }
}

function cwHandleSessionExpired() {
    showSessionExpiredPopup(true);
}

function cwHandleLogout(explicit) {
    if (explicit) {
        removeSessionExpiredPopup();
    }
    if (CW_UI && CW_UI.isReady) {
        CW_UI.session.destroy();
    } else if (!explicit) {
        cwHandleSessionExpired();
    }
}

AUI().ready(function() {
    if (typeof themeDisplay.getTimeZoneOffset !== 'function') {
        themeDisplay.getTimeZoneOffset = () => user_time_zone;
    }
    if (!window.initialPageReady) {
        window.initialPageReady = true;
        cwPageReady();
    } else {
        cwPageUpdated();
    }
    checkMatchMaintenanceUrl();
    window.addEventListener('hashchange', () => {
        if (maintenanceModeUrl && maintenanceModeUrl !== location.href) {
            location.reload();
        } else {
            checkMatchMaintenanceUrl();
        }
    });
});

function initMessagingUnreadCount() {
    // TODO: Remove this after decommission virtual instances https://khalibre.atlassian.net/browse/CW-14311
    if (isConnectCompany || !rocketUserId || !rocketLoginToken || !chatWebsocketUrl) return;
    if (typeof socket === 'undefined' && typeof rocketLoginToken !== 'undefined') {
        window.socket = new WebSocket(chatWebsocketUrl);
        socket.onopen = function() {
            var connectRequest = {
                msg: 'connect',
                version: '1',
                support: ['1']
            };
            var loginRequest = {
                msg: 'method',
                method: 'login',
                id: 'login',
                params: [{ resume: rocketLoginToken }]
            };
            var presenceRequest = {
                msg: 'method',
                method: 'UserPresence:setDefaultStatus',
                id: 'userPresence',
                params: ['online']
            };
            var streamNotifyRequest = {
                msg: 'sub',
                id: 'streamNotifyUser',
                name: 'stream-notify-user',
                params: [rocketUserId + '/subscriptions-changed', false]
            };

            socket.send(JSON.stringify(connectRequest));
            socket.send(JSON.stringify(loginRequest));
            socket.send(JSON.stringify(presenceRequest));
            socket.send(JSON.stringify(streamNotifyRequest));
            requestSubscriptions();
        };
        socket.onmessage = function(event) {
            var data = JSON.parse(event.data);
            if (data.msg === 'ping') {
                socket.send(JSON.stringify({ msg: 'pong' }));
            }

            if (data.id === 'subscriptions') {
                var unread = 0;
                data.result.forEach(function(subscription) {
                    unread += subscription.unread;
                });
                if (unread > 0) {
                    $('#cw-unread-message').text(unread).removeClass('hide');
                } else {
                    $('#cw-unread-message').addClass('hide');
                }
            }

            if (data.collection === 'stream-notify-user') {
                requestSubscriptions();
            }
        };
    } else if (socket) {
        requestSubscriptions();
    }
}

function requestSubscriptions() {
    var subscriptionRequest = {
        msg: 'method',
        method: 'subscriptions/get',
        id: 'subscriptions',
        params: []
    };
    socket.send(JSON.stringify(subscriptionRequest));
}
