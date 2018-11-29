(function(){
    "use strict";

    angular
         .module("Application")
         .directive("cycleCountViewDetail",cycleCountViewDetail);

    cycleCountViewDetail.$inject = [];

    function cycleCountViewDetail(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view-detail/cycle-count-view-detail.html",
            link: Link,
            controller: "CycleCountViewDetailController",
            controllerAs: "CycleCountViewDetailCtrl",
            scope: {
                currentCycleCountViewDetail: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();


