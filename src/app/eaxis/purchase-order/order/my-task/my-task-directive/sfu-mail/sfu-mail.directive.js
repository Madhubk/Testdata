(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfumail", SfuMailDirective);

    function SfuMailDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail.html",
            link: Link,
            controller: "SfuMailDirectiveController",
            controllerAs: "SfuMailDirectiveCtrl",
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