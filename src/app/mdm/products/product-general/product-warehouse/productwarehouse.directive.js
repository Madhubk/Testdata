(function(){
    "use strict";

    angular
         .module("Application")
         .directive("productWarehouse",ProductWarehouse);

    ProductWarehouse.$inject = [];

    function ProductWarehouse(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/product-warehouse/productwarehouse.html",
            link: Link,
            controller: "ProductWarehouseController",
            controllerAs: "ProductWarehouseCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();