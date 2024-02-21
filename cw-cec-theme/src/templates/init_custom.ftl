<#-- Portlet -->
<#assign barebone = freeMarkerPortletPreferences.getPreferences({"portletSetupPortletDecoratorId" : "barebone"}) />

<#-- Theme -->
<#assign instance_url = theme_display.getURLHome() />
<#assign is_impersonated = theme_display.isImpersonated() />
<#assign show_header_search = getterUtil.getBoolean(themeDisplay.getThemeSetting("show-header-search")) />
<#assign show_site_navigation = getterUtil.getBoolean(themeDisplay.getThemeSetting("show-site-navigation")) />
<#assign user_image = user.getPortraitURL(theme_display) />

