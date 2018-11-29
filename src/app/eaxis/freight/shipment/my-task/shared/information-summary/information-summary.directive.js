(function () {
    "use strict"
    angular
        .module("Application")
        .directive("dynamicInformationSummary", DynamicInformationSummary);

    function DynamicInformationSummary() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/information-summary/information-summary.html",
            link: Link,
            controller: "InformationSummaryController",
            controllerAs: "InformationSummaryCtrl",
            bindToController: true,
            scope: {
                currentObj: "=",
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();
