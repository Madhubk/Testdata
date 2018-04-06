(function () {
    "use strict";

    angular
        .module("Application")
        .directive("stocktransferEntry", StocktransferEntry);

    StocktransferEntry.$inject = [];

    function StocktransferEntry() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/stock-transfer/stock-transfer-entry/stock-transfer-entry.html",
            link: Link,
            controller: "StocktransferEntryController",
            controllerAs: "StocktransferEntryCtrl",
            scope: {
                currentStockTransfer: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();