(function () {
    "use strict";

    angular.module("Application")
        .directive("accountReceivableGeneral", AccountReceivableGeneral);

    AccountReceivableGeneral.$inject = [];

    function AccountReceivableGeneral() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/finance/accounts-receivable/accounts-receivable-general/accounts-receivable-general.html",
            controller: "AccountReceivableGeneralController",
            controllerAs: "AccountReceivableGeneralCtrl",
            link: Link,
            scope: {
                currentAccountReceivable: "=",
            },
            bindToController: true,
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();