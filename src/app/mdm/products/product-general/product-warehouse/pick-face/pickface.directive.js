(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickface",Pickface);

    Pickface.$inject = [];

    function Pickface(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/product-warehouse/pick-face/pickface.html",
            link: Link,
            controller: "PickfaceController",
            controllerAs: "PickfaceCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();