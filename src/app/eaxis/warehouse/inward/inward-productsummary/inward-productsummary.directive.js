(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardProductsummary",InwardProductsummary);

    InwardProductsummary.$inject=[];

    function InwardProductsummary(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-productsummary/inward-productsummary.html",
            link: Link,
            controller: "InwardProductsummaryController",
            controllerAs: "InwardProductsummaryCtrl",
            scope: {
                currentInward: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();