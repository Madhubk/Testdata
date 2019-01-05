(function () {
    "use strict";

    angular
        .module("Application")
        .directive("errorWarningDirective", ErrorWarningDirective);

    ErrorWarningDirective.$inject = ["$templateCache"];

    function ErrorWarningDirective($templateCache) {
        var _template = `<button class="popover-{{type}}" uib-popover-template="'errorWarningTemplate'" popover-trigger="'focus'" popover-animation="true" popover-append-to-body="true" popover-class="popover-{{type}}" popover-is-open="false" popover-placement="{{Placement}}">
            <i class="{{icon}}"></i>
        </button>
        
        <script type="text/ng-template" id="errorWarningTemplate">
            <div data-ng-if="parentType == 'Parent'" data-ng-repeat="x in list | filter:{'ParentRef': parentRef}">
                <span data-ng-bind="x.Code + ' - ' + x.Message"></span>
            </div>
            <div data-ng-if="parentType == 'GParent'" data-ng-repeat="x in list | filter:{'GParentRef': gParentRef}">
                <span data-ng-bind="x.Code + ' - ' + x.Message"></span>
            </div>
            <div data-ng-if="parentType == 'null'" data-ng-repeat="x in list">
                <span data-ng-bind="x.Code + ' - ' + x.Message"></span>
            </div>
            <div data-ng-if="parentType == 'arrayObjectRow'" data-ng-repeat="x in list | filter:{'RowIndex': rowIndex}:true">
                <span data-ng-bind="x.Code + ' - ' + x.Message"></span>
            </div>
            <div data-ng-if="parentType == 'arrayObjectCol'" data-ng-repeat="x in list | filter:{'RowIndex': rowIndex, 'ColIndex': colIndex}:true">
                <span data-ng-bind="x.Code + ' - ' + x.Message"></span>
            </div>
        </script>`;
        $templateCache.put("ErrorWarningDirective.html", _template);

        var exports = {
            restrict: "EA",
            transclude: true,
            templateUrl: "ErrorWarningDirective.html",
            scope: {
                list: "=",
                type: "=",
                icon: "@",
                parentType: "=",
                parentRef: "=",
                gParentRef: "=",
                rowIndex: "=",
                colIndex: "=",
                placement: "@"
            },
            link: Link
        };
        return exports;

        function Link(scope) {
            scope.Placement = scope.placement ? scope.placement : "auto";
        }
    }
})();
