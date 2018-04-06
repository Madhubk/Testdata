(function(){
    "use strict";

    angular
         .module("Application")
         .directive("cycleCountLine",CycleCountLine);

    CycleCountLine.$inject = [];

    function CycleCountLine(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/cycle-count/cycle-count-line/cycle-count-line.html",
            link: Link,
            controller: "CycleCountLineController",
            controllerAs: "CycleCountLineCtrl",
            scope: {
                currentCycleCount: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();