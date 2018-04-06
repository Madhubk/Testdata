(function(){
    "use strict";

    angular
         .module("Application")
         .directive("createmanifestGeneral",Createmanifest);

    Createmanifest.$inject = [];

    function Createmanifest(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/create-manifest/general/create-manifest-general.html",
            link: Link,
            controller: "CreatemanifestGeneralController",
            controllerAs: "CreatemanifestGeneralCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();