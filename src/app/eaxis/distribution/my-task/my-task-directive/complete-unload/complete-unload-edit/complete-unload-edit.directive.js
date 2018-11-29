(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completeunloadedit", CompleteUnloadEditDirective);

    CompleteUnloadEditDirective.$inject = [];

    function CompleteUnloadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload-edit/complete-unload-edit.html",
            controller: "CompleteUnloadEditDirectiveController",
            controllerAs: "CompleteUnloadEditCtrl",
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
