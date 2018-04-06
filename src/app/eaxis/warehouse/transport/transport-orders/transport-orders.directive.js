(function(){
    "use strict";

    angular
         .module("Application")
         .directive("transportOrders",TransportOrders);

    TransportOrders.$inject=[];

    function TransportOrders(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/transport/transport-orders/transport-orders.html",
            link: Link,
            controller: "TransportOrdersController",
            controllerAs: "TransOrdersCtrl",
            scope: {
                currentTransport: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();