(function(){
    "use strict";

    angular
         .module("Application")
         .directive("releasesPickSlip",ReleasesPickSlip);

    ReleasesPickSlip.$inject = [];

    function ReleasesPickSlip(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/wh-releases-pickslip/wh-releases-pickslip.html",
            link: Link,
            controller: "ReleasesPickSlipController",
            controllerAs: "ReleasesPickSlipCtrl",
            scope: {
                currentRelease: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();