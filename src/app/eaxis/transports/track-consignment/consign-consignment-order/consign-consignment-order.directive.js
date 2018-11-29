(function(){
    "use strict";

    angular
         .module("Application")
         .directive("consignmentOrder",ConsignmentOrder);

    ConsignmentOrder.$inject = [];

    function ConsignmentOrder(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-consignment/consign-consignment-order/consign-consignment-order.html",
            link: Link,
            controller: "ConsignmentOrderController",
            controllerAs: "ConsignmentOrderCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();