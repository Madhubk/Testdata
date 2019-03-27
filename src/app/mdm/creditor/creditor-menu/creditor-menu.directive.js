(function () {
    "use strict";

    angular.module("Application")
        .directive("creditorMenu", CreditorMenu);

    CreditorMenu.$inject = [];

    function CreditorMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/creditor/creditor-menu/creditor-menu.html",
            link: Link,
            controller: "CreditorMenuController",
            controllerAs: "CreditorMenuCtrl",
            scope: {
                currentCreditor: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();