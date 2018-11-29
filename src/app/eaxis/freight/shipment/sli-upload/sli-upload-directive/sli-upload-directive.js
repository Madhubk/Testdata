(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shpSliUploadDirective", ShpSLIUploadDirective);

    ShpSLIUploadDirective.$inject = [];

    function ShpSLIUploadDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/sli-upload/sli-upload-directive/sli-upload-directive.html",
            link: Link,
            controller: "ShpSLIUploadDirectiveController",
            controllerAs: "ShpSLIUploadDirectiveCtrl",
            scope: {
                currentSli: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();