(function(){
    "use strict";

    angular
         .module("Application")
         .directive("releasesDocuments",ReleasesDocuments);

    ReleasesDocuments.$inject = [];

    function ReleasesDocuments(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/wh-releases-documents/wh-releases-documents.html",
            link: Link,
            controller: "ReleasesDocumentsController",
            controllerAs: "ReleasesDocumentsCtrl",
            scope: {
                currentRelease: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();