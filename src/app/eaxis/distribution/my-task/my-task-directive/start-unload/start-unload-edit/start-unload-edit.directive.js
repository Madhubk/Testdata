(function () {
    "use strict";

    angular
        .module("Application")
        .directive("startunloadedit", StartUnloadEditDirective);

    StartUnloadEditDirective.$inject = [];

    function StartUnloadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload-edit/start-unload-edit.html",
            controller: "StartUnloadEditDirectiveController",
            controllerAs: "StartUnloadEditCtrl",
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
