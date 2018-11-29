(function () {
    "use strict"
    angular
        .module("Application")
        .directive("prealert", PreAlert)
        .directive("exportSeaConsolPreAlertGlb", ExportSeaConsolPreAlertGlb)

    function PreAlert() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-pre-alert-glb/export-sea-consol-pre-alert-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolPreAlertGlbController",
            controllerAs: "ExportSeaConsolPreAlerGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolPreAlertGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-pre-alert-glb/export-sea-consol-pre-alert-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolPreAlertGlbController",
            controllerAs: "ExportSeaConsolPreAlerGlbCtrl",
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