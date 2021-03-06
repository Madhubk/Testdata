(function () {
    "use strict";

    angular
        .module("Application")
        .directive("asnTrend", AsnTrend);

    function AsnTrend() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/asn-trend/asn-trend.html",
            link: Link,
            controller: "AsnTrendController",
            controllerAs: "AsnTrendCtrl",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();