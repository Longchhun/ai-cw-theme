<script type="text/javascript">
    <#if translationVersion??>
        var translationVersion = '${translationVersion}';
    </#if>
    <#if isConnectCompany?? && globalNavigationUtil??>
        var isConnectCompany = ${isConnectCompany ? c};
        var isCwChatLocked = ${globalNavigationUtil.getChatItem(request).isLocked() ? c};
        var emojiBaseUrl = '${globalNavigationUtil.getEmojiBaseUrl()}';
        <#if globalNavigationUtil.isChatMaintenanceMode()>
            var chatMaintenanceMode = true;
        </#if>
        var user_time_zone = calTimezoneAsHours();
        <#if !isConnectCompany && rocketUserId?? && rocketLoginToken?? && rocketWebsocketUrl??>
            var rocketUserId = '${rocketUserId}';
            var rocketLoginToken = '${rocketLoginToken}';
            var chatWebsocketUrl = '${rocketWebsocketUrl}';
        </#if>

        function calTimezoneAsHours() {
            return `${themeDisplay.getTimeZone().getRawOffset() / 1000 / 60 / 60}`;
        }
        function initCwUserSession() {
            CW_UI.ready(ui => {
                ui.session.set(${userSessionConfig});
                ui.session.watch('DESTROY', cwHandleSessionExpired);
            });
        }
        function initMiniMessaging() {
            if (!isCwChatLocked) {
                CW_UI.ready(ui => {
                    ui.initChat(${miniChatPortletConfig});
                    ui.watchChat(event => updateChatUnreadCount(event.unreadCount));
                });
            }
        }
        function openMiniMessaging() {
            if (!isCwChatLocked) {
                CW_UI.ready(ui => ui.openChat(${miniChatPortletConfig}));
            }
        }
        function cwPageReady() {
            if (isConnectCompany) {
                initCwUserSession();
                initMiniMessaging();
            } else {
                initMessagingUnreadCount();
            }
        }
        function cwPageUpdated() {
            updateChatUnreadCount();
        }
        function handleChatAction() {
            if (!isConnectCompany) {
                window.open('${globalNavigationUtil.getChatItem(request).getUrl()}', '_blank');
                return;
            }

            const isMessagingPage = themeDisplay.getLayoutRelativeURL() == '${messagingFriendlyUrl}';
            if (isMessagingPage || isCwChatLocked || Liferay.Browser.isMobile()) {
                Liferay.SPA.app.navigate('${globalNavigationUtil.getChatItem(request).getUrl()}');
            } else {
                openMiniMessaging();
            }
        }
    </#if>
</script>

<script src="/o/cw-frontend/index.js?t=${.now?long}"></script>
