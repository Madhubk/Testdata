(function () {
    "use strict"
    angular
        .module("Application")
        .directive("approvembl", ApproveMBL)
        .directive("exportSeaConsolApproveMblGlb", ExportSeaConsolApproveMBLGlb)

    function ApproveMBL() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-glb/export-sea-consol-approve-mbl-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolApproveMBLGlbController",
            controllerAs: "ExportSeaConsolApproveMBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolApproveMBLGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-approve-mbl-glb/export-sea-consol-approve-mbl-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolApproveMBLGlbController",
            controllerAs: "ExportSeaConsolApproveMBLGlbCtrl",
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