(function(){
    "use strict";

    angular
         .module("Application")
         .directive("organization",Organization);

    Organization.$inject = [];

    function Organization(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/products/product-general/related-organization/organization.html",
            link: Link,
            controller: "OrganizationController",
            controllerAs: "OrganizationCtrl",
            scope: {
                currentProduct: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();