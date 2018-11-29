(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickAllocation",PickAllocation);

    PickAllocation.$inject = [];

    function PickAllocation(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pick/pick-allocation/pick-allocation.html",
            link: Link,
            controller: "PickAllocationController",
            controllerAs: "PickAllocationCtrl",
            scope: {
                currentPick: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();