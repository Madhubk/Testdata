(function(){
    "use strict";

    angular
         .module("Application")
         .directive("deliveryGeneral",DeliveryGeneral);

         DeliveryGeneral.$inject = [];

    function DeliveryGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request/delivery-request-general/delivery-request-general.html",
            link: Link,
            controller: "DeliveryGeneralController",
            controllerAs: "DeliveryGeneralCtrl",
            scope: {
                currentDelivery: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();