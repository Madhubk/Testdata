(function(){
    "use strict";

    angular
         .module("Application")
         .directive("inwardDocument",InwardDocument);

    InwardDocument.$inject=[];

    function InwardDocument(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-document/inward-document.html",
            link: Link,
            controller: "InwardDocumentController",
            controllerAs: "InwardDocumentCtrl",
            scope: {
                currentInward: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();