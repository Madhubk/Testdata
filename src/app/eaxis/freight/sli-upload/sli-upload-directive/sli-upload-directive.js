(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sliUploadDirective", SLIUploadDirective);

    SLIUploadDirective.$inject = [];

    function SLIUploadDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/sli-upload/sli-upload-directive/sli-upload-directive.html",
            link: Link,
            controller: "SLIUploadDirectiveController",
            controllerAs: "SLIUploadDirectiveCtrl",
            scope: {
                currentSli: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();