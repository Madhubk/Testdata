(function(){
    "use strict";

    angular
         .module("Application")
         .directive("outwardLine",OutwardLine);

    OutwardLine.$inject=[];

    function OutwardLine(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/outward/outward-line/outward-line.html",
            link: Link,
            controller: "OutwardLineController",
            controllerAs: "OutwardLineCtrl",
            scope: {
                currentOutward: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();