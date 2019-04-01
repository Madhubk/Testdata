(function () {
    "use strict";

    angular
        .module("Application")
        .directive("rateHeaderGeneral", RateHeaderGeneral);

    RateHeaderGeneral.$inject = [];

    function RateHeaderGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/rate/rate-header/rate-header-general/rate-header-general.html",
            link: Link,
            controller: "RateHeaderGeneralController",
            controllerAs: "RateHeaderGeneralCtrl",
            scope: {
                currentRateHeader: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();