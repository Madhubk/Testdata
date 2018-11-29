(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmchecklist", ConfirmChecklist)
        .directive("exportSeaShipmentConfirmChecklistGlb", ExportSeaShipmentConfirmChecklistGlb);

    function ConfirmChecklist() {
        var exports = {
        restrict: "EA",
        templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-checklist-glb/export-sea-shipment-confirm-checklist-glb-task-list.html",
        link: Link,
        controller: "ExportSeaShipmentConfirmChecklistGlbController",
        controllerAs: "ExportSeaShipmentConfirmChecklistGlbCtrl",
        bindToController: true,
        scope: {
        taskObj: "="
        },
        link: Link
        };
        
        return exports;
        
        function Link(scope, elem, attr) { }
        }
    function ExportSeaShipmentConfirmChecklistGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-checklist-glb/export-sea-shipment-confirm-checklist-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentConfirmChecklistGlbController",
            controllerAs: "ExportSeaShipmentConfirmChecklistGlbCtrl",
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
