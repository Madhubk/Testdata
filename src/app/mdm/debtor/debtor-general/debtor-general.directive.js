(function () {
    "use strict";

    angular.module("Application")
        .directive("debtorGeneral", DebtorGeneral);

    DebtorGeneral.$inject = [];

    function DebtorGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/debtor/debtor-general/debtor-general.html",
            link: Link,
            controller: "DebtorGeneralController",
            controllerAs: "DebtorGeneralCtrl",
            scope: {
                currentDebtor: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();