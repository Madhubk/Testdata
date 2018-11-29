(function(){
    "use strict";

    angular
         .module("Application")
         .directive("gatePass",GatePass);

         GatePass.$inject=[];

    function GatePass(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/distribution/manifest-transaction/gatepass/gatepass.html",
            link: Link,
            controller: "GatePassController",
            controllerAs: "GatePassCtrl",
            scope: {
                currentGatePass: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();