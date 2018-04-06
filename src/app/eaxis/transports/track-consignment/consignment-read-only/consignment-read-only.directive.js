(function(){
    "use strict";

    angular
         .module("Application")
         .directive("consignmentReadOnly",ConsignmentReadOnly);

    ConsignmentReadOnly.$inject = [];

    function ConsignmentReadOnly(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-consignment/consignment-read-only/consignment-read-only.html",
            link: Link,
            controller: "ConsignmentReadOnlyController",
            controllerAs: "ConsignmentReadOnlyCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();