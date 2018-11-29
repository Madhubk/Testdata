(function(){
    "use strict";

    angular.module("Application")
    .directive("batchUploadDetails",BatchUploadDetails)

    BatchUploadDetails.$inject=[];
    function BatchUploadDetails(){

        var exports = {
            restrict : "EA",
            templateUrl: "app/eaxis/warehouse/batch-upload-process/details/details.html",
            link: Link,
            controller: "BatchUploadDetailsController",
            controllerAs: "BatchUploadDetailsCtrl",
            scope: {
                currentProcess:"="
            },
            bindToController: true

        };
        return exports;
        
        function Link(scope, elem, attr) {}
    }
})();