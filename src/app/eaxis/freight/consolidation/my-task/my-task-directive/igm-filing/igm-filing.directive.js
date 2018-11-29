(function () {
    "use strict"
    angular
        .module("Application")
        .directive("igmfiling", IGMFiling)
        .directive("igmacknowledgement", IGMAcknowledgement);

    function IGMFiling() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-filing/igm-filing.html",
            link: Link,
            controller: "IGMFilingController",
            controllerAs: "IGMFilingDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function IGMAcknowledgement() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-acknowledge/igm-acknowledge.html",
            link: Link,
            controller: "IGMAcknowledgementController",
            controllerAs: "IGMAcknowledgementDirCtrl",
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