(function(){
    "use strict";

    angular
         .module("Application")
         .directive("conversions",Conversions);

    Conversions.$inject = [];

    function Conversions(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/unit-conversions/conversions.html",
            link: Link,
            controller: "ConversionsController",
            controllerAs: "ConversionsCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();