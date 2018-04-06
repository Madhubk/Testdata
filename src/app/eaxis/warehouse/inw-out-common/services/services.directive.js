(function(){
    "use strict";

    angular
         .module("Application")
         .directive("services",Services);

    Services.$inject=[];

    function Services(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/inw-out-common/services/services.html",
            link: Link,
            controller: "ServiceController",
            controllerAs: "ServiceCtrl",
            scope: {
                currentInward: "=",
                currentOutward : "=",

            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();