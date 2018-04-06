(function(){
    "use strict";

    angular
         .module("Application")
         .directive("transVehiclemove",TransVehiclemove);

    TransVehiclemove.$inject=[];

    function TransVehiclemove(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/transport/transport-vehiclemovement/transport-vehiclemovement.html",
            link: Link,
            controller: "TransportVehicleMovementController",
            controllerAs: "TransVehiclemoveCtrl",
            scope: {
                currentTransport: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();