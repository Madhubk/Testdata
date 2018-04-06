(function(){
    "use strict";

    angular
         .module("Application")
         .directive("consignmentItem",ConsignmentItem);

    ConsignmentItem.$inject = [];

    function ConsignmentItem(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-consignment/consign-consignment-item/consign-consignment-item.html",
            link: Link,
            controller: "ConsignmentItemController",
            controllerAs: "ConsignmentItemCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();