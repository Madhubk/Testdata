(function () {
    "use strict"
    angular
        .module("Application")
        .directive("dispatchpostshipment", DispatchPostShipment)
        .directive("exportSeaConsolDispatchPostShipmentGlb", exportSeaConsolDispatchPostShipmentGlb)

    function DispatchPostShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-dispatch-post-shipment-glb/export-sea-consol-dispatch-post-shipment-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolDispatchPostShipmentGlbController",
            controllerAs: "ExportSeaConsolDispatchPostShipmentGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function exportSeaConsolDispatchPostShipmentGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-dispatch-post-shipment-glb/export-sea-consol-dispatch-post-shipment-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolDispatchPostShipmentGlbController",
            controllerAs: "ExportSeaConsolDispatchPostShipmentGlbCtrl",
            bindToController: true,
            scope: {
                CurrentObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();