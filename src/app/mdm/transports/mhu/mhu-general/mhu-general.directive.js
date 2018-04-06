(function(){
    "use strict";

    angular
         .module("Application")
         .directive("mhuGeneral",MhuGeneral);

    MhuGeneral.$inject = [];

    function MhuGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mhu/mhu-general/mhu-general.html",
            link: Link,
            controller: "MhuGeneralController",
            controllerAs: "MhuGeneralCtrl",
            scope: {
                currentMhu: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();