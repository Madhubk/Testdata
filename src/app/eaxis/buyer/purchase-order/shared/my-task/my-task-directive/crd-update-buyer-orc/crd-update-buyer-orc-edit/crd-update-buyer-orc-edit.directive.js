(function () {
    "use strict";

    angular
        .module("Application")
        .directive("crdUpdateBranchEdit", CrdUpdateBranchEditDirective)
        .directive("crdUpdateSupplierEdit", CrdUpdateSupplierEditDirective);

    CrdUpdateBranchEditDirective.$inject = [];
    CrdUpdateSupplierEditDirective.$inject = [];

    function CrdUpdateBranchEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc-edit/crd-update-branch-edit.html",
            controller: "CrdUpdateBranchEditDirectiveController",
            controllerAs: "CrdUpdateBranchEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }

    function CrdUpdateSupplierEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc-edit/crd-update-supplier-edit.html",
            controller: "CrdUpdateSupplierEditDirectiveController",
            controllerAs: "CrdUpdateSupplierEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();