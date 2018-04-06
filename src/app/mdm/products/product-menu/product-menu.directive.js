(function(){
    "use strict";

    angular
         .module("Application")
         .directive("productMenu",ProductMenu);

    ProductMenu.$inject=[];

    function ProductMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/mdm/products/product-menu/product-menu.html",
            link: Link,
            controller: "ProductMenuController",
            controllerAs: "ProductMenuCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();