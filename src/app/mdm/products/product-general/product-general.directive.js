(function(){
    "use strict";

    angular
         .module("Application")
         .directive("productGeneral",ProductGeneral);

    ProductGeneral.$inject = [];

    function ProductGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/product-general.html",
            link: Link,
            controller: "ProductGeneralController",
            controllerAs: "ProductGeneralCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();