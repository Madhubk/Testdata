(function () {
    'user strict';

    angular
        .module('Application')
        .directive('tcGrid', TCGrid);

    TCGrid.$inject = ["$templateCache"];

    function TCGrid($templateCache) {
        var _template = `<div class="clearfix tc-dyn-grid-container" data-ng-if="TCGridCtrl.ePage.Masters.DataEntry">
            <div class="tc-dyn-grid-heading">
                <span data-ng-bind="TCGridCtrl.ePage.Masters.AttributeDetails.LabelText || TCGridCtrl.ePage.Masters.DataEntry.Title || 'Title'"></span>
                <span class="fa fa-plus font-160 pull-right cursor-pointer" data-ng-click="TCGridCtrl.ePage.Masters.AddNew()" data-ng-if="TCGridCtrl.ePage.Masters.AttributeDetails.Options.AddNew == 'true' && TCGridCtrl.ePage.Masters.DataEntry.Filter.length > 0"></span>
            </div>
            <div class="tc-dyn-grid">
                <dynamic-grid mode="'1'" input="TCGridCtrl.ePage.Masters.DataEntry" grid-options="TCGridCtrl.ePage.Masters.GridOptions"  selected-grid-row="TCGridCtrl.ePage.Masters.SelectedGridRow($item)" default-filter="TCGridCtrl.ePage.Masters.DefaultFilter"  is-local-search="true" is-api="true"></dynamic-grid>
            </div>
        </div>`;
        $templateCache.put("TCGrid.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                dataentryName: '=',
                searchInput: '=',
                attributeDetails: "=",
                entity: "=",
                selectedGridRow: "&"
            },
            link: Link,
            bindToController: true,
            controller: "TCGridController",
            controllerAs: "TCGridCtrl",
            templateUrl: "TCGrid.html"
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
