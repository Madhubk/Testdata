(function () {
    "use strict"
    angular
        .module("Application")
        .directive("waitforliner", WaitforLiner)
        .directive("exportSeaShipmentWaitForLinerGlb", ExportSeaShipmentWaitForLinerGlb);

    function WaitforLiner() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-wait-for-liner-glb/export-sea-shipment-wait-for-liner-glb-task-list.html",
            link: Link,
            controller: "ExportSeaShipmentWaitingforlinerorCFSGlbController",
            controllerAs: "ExportSeaShipmentWaitingforlinerorCFSGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaShipmentWaitForLinerGlb() {
        var exports = {
            restrict: "EA",
            templateUrl:"app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-wait-for-liner-glb/export-sea-shipment-wait-for-liner-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentWaitingforlinerorCFSGlbController",
            controllerAs: "ExportSeaShipmentWaitingforlinerorCFSGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
