(function(){
    "use strict";

    angular
         .module("Application")
         .directive("cycleCountGeneral",CycleCountGeneral);

    CycleCountGeneral.$inject = [];

    function CycleCountGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/cycle-count/cycle-count-general/cycle-count-general.html",
            link: Link,
            controller: "CycleCountGeneralController",
            controllerAs: "CycleCountGeneralCtrl",
            scope: {
                currentCycleCount: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();