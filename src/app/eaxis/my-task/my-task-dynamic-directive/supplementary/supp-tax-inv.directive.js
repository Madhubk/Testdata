/*
    revcostandrevupl : Review Cost and Revenue Upload
    raisupptaxinv : Raise Supplementary Tax Invoice
    versupptaxinv : Verify Supplementary Tax Invoice
    amnsupptaxinv : Amend Supplementary Tax Invoice
    dissupptaxinv : Dispatch Supplementary Tax Invoice
 */
(function () {
    "use strict";

    angular
        .module("Application")
        .directive("revcostandrevupl", RevCostAndRevUplDirective)
        .directive("raisupptaxinv", RaiseSuppTaxInvDirective)
        .directive("versupptaxinv", VerifySuppTaxInvDirective)
        .directive("amnsupptaxinv", AmendSuppTaxInvDirective)
        .directive("dissupptaxinv", DispatchSuppTaxInvDirective);


    function RevCostAndRevUplDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/revcost-revenue-upl/revcost-revenue-upl.html",
            link: Link,
            controller: "RevCostandRevUplDirController",
            controllerAs: "RevCostandRevUplDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function RaiseSuppTaxInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/raise-supp-tax-inv/raise-supp-tax-inv.html",
            link: Link,
            controller: "RaiseSuppTaxInvDirController",
            controllerAs: "RaiseSuppTaxInvDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function VerifySuppTaxInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/verify-supp-tax-inv/verify-supp-tax-inv.html",
            link: Link,
            controller: "VerifySuppTaxInvDirController",
            controllerAs: "VerifySuppTaxInvDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function AmendSuppTaxInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/amend-supp-tax-inv/amend-supp-tax-inv.html",
            link: Link,
            controller: "AmendSupptaxInvDirController",
            controllerAs: "AmendSupptaxInvDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function DispatchSuppTaxInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/supplementary/dispatch-supp-tax-inv/dispatch-supp-tax-inv.html",
            link: Link,
            controller: "DispatchSuppTaxInvDirController",
            controllerAs: "DipatchSuppTaxInvDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

})();