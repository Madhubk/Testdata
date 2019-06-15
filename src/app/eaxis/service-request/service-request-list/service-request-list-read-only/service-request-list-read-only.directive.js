(function(){
    "use strict";

    angular
         .module("Application")
         .directive("serviceRequestListReadOnly",ServiceRequestListReadOnly);

    ServiceRequestListReadOnly.$inject = [];

    function ServiceRequestListReadOnly(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/service-request-list/service-request-list-read-only/service-request-list-read-only.html",
            link: Link,
            controller: "ServiceRequestListReadOnlyController",
            controllerAs: "ServiceRequestListReadOnlyCtrl",
            scope: {
                currentServiceRequestListReadOnly: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();