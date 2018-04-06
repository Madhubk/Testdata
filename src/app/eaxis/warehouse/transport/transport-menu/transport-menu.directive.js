(function(){
    "use strict";

    angular
         .module("Application")
         .directive("transportMenu",TransportMenu);

    TransportMenu.$inject=[];

    function TransportMenu(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/transport/transport-menu/transport-menu.html",
            link: Link,
            controller: "TransportMenuController",
            controllerAs: "TransportMenuCtrl",
            scope: {
                currentTransport: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();