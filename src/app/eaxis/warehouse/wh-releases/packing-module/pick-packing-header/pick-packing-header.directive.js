(function(){
    "use strict";

    angular
         .module("Application")
         .directive("packingHeader",PackingHeader);

    PackingHeader.$inject = [];

    function PackingHeader(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/packing-module/pick-packing-header/pick-packing-header.html",
            link: Link,
            controller: "PackingHeaderController",
            controllerAs: "PackingHeaderCtrl",
            scope: {
                currentPick: "=",
                currentOutward:"=",
                currentHeader:"=",
                outwardHeader:"="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();