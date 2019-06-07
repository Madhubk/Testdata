(function () {
    "use strict";

    angular.module("Application")
        .directive("accountPayableGeneral", AccountPayableGeneral);

    AccountPayableGeneral.$inject = [];

    function AccountPayableGeneral() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/finance/accounts-payable/account-payable-general/account-payable-general.html",
            controller: "AccountPayableGeneralController",
            controllerAs: "AccountPayableGeneralCtrl",
            link: Link,
            scope: {
                currentAccountPayable: "=",
            },
            bindToController: true,
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();