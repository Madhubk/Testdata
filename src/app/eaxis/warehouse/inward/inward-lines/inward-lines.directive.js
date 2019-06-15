(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardLines",InwardLines);

    InwardLines.$inject=[];

    function InwardLines(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-lines/inward-lines.html",
            link: Link,
            controller: "InwardLinesController",
            controllerAs: "InwardLinesCtrl",
            scope: {
                currentInward: "=",
                enableAdd:"=",
                enableCopy:"=",
                enableDelete:"=",
                enableCustomize:"=",
                enableBulkUpload:"=",
                enableAllocateLocation:"=",
                enableUnitCalculation:"="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();