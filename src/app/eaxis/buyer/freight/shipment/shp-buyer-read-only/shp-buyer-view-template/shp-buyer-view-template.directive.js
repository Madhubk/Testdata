(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shpBuyerViewTemplate", shpBuyerViewTemplate);

    shpBuyerViewTemplate.$inject = [];

    function shpBuyerViewTemplate() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shp-buyer-read-only/shp-buyer-view-template/shp-buyer-view-template.html",
            controller: "shpBuyerViewTemplateController",
            controllerAs: "shpBuyerViewTemplateCtrl",
            scope: {
                currentShipment: "=",
                dataentryObject: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();