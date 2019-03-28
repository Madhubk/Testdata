(function () {
    "use strict";

    angular.module("Application")
        .directive("creditorGeneral", creditorGeneral);

    creditorGeneral.$inject = [];

    function creditorGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/creditor/creditor-general/creditor-general.html",
            link: Link,
            controller: "CreditorGeneralController",
            controllerAs: "CreditorGeneralCtrl",
            scope: {
                currentCreditor: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();