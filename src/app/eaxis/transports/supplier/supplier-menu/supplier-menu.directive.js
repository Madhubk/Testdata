(function(){
    "use strict";

    angular
         .module("Application")
         .directive("supplierMenu",SupplierMenu);

    SupplierMenu.$inject=[];

    function SupplierMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/transports/supplier/supplier-menu/supplier-menu.html",
            link: Link,
            controller: "SupplierMenuController",
            controllerAs: "SupplierMenuCtrl",
            scope: {
                currentSupplier: "=",
                dataentryObject:"="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();