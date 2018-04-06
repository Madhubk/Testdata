(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickMenu",PickMenu);

    PickMenu.$inject=[];

    function PickMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/pick/pick-menu/pick-menu.html",
            link: Link,
            controller: "PickMenuController",
            controllerAs: "PickMenuCtrl",
            scope: {
                currentPick: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();