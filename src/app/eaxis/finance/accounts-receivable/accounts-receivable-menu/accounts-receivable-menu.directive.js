(function () {
    "use strict";

    angular.module("Application")
        .directive("accountReceivableMenu", AccountReceivableMenu);

    AccountReceivableMenu.$inject = [];

    function AccountReceivableMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/finance/accounts-receivable/accounts-receivable-menu/accounts-receivable-menu.html",
            controller: "AccountReceivableMenuController",
            controllerAs: "AccountReceivableMenuCtrl",
            link: Link,
            scope: {
                currentAccountReceivable: "=",
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();