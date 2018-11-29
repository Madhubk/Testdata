(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfucrdupdateedit", SfuCRDUpdateEditDirective);

    SfuCRDUpdateEditDirective.$inject = [];

    function SfuCRDUpdateEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-update-edit.html",
            controller: "SfuCRDUpdateEditDirectiveController",
            controllerAs: "SfuCRDUpdateEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();