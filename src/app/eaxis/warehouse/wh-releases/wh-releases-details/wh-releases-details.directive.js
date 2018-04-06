(function(){
    "use strict";

    angular
         .module("Application")
         .directive("releaseDetails",ReleaseDetails);

    ReleaseDetails.$inject=[];

    function ReleaseDetails(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/wh-releases-details/wh-releases-details.html",
            link: Link,
            controller: "ReleaseDetailsController",
            controllerAs: "ReleaseDetailsCtrl",
            scope: {
                currentRelease: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();