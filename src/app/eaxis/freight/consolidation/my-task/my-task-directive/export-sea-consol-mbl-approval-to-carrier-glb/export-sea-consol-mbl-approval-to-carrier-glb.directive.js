(function () {
    "use strict"
    angular
        .module("Application")
        .directive("mblapprovaltocarrier", MBLApprovalToCarrier)
        .directive("exportSeaConsolMblApprovalToCarrierGlb", ExportSeaConsolMblApprovalToCarrierGlb);

    function MBLApprovalToCarrier() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-mbl-approval-to-carrier-glb/export-sea-consol-mbl-approval-to-carrier-glb-task-list.html",
            link: Link,
            controller: "ExpSeaConsolMblApprovalToCarrierGlbController",
            controllerAs: "ExpSeaConsolMblApprovalToCarrierGlbDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolMblApprovalToCarrierGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-mbl-approval-to-carrier-glb/export-sea-consol-mbl-approval-to-carrier-glb-activity.html",
            link: Link,
            controller: "ExpSeaConsolMblApprovalToCarrierGlbController",
            controllerAs: "ExpSeaConsolMblApprovalToCarrierGlbDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();