(function () {
    "use strict"
    angular
        .module("Application")
        .directive("clarifychecklist", ClarifyChecklist)
        .directive("exportSeaShipmentClarifyChecklistGlb", ExportSeaShipmentClarifyChecklistGlb);

    function ClarifyChecklist() {
        var exports = {
        restrict: "EA",
        templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-clarify-checklist-glb/export-sea-shipment-clarify-checklist-glb-task-list.html",
        link: Link,
        controller: "ExportSeaShipmentClarifyChecklistGlbController",
        controllerAs: "ExportSeaShipmentClarifyChecklistGlbCtrl",
        bindToController: true,
        scope: {
        taskObj: "="
        },
        link: Link
        };
        
        return exports;
        
        function Link(scope, elem, attr) { }
        }
    function ExportSeaShipmentClarifyChecklistGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-clarify-checklist-glb/export-sea-shipment-clarify-checklist-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentClarifyChecklistGlbController",
            controllerAs: "ExportSeaShipmentClarifyChecklistGlbCtrl",
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
