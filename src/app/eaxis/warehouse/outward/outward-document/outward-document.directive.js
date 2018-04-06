(function(){
    "use strict";

    angular
         .module("Application")
         .directive("outwardDocument",OutwardDocument);

    OutwardDocument.$inject=[];

    function OutwardDocument(){
        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/outward/outward-document/outward-document.html",
            link: Link,
            controller: "OutwardDocumentController",
            controllerAs: "OutwardDocumentCtrl",
            scope: {
                currentOutward: "="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }

})();