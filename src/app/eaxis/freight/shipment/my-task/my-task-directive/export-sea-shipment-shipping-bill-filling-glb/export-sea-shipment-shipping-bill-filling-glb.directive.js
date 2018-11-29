(function () {
    "use strict"
    angular
        .module("Application")
        .directive("shippingbillfilling", ShippingBillFilling)
        .directive("exportSeaShipmentShippingBillFillingGlb", ExportSeaShipmentShippingBillFillingGlb);

    function ShippingBillFilling() {
        var exports = {
        restrict: "EA",
        templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-shipping-bill-filling-glb/export-sea-shipment-shipping-bill-filling-glb-task-list.html",
        link: Link,
        controller: "ExportSeaShipmentShippingBillFillingGlbController",
        controllerAs: "ExportSeaShipmentShippingBillFillingGlbCtrl",
        bindToController: true,
        scope: {
        taskObj: "="
        },
        link: Link
        };
        
        return exports;
        
        function Link(scope, elem, attr) { }
        }
    function ExportSeaShipmentShippingBillFillingGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-shipping-bill-filling-glb/export-sea-shipment-shipping-bill-filling-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentShippingBillFillingGlbController",
            controllerAs: "ExportSeaShipmentShippingBillFillingGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { 
            
        }
    }
})();
