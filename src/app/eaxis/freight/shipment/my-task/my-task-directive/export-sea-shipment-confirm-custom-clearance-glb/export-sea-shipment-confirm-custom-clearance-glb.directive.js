(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmcustomclearance", ConfirmCustomClearance)
        .directive("exportSeaShipmentConfirmCustomClearanceGlb", ExportSeaShipmentConfirmCustomClearanceGlb);

    function ConfirmCustomClearance() {
        var exports = {
        restrict: "EA",
        templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-custom-clearance-glb/export-sea-shipment-confirm-custom-clearance-glb-task-list.html",
        link: Link,
        controller: "ExportSeaShipmentConfirmCustomClearanceGlbController",
        controllerAs: "ExportSeaShipmentConfirmCustomClearanceGlbCtrl",
        bindToController: true,
        scope: {
        taskObj: "="
        },
        link: Link
        };
        
        return exports;
        
        function Link(scope, elem, attr) { }
        }
    function ExportSeaShipmentConfirmCustomClearanceGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-custom-clearance-glb/export-sea-shipment-confirm-custom-clearance-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentConfirmCustomClearanceGlbController",
            controllerAs: "ExportSeaShipmentConfirmCustomClearanceGlbCtrl",
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
