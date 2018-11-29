(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicDetailsView", DynamicDetailsViewDirective);

    DynamicDetailsViewDirective.$inject = ["$templateCache"];

    function DynamicDetailsViewDirective($templateCache) {
        var _template = `<div class="clearfix dynamic-details-view-header" data-ng-if="DynamicDetailsViewDirectiveCtrl.mode == '0' && DynamicDetailsViewDirectiveCtrl.ePage.Masters.AppCode != 'TC'">
            <span data-ng-bind="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Title || 'Title'"></span>
        </div>
        <div class="clearfix">
            <dynamic-control data-ng-if="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry" input="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry"
                mode="D" control-style="" default-filter="DynamicDetailsViewDirectiveCtrl.ePage.Masters.defaultFilter" is-save-btn="true"
                controls-data="DynamicDetailsViewDirectiveCtrl.ePage.Masters.ControlsData($item)" view-type="2" selected-grid-row="DynamicDetailsViewDirectiveCtrl.ePage.Masters.SelectedGridRow($item)"
                pkey="DynamicDetailsViewDirectiveCtrl.ePage.Masters.Pkey"></dynamic-control>
        </div>`;
        $templateCache.put("DynamicDetailsView.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "DynamicDetailsView.html",
            controller: "DynamicDetailsViewDirectiveController",
            controllerAs: "DynamicDetailsViewDirectiveCtrl",
            scope: {
                dataentryName: "=",
                pkey: "=",
                mode: "=",
                defaultFilter: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
