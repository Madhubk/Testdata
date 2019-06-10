(function(){
    "use strict";

    angular
         .module("Application")
         .directive("packingGeneral",PackingGeneral);

    PackingGeneral.$inject = [];

    function PackingGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pick/packing-module/pick-packing-general/pick-packing-general.html",
            link: Link,
            controller: "PackingGeneralController",
            controllerAs: "PackingGeneralCtrl",
            scope: {
                currentPick: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();