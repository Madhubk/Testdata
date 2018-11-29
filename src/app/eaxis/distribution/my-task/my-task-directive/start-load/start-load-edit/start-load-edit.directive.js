(function () {
    "use strict";

    angular
        .module("Application")
        .directive("startloadedit", StartLoadEditDirective);

    StartLoadEditDirective.$inject = [];

    function StartLoadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-load/start-load-edit/start-load-edit.html",
            controller: "StartLoadEditDirectiveController",
            controllerAs: "StartLoadEditCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) { }
    }
})();
