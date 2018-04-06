(function(){
    "use strict";

    angular
         .module("Application")
         .directive("areasMenu",AreasMenu);

    AreasMenu.$inject=[];

    function AreasMenu(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/areas/areas-menu/areas-menu.html",
            link: Link,
            controller: "AreasMenuController",
            controllerAs: "AreasMenuCtrl",
            scope: {
                currentAreas: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();