<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
	<title>${the_title}</title>

	<@liferay_util["include"] page=top_head_include />

    <#-- START CUSTOMIZE -->

    <#include "${full_templates_path}/cw_portal_custom.ftl" />

    <#-- END CUSTOMIZE -->
</head>

<body class="portal-popup ${css_class}">

<@liferay_util["include"] page=content_include />

<@liferay_util["include"] page=bottom_ext_include />
</body>

</html>
