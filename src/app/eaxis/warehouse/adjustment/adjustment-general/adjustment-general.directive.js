(function(){
    "use strict";

    angular
         .module("Application")
         .directive("adjustmentGeneral",AdjustmentGeneral);

    AdjustmentGeneral.$inject = [];

    function AdjustmentGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/adjustment/adjustment-general/adjustment-general.html",
            link: Link,
            controller: "AdjustmentGeneralController",
            controllerAs: "AdjustmentGeneralCtrl",
            scope: {
                currentAdjustment: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();