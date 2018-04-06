(function(){
    "use strict";

    angular
         .module("Application")
         .directive("additionalDetails",AdditionalDetails);

    AdditionalDetails.$inject = [];

    function AdditionalDetails(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/additional-details/additionaldetails.html",
            link: Link,
            controller: "AdditionalDetailsController",
            controllerAs: "AdditionalDetailsCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();