(function () {
    "use strict"
    angular
        .module("Application")
        .directive("vgmfilingedit", VGMFilingEditDirective)
        .directive("planvgmfilingedit", PlanVGMFilingEditDirective);

    function VGMFilingEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/vgm-filing/vgm-filing-edit/vgm-filing-edit.html",
            link: Link,
            controller: "VGMFilingEditController",
            controllerAs: "VGMFilingEditDirCtrl",
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

    function PlanVGMFilingEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/plan-vgm-filing/plan-vgm-filing-edit/plan-vgm-filing-edit.html",
            link: Link,
            controller: "PlanVGMFilingEditController",
            controllerAs: "PlanVgmFilingEditDirCtrl",
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
