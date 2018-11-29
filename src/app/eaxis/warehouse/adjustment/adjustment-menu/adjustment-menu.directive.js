(function(){
    "use strict";

    angular
         .module("Application")
         .directive("adjustmentMenu",AdjustmentMenu);

    AdjustmentMenu.$inject=[];

    function AdjustmentMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/adjustment/adjustment-menu/adjustment-menu.html",
            link: Link,
            controller: "AdjustmentMenuController",
            controllerAs: "AdjustmentMenuCtrl",
            scope: {
                currentAdjustment: "=",
                dataentryObject:'='
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();