(function () {
    "use strict";

    angular
        .module("Application")
        .directive("poBatchUploadDirective", PoBatchUploadDirective);

    PoBatchUploadDirective.$inject = [];

    function PoBatchUploadDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/po-batch-upload/po-batch-upload-directive/po-batch-upload-directive.html",
            link: Link,
            controller: "PoBatchUploadDirectiveController",
            controllerAs: "PoBatchUploadDirectiveDirectiveCtrl",
            scope: {
                currentBatch: "=",
                addTab: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
