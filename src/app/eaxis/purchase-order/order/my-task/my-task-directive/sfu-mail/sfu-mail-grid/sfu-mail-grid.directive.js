(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfuMailGridDirective", SFUMailGridDirective);

    SFUMailGridDirective.$inject = [];

    function SFUMailGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid-directive.html",
            link: Link,
            controller: "SFUMailGridDirectiveController",
            controllerAs: "SFUMailGridDirectiveCtrl",
            scope: {
                input: "=",
                gridChange: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();