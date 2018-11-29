(function () {
    "use strict"
    angular
        .module("Application")
        .directive("uploadDocument", UploadDocumentDirective);

    function UploadDocumentDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/upload-document/upload-document.html",
            link: Link,
            controller: "UploadDocumentController",
            controllerAs: "UploadDocumentCtrl",
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();
