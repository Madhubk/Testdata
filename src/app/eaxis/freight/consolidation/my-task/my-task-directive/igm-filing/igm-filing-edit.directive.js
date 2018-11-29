(function () {
    "use strict"
    angular
        .module("Application")
        .directive("igmfilingedit", IGMFilingEdit)
        .directive("igmacknowledgementedit", IGMAcknowledgementEdit);

    function IGMFilingEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-filing/igm-filing-edit/igm-filing-edit.html",
            link: Link,
            controller: "IGMFilingEditController",
            controllerAs: "IGMFilingEditDirCtrl",
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

    function IGMAcknowledgementEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/igm-filing/igm-acknowledge/igm-acknowledge-edit/igm-acknowledge-edit.html",
            link: Link,
            controller: "IGMAcknowledgementEditController",
            controllerAs: "IGMAcknowledgeEditDirCtrl",
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