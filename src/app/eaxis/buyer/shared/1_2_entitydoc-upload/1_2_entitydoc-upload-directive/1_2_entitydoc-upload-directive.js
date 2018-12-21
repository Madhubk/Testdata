(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoEntityDocUploadDirective", oneTwoEntityDocUploadDirective);

    oneTwoEntityDocUploadDirective.$inject = [];

    function oneTwoEntityDocUploadDirective() {
        debugger
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/shared/1_2_entitydoc-upload/1_2_entitydoc-upload-directive/1_2_entitydoc-upload-directive.html",
           
            link: Link,
            controller: "oneTwoEntityDocUploadDirectiveController",
            controllerAs: "oneTwoEntityDocUploadDirectiveCtrl",
            scope: {
                currentAsn: "=",
                titleName:"=",
                docType:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();