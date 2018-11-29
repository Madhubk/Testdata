(function(){
    "use strict";

    angular
         .module("Application")
         .directive("releasesGeneral",ReleasesGeneral);

    ReleasesGeneral.$inject = [];

    function ReleasesGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/wh-releases-general/wh-releases-general.html",
            link: Link,
            controller: "ReleasesGeneralController",
            controllerAs: "ReleasesGeneralCtrl",
            scope: {
                currentRelease: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();