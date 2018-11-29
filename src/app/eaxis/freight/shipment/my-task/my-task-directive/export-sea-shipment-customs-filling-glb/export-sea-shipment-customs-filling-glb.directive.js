(function () {
    "use strict"
    angular
        .module("Application")
        .directive("customsfilling", CustomsFilling)
        .directive("exportSeaShipmentCustomsFillingGlb", ExportSeaShipmentCustomsFillingGlb);

    function CustomsFilling() {
        var exports = {
        restrict: "EA",
        templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-customs-filling-glb/export-sea-shipment-customs-filling-glb-task-list.html",
        link: Link,
        controller: "ExportSeaShipmentCustomsFillingGlbController",
        controllerAs: "ExportSeaShipmentCustomsFillingGlbCtrl",
        bindToController: true,
        scope: {
        taskObj: "="
        },
        link: Link
        };
        
        return exports;
        
        function Link(scope, elem, attr) { }
        }
    function ExportSeaShipmentCustomsFillingGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-customs-filling-glb/export-sea-shipment-customs-filling-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentCustomsFillingGlbController",
            controllerAs: "ExportSeaShipmentCustomsFillingGlbCtrl",
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
