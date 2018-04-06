(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardAsnLines",InwardAsnLines);

    InwardAsnLines.$inject=[];

    function InwardAsnLines(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-asnlines/inward-asnlines.html",
            link: Link,
            controller: "InwardAsnLinesController",
            controllerAs: "InwardAsnLinesCtrl",
            scope: {
                currentInward: "=",
                activeMenu:"="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();