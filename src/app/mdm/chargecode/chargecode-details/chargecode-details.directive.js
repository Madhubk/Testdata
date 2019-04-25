(function () {
    "use strict";

    angular.module("Application")
        .directive("chargecodeDetail", chargecodeDetail);

    chargecodeDetail.$inject = [];

    function chargecodeDetail() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/chargecode/chargecode-details/chargecode-details.html",
            link: Link,
            controller: "ChargecodeDetailsController",
            controllerAs: "ChargecodeDetailsCtrl",
            scope: {
                currentChargecode: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();