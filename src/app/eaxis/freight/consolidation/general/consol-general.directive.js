(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolGeneral", ConsolGeneral);

    ConsolGeneral.$inject = [];

    function ConsolGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/general/consol-general.html",
            link: Link,
            controller: "GeneralConController",
            controllerAs: "GeneralConCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
