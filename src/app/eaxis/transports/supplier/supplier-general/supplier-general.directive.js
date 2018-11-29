(function(){
    "use strict";

    angular
         .module("Application")
         .directive("supplierGeneral",SupplierGeneral);

    SupplierGeneral.$inject = [];

    function SupplierGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/supplier/supplier-general/supplier-general.html",
            link: Link,
            controller: "SupplierGeneralController",
            controllerAs: "SupplierGeneralCtrl",
            scope: {
                currentSupplier: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();