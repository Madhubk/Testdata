(function () {
    "use strict"
    angular
        .module("Application")
        .directive("uploadDocumentOrd", UploadDocumentOrdDirective);

    function UploadDocumentOrdDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/upload-document-ord/upload-document-ord.html",
            link: Link,
            controller: "UploadDocumentOrdController",
            controllerAs: "UploadDocumentOrdCtrl",
            bindToController: true,
            scope: {
                input: "=",
                isUploaded: "&",
                docTypeDsc: "=",
                mode: "=",
                allowToUpload: "=",
                docVisible: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

})();