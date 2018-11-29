(function () {
    "use strict";

    angular
        .module("Application")
        .directive("stockTransferViewDetail", stockTransferViewDetail);

    stockTransferViewDetail.$inject = [];

    function stockTransferViewDetail() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view-detail/stock-transfer-view-detail.html",
            link: Link,
            controller: "StockTransferViewDetailController",
            controllerAs: "StockTransferViewDetailCtrl",
            scope: {
                currentStockTransferViewDetail: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();


