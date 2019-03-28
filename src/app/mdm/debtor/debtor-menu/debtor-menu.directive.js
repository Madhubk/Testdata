(function () {
    "use strict";

    angular.module("Application")
        .directive("debtorMenu", DebtorMenu);

    DebtorMenu.$inject = [];

    function DebtorMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/debtor/debtor-menu/debtor-menu.html",
            link: Link,
            controller: "DebtorMenuController",
            controllerAs: "DebtorMenuCtrl",
            scope: {
                currentDebtor: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();