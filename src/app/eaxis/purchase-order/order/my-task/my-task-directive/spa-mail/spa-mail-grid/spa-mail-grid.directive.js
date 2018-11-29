(function () {
    "use strict";

    angular
        .module("Application")
        .directive("spaMailGridDirective", SPAMailGridDirective);

    SPAMailGridDirective.$inject = [];

    function SPAMailGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-grid/spa-mail-grid-directive.html",
            link: Link,
            controller: "SPAMailGridDirectiveController",
            controllerAs: "SPAMailGridDirectiveCtrl",
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