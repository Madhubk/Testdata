(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickupanddeliveryGeneral",PickupanddeliveryGeneral);

    PickupanddeliveryGeneral.$inject=[];

    function PickupanddeliveryGeneral(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/pickup-and-delivery/general/pickupanddelivery-general.html",
            link: Link,
            controller: "PickupanddeliveryGeneralController",
            controllerAs: "PickupanddeliveryGeneralCtrl",
            scope: {
                currentPickupanddelivery: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();