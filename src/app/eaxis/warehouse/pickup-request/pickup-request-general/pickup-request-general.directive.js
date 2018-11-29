(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickupGeneral",PickupGeneral);

         PickupGeneral.$inject = [];

    function PickupGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pickup-request/pickup-request-general/pickup-request-general.html",
            link: Link,
            controller: "PickupGeneralController",
            controllerAs: "PickupGeneralCtrl",
            scope: {
                currentPickup: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();