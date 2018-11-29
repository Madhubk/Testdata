(function () {
    "use strict"
    angular
        .module("Application")
        .directive("approvemblhbl", ApproveMBLHBL)
        .directive("exportSeaConsolApproveMblHblGlb", ExportSeaConsolApproveMblHblGlb)

    function ApproveMBLHBL() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-hbl-glb/export-sea-consol-approve-mbl-hbl-glb.task-list.html",
            link: Link,
            controller: "ExportSeaConsolApproveMBLHBLGlbController",
            controllerAs: "ExportSeaConsolApproveMBLHBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolApproveMblHblGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-hbl-glb/export-sea-consol-approve-mbl-hbl-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolApproveMBLHBLGlbController",
            controllerAs: "ExportSeaConsolApproveMBLHBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();