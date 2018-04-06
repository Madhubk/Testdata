(function(){
    "use strict";

    angular
         .module("Application")
         .directive("releaseMenu",ReleaseMenu);

    ReleaseMenu.$inject=[];

    function ReleaseMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/wh-releases-menu/wh-releases-menu.html",
            link: Link,
            controller: "ReleaseMenuController",
            controllerAs: "ReleaseMenuCtrl",
            scope: {
                currentRelease: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();