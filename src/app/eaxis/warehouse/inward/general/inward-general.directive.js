(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardGeneral",InwardGeneral);

    InwardGeneral.$inject = [];

    function InwardGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/inward/general/inward-general.html",
            link: Link,
            controller: "InwardGeneralController",
            controllerAs: "InwardGeneralCtrl",
            scope: {
                currentInward: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();