(function () {
    "use strict"
    angular
        .module("Application")
        .directive("jobcostsheet", JobCostSheet)
        .directive("exportSeaShipmentJobCostSheetGlb", ExportSeaShipmentJobCostSheetGlb);

    function JobCostSheet() {
        var exports = {
        restrict: "EA",
        templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-job-cost-sheet-glb/export-sea-shipment-job-cost-sheet-glb-task-list.html",
        link: Link,
        controller: "ExportSeaShipmentJobCostSheetGlbController",   
        controllerAs: "ExportSeaShipmentJobCostSheetGlbCtrl",
        bindToController: true,
        scope: {
        taskObj: "="
        },
        link: Link
        };
        
        return exports;
        
        function Link(scope, elem, attr) { }
        }
    function ExportSeaShipmentJobCostSheetGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-job-cost-sheet-glb/export-sea-shipment-job-cost-sheet-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentJobCostSheetGlbController",
            controllerAs: "ExportSeaShipmentJobCostSheetGlbCtrl",
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
