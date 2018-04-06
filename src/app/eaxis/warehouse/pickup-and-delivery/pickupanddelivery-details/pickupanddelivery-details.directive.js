(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickupanddeliveryDetail",PickupanddeliveryDetail);

    PickupanddeliveryDetail.$inject=[];

    function PickupanddeliveryDetail(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/pickup-and-delivery/pickupanddelivery-details/pickupanddelivery-details.html",
            link: Link,
            controller: "PickupanddeliverydetailController",
            controllerAs: "PickupanddeliverydetailCtrl",
            scope: {
                currentPickupanddelivery: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();