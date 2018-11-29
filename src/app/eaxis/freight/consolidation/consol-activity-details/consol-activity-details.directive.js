(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolActivityDetails", ConsolActivityDetails);

    ConsolActivityDetails.$inject = [];

    function ConsolActivityDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/consol-activity-details/consol-activity-details.html",
            link: Link,
            controller: "ConsolActivityDetailsController",
            controllerAs: "ConsolActivityDetailsCtrl",
            scope: {
                currentObj: "=",
                taskObj:"=",
                readOnly: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
