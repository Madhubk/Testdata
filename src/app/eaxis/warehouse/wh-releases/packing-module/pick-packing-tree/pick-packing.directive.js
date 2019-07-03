(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickPacking",PickPacking);

         PickPacking.$inject = [];

    function PickPacking(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/packing-module/pick-packing-tree/pick-packing.html",
            link: Link,
            controller: "PickPackingController",
            controllerAs: "PickPackingCtrl",
            scope: {
                currentPick: "=",
                currentHeader:"="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();