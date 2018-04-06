(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickGeneral",PickGeneral);

    PickGeneral.$inject = [];

    function PickGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pick/pick-general/pick-general.html",
            link: Link,
            controller: "PickGeneralController",
            controllerAs: "PickGeneralCtrl",
            scope: {
                currentPick: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();