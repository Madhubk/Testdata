(function(){
    "use strict";

    angular
         .module("Application")
         .directive("cycleCountMenu",CycleCountMenu);

    CycleCountMenu.$inject=[];

    function CycleCountMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/cycle-count/cycle-count-menu/cycle-count-menu.html",
            link: Link,
            controller: "CycleCountMenuController",
            controllerAs: "CycleCountMenuCtrl",
            scope: {
                currentCycleCount: "=",
                dataentryObject:'='
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();