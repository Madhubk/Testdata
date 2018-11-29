(function () {
    "use strict";
    angular
        .module("Application")
        .directive("dynamicGrid", DynamicGrid);

    DynamicGrid.$inject = ["$templateCache"];

    function DynamicGrid($templateCache) {
        var _template = `<div class="clearfix grid-local-search p-5" data-ng-if="GridCtrl.isLocalSearch">
            <input class="form-control input-sm pull-right" style="width: 300px;" placeholder="Search" ng-model='GridCtrl.ePage.Masters.LocalSearch' data-ng-change='GridCtrl.ePage.Masters.RefreshGrid()'/>
        </div>
        <div data-ng-if="GridCtrl.input" class="clearfix">
            <div class="text-center grid-view-loader padding-20" data-ng-if="!GridCtrl.ePage.Masters.gridOptions">
                <i class="fa fa-spin fa-spinner font-160"></i>
            </div>
            <div class="dyn-grid-view" data-ng-if="GridCtrl.ePage.Masters.gridOptions" id="gridView" ui-grid="GridCtrl.ePage.Masters.gridOptions"
                ui-grid-pagination ui-grid-exporter ui-grid-move-columns ui-grid-selection ui-grid-edit ui-grid-resize-columns ui-grid-pinning
                ui-grid-auto-resize class="grid">
                <div class="grid-loading-norecord-container" data-ng-if="GridCtrl.ePage.Masters.IsLoading">
                    <div class="grid-loading">Loading...</div>
                </div>
                <div class="grid-loading-norecord-container" data-ng-if="GridCtrl.ePage.Masters.IsNoRecords">
                    <div class="grid-no-record">No records found...</div>
                </div>
                <div class="grid-loading-norecord-container" data-ng-if="GridCtrl.ePage.Masters.IsSelectAnyFilter">
                    <div class="grid-no-record">Select any filter...!</div>
                </div>
            </div>
        </div>`;
        $templateCache.put("DynamicGrid.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "DynamicGrid.html",
            controller: "GridController",
            controllerAs: "GridCtrl",
            scope: {
                mode: "=",
                input: "=",
                gridOptions: "=",
                defaultFilter: "=",
                baseFilter: "=",
                selectedGridRow: "&",
                isLocalSearch: "=",
                isApi: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
