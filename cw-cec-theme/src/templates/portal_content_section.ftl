<div class="container-fluid-1280">
    <div aria-expanded="false" class="collapse navbar-collapse" id="navigationCollapse">
        <#if has_navigation && is_setup_complete && show_site_navigation && !layout.isTypeControlPanel()>
            <nav class="${nav_css_class} site-navigation" id="navigation" role="navigation">
                <#assign preferencesMap = {"displayStyle": "ddmTemplate_NAVBAR-DEFAULT-FTL", "portletSetupPortletDecoratorId": "barebone"} />
                <div class="d-flex justify-content-end">
                    <div class="navbar-default">
                        <@liferay.navigation_menu
                            default_preferences=freeMarkerPortletPreferences.getPreferences(preferencesMap) />
                    </div>
                </div>
            </nav>
        </#if>
    </div>
    <section id="content">
        <h1 class="hide-accessible">${the_title}</h1>

        <#if selectable>
            <@liferay_util["include"] page=content_include />
        <#else>
            ${portletDisplay.recycle()}

            ${portletDisplay.setTitle(the_title)}

            <@liferay_theme["wrap-portlet"] page="portlet.ftl">
                <@liferay_util["include"] page=content_include />
            </@>
        </#if>
    </section>
    <div id="cw-maintenance-block" style="display: none">
        <div class="mt-4">
            <div
                class="cw--card cw--border-line cw--bg-white cw--border-radius-lg cw--messaging-card">
                <div
                    class="cw--row row cw--row-flat cw--row-col-space cw--row-col-space-none h-100 cw--border-between-x-line cw--messaging-row"
                >
                    <div class="cw--col col col-12 cw--messaging-left-panel text-center">
                        <div class="cw--box cw--p-md cw--p-xl">
                            <div class="cw--box cw--p-md cw--p-xl cw--maintenance">
                                <div class="cw--box cw--p-md cw--m-xxs">
                                    <svg class="cw--icon" viewBox="0 0 80 80" width="80" height="80">
                                        <g>
                                            <g fill="none" fill-rule="evenodd">
                                                <g fill="#E1E1E1" fill-rule="nonzero">
                                                    <path
                                                        d="M50.25 4.156a2.568 2.568 0 0 1 3.28-1.534C71.824 9.152 82.74 27.8 79.402 46.82 76.065 65.839 59.44 79.72 40 79.72a2.554 2.554 0 0 1-2.563-2.546A2.554 2.554 0 0 1 40 74.63c16.948 0 31.442-12.102 34.352-28.683 2.91-16.582-6.607-32.84-22.556-38.534a2.54 2.54 0 0 1-1.545-3.256Z"></path>
                                                    <path
                                                        d="M66.372.039a2.562 2.562 0 0 1 2.968 2.066 2.547 2.547 0 0 1-2.08 2.948L56.74 6.889l5.18 8.764a2.535 2.535 0 0 1-.79 3.407l-.123.076a2.573 2.573 0 0 1-3.507-.906L50.453 6.306c-.905-1.531.006-3.489 1.766-3.796L66.372.04ZM40 .28a2.554 2.554 0 0 1 2.563 2.546A2.554 2.554 0 0 1 40 5.37c-16.948 0-31.442 12.102-34.352 28.683-2.91 16.582 6.607 32.84 22.556 38.534a2.54 2.54 0 0 1 1.545 3.256 2.568 2.568 0 0 1-3.279 1.534C8.176 70.848-2.74 52.2.598 33.18 3.935 14.161 20.56.28 40 .28Z"></path>
                                                    <path
                                                        d="M18.992 60.864a2.573 2.573 0 0 1 3.507.906l7.048 11.924c.905 1.531-.006 3.489-1.766 3.796L13.628 79.96a2.562 2.562 0 0 1-2.968-2.066 2.547 2.547 0 0 1 2.08-2.948l10.518-1.837-5.18-8.763a2.535 2.535 0 0 1 .79-3.407l.124-.076Z"></path>
                                                </g>
                                                <path
                                                    d="M41.308 22.667c1.091 0 1.976.895 1.976 2v2.644a13.751 13.751 0 0 1 5.534 3.2l2.237-1.308a1.956 1.956 0 0 1 1.5-.198 1.98 1.98 0 0 1 1.2.934l1.976 3.464c.546.956.222 2.18-.723 2.732l-2.238 1.308c.54 2.117.54 4.338 0 6.456l2.242 1.308a2.013 2.013 0 0 1 .723 2.732l-1.976 3.464a1.964 1.964 0 0 1-2.7.732l-2.202-1.316a13.795 13.795 0 0 1-5.533 3.2v2.648c0 1.104-.885 2-1.977 2h-3.952a1.988 1.988 0 0 1-1.977-2v-2.64a13.83 13.83 0 0 1-5.534-3.2l-2.24 1.308a1.964 1.964 0 0 1-2.7-.732l-1.977-3.464a2.014 2.014 0 0 1 .684-2.728l2.241-1.308a13.171 13.171 0 0 1 0-6.456l-2.237-1.308a2.013 2.013 0 0 1-.723-2.732l1.976-3.464a1.98 1.98 0 0 1 1.2-.934 1.956 1.956 0 0 1 1.5.198l2.237 1.308a13.767 13.767 0 0 1 5.534-3.2v-2.648c0-1.105.885-2 1.976-2Zm-1.965 12c-3.274 0-5.929 2.686-5.929 6 0 3.313 2.655 6 5.93 6 3.274 0 5.928-2.687 5.928-6 0-3.314-2.654-6-5.929-6Z"
                                                    fill="#339BB2"></path>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <h4 class="cw--heading cw--h4">
                                    <@liferay.language key="maintenance-mode-title" />
                                </h4>
                                <p class="cw--text">
                                    <@liferay.language key="maintenance-mode-description" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
