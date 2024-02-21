<div class="columns-1-2-3" id="main-content" role="main">
	<div class="portlet-layout row">
        <div class="col-md-12 portlet-column portlet-column-only" id="column-1">
            ${processor.processColumn("column-1")}
        </div>
    </div>

	<div class="portlet-layout row">
        <div class="col-lg-3 col-md-12 portlet-column portlet-column-first" id="column-2">
            ${processor.processColumn("column-2")}
        </div>

        <div class="col-lg-9 col-md-12 portlet-column portlet-column-last">
            <div class="portlet-layout row">
                <div class="col-md-12 portlet-column portlet-column-last" id="column-3">
                    ${processor.processColumn("column-3")}
                </div>
            </div>
            <div class="portlet-layout row">
                <div class="col-md-8 portlet-column portlet-column-first" id="column-4">
                    ${processor.processColumn("column-4")}
                </div>
                <div class="col-md-4 portlet-column portlet-column-first" id="column-5">
                    ${processor.processColumn("column-5")}
                </div>
            </div>
        </div>
    </div>
</div>
