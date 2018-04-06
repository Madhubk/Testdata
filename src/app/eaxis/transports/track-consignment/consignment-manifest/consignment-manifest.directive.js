(function(){
    "use strict";

    angular
         .module("Application")
         .directive("consignmentManifest",ConsignmentManifest);

    ConsignmentManifest.$inject = [];

    function ConsignmentManifest(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-consignment/consignment-manifest/consignment-manifest.html",
            link: Link,
            controller: "ConsignmentManifestController",
            controllerAs: "ConsignmentManifestCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();