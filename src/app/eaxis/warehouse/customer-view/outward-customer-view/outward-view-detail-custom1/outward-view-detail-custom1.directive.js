(function () {
    "use strict";

    angular
        .module("Application")
        .directive("outwardViewDetailCustom1", outwardViewDetailCustom1);

    outwardViewDetailCustom1.$inject = [];

    function outwardViewDetailCustom1() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/outward-customer-view/outward-view-detail-custom1/outward-view-detail-custom1.html",
            link: Link,
            controller: "OutwardViewDetailCustom1Controller",
            controllerAs: "OutwardViewDetailCustom1Ctrl",
            scope: {
                currentOutwardViewDetail: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();


