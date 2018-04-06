(function(){
    "use strict";

    angular
         .module("Application")
         .directive("transportPickupanddelivery",TransportPickupanddelivery);

    TransportPickupanddelivery.$inject=[];

    function TransportPickupanddelivery(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/transport/transport-pickupanddelivery/transport-pickupanddelivery.html",
            link: Link,
            controller: "TransportPickupanddeliveryController",
            controllerAs: "TransportPickupanddeliveryCtrl",
            scope: {
                currentTransport: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();