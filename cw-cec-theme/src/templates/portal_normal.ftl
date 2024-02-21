<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key=" lang.dir" />" lang="${w3c_language_id}">

<head>
    <title>${the_title}</title>

    <meta content="initial-scale=1.0, width=device-width" name="viewport" />
    <meta name="msapplication-TileImage" content="/${images_folder}/favicons/144x144.png">
    <meta name="msapplication-TileColor" content="#339bb2">
    <meta name="theme-color" content="#339bb2">

    <link crossorigin href="https://fonts.gstatic.com/" rel="preconnect">
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap" rel="preload" as="style" onload="this.rel='stylesheet'">
    <#if isInConnectDomain?? && isInConnectDomain>
        <link rel="apple-touch-icon" sizes="180x180" href="${images_folder}/favicons/180x180.png">
        <link rel="mask-icon" href="${images_folder}/favicons/favicon.svg" color="#5bbad5">
        <link rel="icon" type="image/png" sizes="32x32" href="${images_folder}/favicons/32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="${images_folder}/favicons/16x16.png">
        <link rel="icon" href="${images_folder}/favicons/32x32.ico" sizes="any">
        <link rel="icon" href="${images_folder}/favicons/favicon.svg" type="image/svg+xml">
    </#if>

    <script src="${javascript_folder}/registration.js?v=${themeDisplay.getTheme().getPluginPackage().getVersion()}" type="text/javascript"></script>
    <script type="text/javascript">
        var maintenanceUrls = [];
        <#if maintenanceUrls??>
            maintenanceUrls = JSON.parse(`${maintenanceUrls}`);
        </#if>
    </script>
    <#if appId?has_content && safariWebId?has_content>
        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script>

        <script type="text/javascript">

        window.OneSignal = window.OneSignal || []
        OneSignal.push(function() {
            OneSignal.init({
                appId: '${appId}',
                safari_web_id: '${safariWebId}'
            })
            modifySubscriberUser();
        });

        async function modifySubscriberUser() {
            const notificationPermission = await OneSignal.getNotificationPermission();
            if (notificationPermission == "granted") {
                let subscriberId = await OneSignal.getUserId();
                if (subscriberId) {
                    fetch('/o/cw-push-notification/api/add?subscriberId='+subscriberId).catch(console.error);
                }
            }
        }
        </script>
    </#if>

    <@liferay_util["include"] page=top_head_include />
    <#include "${full_templates_path}/cw_portal_custom.ftl" />
</head>

<#assign
    is_company_admin = false
/>

<#assign hide_navigation_globle = getterUtil.getBoolean(themeDisplay.getThemeSetting("hide-globle-navigation")) />

<#if permissionChecker.isCompanyAdmin()>
    <#assign is_company_admin = true />
</#if>

<#if !is_company_admin>
    <#assign
        css_class = css_class?replace("controls-visible", "")
        css_class = css_class?replace("has-control-menu", "")
        css_class = css_class?replace("open", "")
    />
</#if>

<body class="${css_class}" data-spy="scroll" data-offset="20" data-target="#my-profile-sidenav">

    <@liferay_ui["quick-access"] contentId="#main-content" />

    <@liferay_util["include"] page=body_top_include />

    <#if is_company_admin>
        <@liferay.control_menu />
    </#if>
    <#if is_signed_in && !hide_navigation_globle>
        <script type="text/javascript">
            var logoCssClass = `${logo_css_class}`;
            var logoDescription = `${logo_description}`;
            var userImageUrl = `${user_image}`;
            var signOutUrl = `${sign_out_url}`;
            var screenName = `${user.getScreenName()}`;
            var isImpersonated = ${is_impersonated?c};
            var isSetupComplete = ${is_setup_complete?c};
            var showSiteNavigation = ${show_site_navigation?c};
            var isTypeControlPanel = ${layout.isTypeControlPanel()?c};
            var showHeaderSearch = ${show_header_search?c};
        </script>
        <div class="cw-header-wrapper bg-white" id="wrapper">
            <@liferay_portlet["runtime"] portletName="globalNavigationPortlet" />
        </div>
    </#if>

    <div class="cec-overlay" id="global-navigation-overlay"></div>
    <#if !is_signed_in || !user.isActive() || user.isPasswordReset() || !user.isEmailAddressVerificationComplete() || !user.isReminderQueryComplete()>
        <#include "${full_templates_path}/portal_content_section.ftl" />
    <#else>
        <#include "${full_templates_path}/portal_content_section.ftl" />
        <#if openMRSURL??>
            <input type="hidden" id="openMRSURL" value="${openMRSURL}" />
        </#if>
    </#if>
    <@liferay_util["include"] page=body_bottom_include />

    <@liferay_util["include"] page=bottom_include />
</body>

</html>
