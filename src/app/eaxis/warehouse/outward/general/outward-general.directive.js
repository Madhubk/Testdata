(function(){
    "use strict";

    angular
         .module("Application")
         .directive("outwardGeneral",OutwardGeneral);

    OutwardGeneral.$inject = [];

    function OutwardGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/outward/general/outward-general.html",
            link: Link,
            controller: "OutwardGeneralController",
            controllerAs: "OutwardGeneralCtrl",
            scope: {
                currentOutward: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();