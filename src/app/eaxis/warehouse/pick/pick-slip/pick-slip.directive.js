(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickSlip",PickSlip);

    PickSlip.$inject = [];

    function PickSlip(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pick/pick-slip/pick-slip.html",
            link: Link,
            controller: "PickSlipController",
            controllerAs: "PickSlipCtrl",
            scope: {
                currentPick: "=",
                currentRelease: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();