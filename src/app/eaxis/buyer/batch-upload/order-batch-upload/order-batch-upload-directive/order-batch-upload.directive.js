(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOnePoBatchUploadDirective", oneOnePoBatchUploadDirective);

    oneOnePoBatchUploadDirective.$inject = [];

    function oneOnePoBatchUploadDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/batch-upload/order-batch-upload/order-batch-upload-directive/order-batch-upload-directive.html",
            link: Link,
            controller: "one_one_PoBatchUploadDirectiveController",
            controllerAs: "one_one_PoBatchUploadDirectiveCtrl",
            scope: {
                currentBatch: "=",
                modalClose: "&",
                addTab: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();