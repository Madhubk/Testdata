(function () {
    "use strict"
    angular
        .module("Application")
        .directive("viewDocumentOrd", ViewDocumentOrdDirective);

    function ViewDocumentOrdDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/view-document-ord/view-document-ord.html",
            link: Link,
            controller: "ViewDocumentOrdController",
            controllerAs: "ViewDocumentOrdCtrl",
            bindToController: true,
            scope: {
                input: "=",
                isDocumentUploaded: "=",
                mode: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

})();