(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOnePoBatchUploadDirective", oneOnePoBatchUploadDirective);

    oneOnePoBatchUploadDirective.$inject = [];

    function oneOnePoBatchUploadDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_po-batch-upload-directive/1_1_po-batch-upload-directive.html",
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