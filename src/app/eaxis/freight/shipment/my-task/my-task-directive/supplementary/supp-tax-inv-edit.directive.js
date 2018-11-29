/*
    revcostandrevupl : Review Cost and Revenue Upload Edit
    raisesupptaxinv : Raise Supplementary Tax Invoice Edit
    versupptaxinv : Verify Supplementary Tax Invoice Edit
    amnsupptaxinv : Amend Supplementary Tax Invoice Edit
    dissupptaxinv : Dispatch Supplementary Tax Invoice Edit
 */
(function () {
    "use strict";

    angular
        .module("Application")
        .directive("revcostandrevupledit", RevCostAndRevUplEditDirective)
        .directive("raisupptaxinvedit", RaiseSuppTaxInvEditDirective)
        .directive("versupptaxinvedit", VerifySuppTaxInvEditDirective)
        .directive("amnsupptaxinvedit", AmendSuppTaxInvEditDirective)
        .directive("dissupptaxinvedit", DispatchSuppTaxInvEditDirective);

    function RevCostAndRevUplEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/revcost-revenue-upl/revcost-revenue-upl-edit/revcost-revenue-upl-edit.html",
            controller: "RevCostandRevUplEditDirController",
            controllerAs: "RevCostandRevUplEditDirCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }

    function RaiseSuppTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/raise-supp-tax-inv/raise-supp-tax-inv-edit/raise-supp-tax-inv-edit.html",
            controller: "RaiseSuppTaxInvEditDirController",
            controllerAs: "RaiseSuppTaxInvEditDirCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }

    function VerifySuppTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/verify-supp-tax-inv/verify-supp-tax-inv-edit/verify-supp-tax-inv-edit.html",
            controller: "VerifySuppTaxInvEditDirController",
            controllerAs: "VerifySuppTaxInvEditDirCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }

    function AmendSuppTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/amend-supp-tax-inv/amend-supp-tax-inv-edit/amend-supp-tax-inv-edit.html",
            controller: "AmendSupptaxInvEditDirController",
            controllerAs: "AmendSupptaxInvEditDirCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }

    function DispatchSuppTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/dispatch-supp-tax-inv/dispatch-supp-tax-inv-edit/dispatch-supp-tax-inv-edit.html",
            controller: "DispatchSuppTaxInvEditDirController",
            controllerAs: "DispatchSuppTaxInvEditDirCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();