(function () {
    "use strict";

    angular
        .module("Application")
        .directive("quickbookrejectbranchedit", QuickBookRejectBranchEditDirective)
        .directive("quickbookrejectsupplieredit", QuickBookRejectSupplierEditDirective);

    QuickBookRejectBranchEditDirective.$inject = [];
    QuickBookRejectSupplierEditDirective.$inject = [];

    function QuickBookRejectBranchEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject-edit/quick-book-reject-branch-edit.html",
            controller: "QuickBookRejectBranchEditDirectiveController",
            controllerAs: "QuickBookRejectBranchEditDirectiveCtrl",
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

    function QuickBookRejectSupplierEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject-edit/quick-book-reject-supplier-edit.html",
            controller: "QuickBookRejectSupplierEditDirectiveController",
            controllerAs: "QuickBookRejectSupplierEditDirectiveCtrl",
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