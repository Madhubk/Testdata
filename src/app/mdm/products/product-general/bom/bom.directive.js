(function(){
    "use strict";

    angular
         .module("Application")
         .directive("bom",Bom);

    Bom.$inject = [];

    function Bom(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/bom/bom.html",
            link: Link,
            controller: "BomController",
            controllerAs: "BomCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();