(function(){
    "use strict";

    angular
         .module("Application")
         .directive("general",General);

    General.$inject = [];

    function General(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/general/general.html",
            link: Link,
            controller: "GeneralController",
            controllerAs: "GeneralCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();