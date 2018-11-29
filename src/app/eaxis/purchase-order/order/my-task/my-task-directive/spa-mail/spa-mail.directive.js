(function () {
    "use strict";

    angular
        .module("Application")
        .directive("spamail", SpaMailDirective);

    function SpaMailDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail.html",
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