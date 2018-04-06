(function(){
    "use strict";

    angular
         .module("Application")
         .directive("transportGeneral",TransportGeneral);

    TransportGeneral.$inject=[];

    function TransportGeneral(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/transport/general/transport-general.html",
            link: Link,
            controller: "TransportGeneralController",
            controllerAs: "TransGeneralCtrl",
            scope: {
                currentTransport: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();