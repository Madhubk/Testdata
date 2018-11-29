(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptrejectedit", ExceptRejectEditDirective);

    ExceptRejectEditDirective.$inject = [];

    function ExceptRejectEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject-edit/except-reject-edit.html",
            controller: "ExceptRejectEditDirectiveController",
            controllerAs: "ExceptRejectEditDirectiveCtrl",
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
