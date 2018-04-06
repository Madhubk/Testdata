(function () {
    "use strict";

    angular
        .module("Application")
        .directive("spamail", SpaMailDirective);

    function SpaMailDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/Spa-mail/Spa-mail.html",
            link: Link,
            controller: "SpaMailDirectiveController",
            controllerAs: "SpaMailDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
