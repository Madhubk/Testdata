(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderAction", OrderAction);

    OrderAction.$inject = [];

    function OrderAction() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/order-action/order-action.html",
            controller: 'orderActionController',
            controllerAs: 'OrderActionCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
