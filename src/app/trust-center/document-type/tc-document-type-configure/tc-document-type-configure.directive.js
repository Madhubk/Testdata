(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tcDocumentTypeConfigure", TCDocumentTypeConfigure);

        TCDocumentTypeConfigure.$inject = [];

    function TCDocumentTypeConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/document-type/tc-document-type-configure/tc-document-type-configure.html",
            link: Link,
            controller: "TCDocumentTypeConfigureController",
            controllerAs: "TCDocumentTypeConfigureCtrl",
            scope: {
                currentDocumentType: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
