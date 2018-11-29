(function(){
    "use strict";

    angular
         .module("Application")
         .directive("deliveryDocument",DeliveryDocument);

    DeliveryDocument.$inject=[];

    function DeliveryDocument(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request/delivery-document/delivery-document.html",
            link: Link,
            controller: "DeliveryDocumentController",
            controllerAs: "DeliveryDocumentCtrl",
            scope: {
                currentDelivery: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();