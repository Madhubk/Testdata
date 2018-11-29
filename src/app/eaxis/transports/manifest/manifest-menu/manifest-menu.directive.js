(function(){
    "use strict";

    angular
         .module("Application")
         .directive("adminmanifestMenu",ManifestMenu);

    ManifestMenu.$inject=[];

    function ManifestMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/transports/manifest/manifest-menu/manifest-menu.html",
            link: Link,
            controller: "ManifestMenuController",
            controllerAs: "ManifestMenuCtrl",
            scope: {
                currentManifest: "=",
                dataentryObject:"="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();