(function(){
    "use strict";

    angular
         .module("Application")
         .directive("stockTransferMenu",StockTransferMenu);

    StockTransferMenu.$inject=[];

    function StockTransferMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/stock-transfer/stock-transfer-menu/stock-transfer-menu.html",
            link: Link,
            controller: "StockTransferMenuController",
            controllerAs: "StockTransferMenuCtrl",
            scope: {
                currentStockTransfer: "=",
                dataentryObject:'='
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();