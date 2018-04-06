(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickupanddeliveryMenu",PickupanddeliveryMenu);

    PickupanddeliveryMenu.$inject=[];

    function PickupanddeliveryMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/pickup-and-delivery/pickupandDelivery-menu/pickupandDelivery-menu.html",
            link: Link,
            controller: "PickupandDeliveryMenuController",
            controllerAs: "PickupandDeliveryMenuCtrl",
            scope: {
                currentPickupanddelivery: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();