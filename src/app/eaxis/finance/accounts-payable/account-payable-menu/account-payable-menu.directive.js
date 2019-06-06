(function () {
    "use strict";

    angular.module("Application")
        .directive("accountPayableMenu", AccountPayableMenu);

    AccountPayableMenu.$inject = [];

    function AccountPayableMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/finance/accounts-payable/account-payable-menu/account-payable-menu.html",
            controller: "AccountPayableMenuController",
            controllerAs: "AccountPayableMenuCtrl",
            link: Link,
            scope: {
                currentAccountPayable: "=",
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();