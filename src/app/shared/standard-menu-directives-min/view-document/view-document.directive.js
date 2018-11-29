(function () {
    "use strict"
    angular
        .module("Application")
        .directive("viewDocument", ViewDocumentDirective);

    function ViewDocumentDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/view-document/view-document.html",
            link: Link,
            controller: "ViewDocumentController",
            controllerAs: "ViewDocumentCtrl",
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
