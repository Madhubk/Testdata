(function(){
    "use strict";

    angular
         .module("Application")
         .directive("barcodes",Barcodes);

    Barcodes.$inject = [];

    function Barcodes(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/barcodes/barcodes.html",
            link: Link,
            controller: "BarcodesController",
            controllerAs: "BarcodesCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();