(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickupandDeliveryMenu",PickupandDeliveryMenu);

    PickupandDeliveryMenu.$inject=[];

    function PickupandDeliveryMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/pickupandDelivery/pickupanddelivery-menu/PickupandDelivery-menu.html",
            link: Link,
            controller: "PickupandDeliveryMenuController",
            controllerAs: "PickupandDeliveryMenuCtrl",
            scope: {
                currentPickupandDelivery: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();