(function(){
    "use strict";

    angular
         .module("Application")
         .directive("pickDocuments",PickDocuments);

    PickDocuments.$inject = [];

    function PickDocuments(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pick/pick-documents/pick-documents.html",
            link: Link,
            controller: "PickDocumentsController",
            controllerAs: "PickDocumentsCtrl",
            scope: {
                currentPick: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();