(function(){
    "use strict";

    angular
         .module("Application")
         .directive("mhuMenu",MhuMenu);

    MhuMenu.$inject=[];

    function MhuMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/mdm/transports/mhu/mhu-menu/mhu-menu.html",
            link: Link,
            controller: "MhuMenuController",
            controllerAs: "MhuMenuCtrl",
            scope: {
                currentMhu: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();