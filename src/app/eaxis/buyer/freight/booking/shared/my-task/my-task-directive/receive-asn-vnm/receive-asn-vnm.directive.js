(function () {
    "use strict";

    angular
        .module("Application")
        .directive("receiveasnvnm", ReceiveAsnVnmDirective);

    function ReceiveAsnVnmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/receive-asn-vnm/receive-asn-vnm.html",
            link: Link,
            controller: "ReceiveAsnVnmDirectiveController",
            controllerAs: "ReceiveAsnVnmDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();