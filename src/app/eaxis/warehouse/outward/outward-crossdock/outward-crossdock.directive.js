(function(){
    "use strict";

    angular
         .module("Application")
         .directive("outwardCrossdock",OutwardCrossdock);

    OutwardCrossdock.$inject = [];

    function OutwardCrossdock(){
        var exports = {
            restrict : "EA",
            templateUrl : "app/eaxis/warehouse/outward/outward-crossdock/outward-crossdock.html",
            link : Link,
            controller : "OutwardCrossdockController",
            controllerAs : "OutwardCrossdockCtrl",
            scope : {
                currentOutward : "="
            },
            bindToController : true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();