/*
    costandrevupl : Cost and Revenue Upload
    gentaxinv : Generate Tax Invoice
    vertaxinv : Dispatch Tax Invoice
    amntaxinv : Amend Tax Invoice
    distaxinv : Dispatch Tax Invoice
 */
(function () {
    "use strict";

    angular
        .module("Application")
        .directive("costandrevupl", CostAndRevUplDirective)
        .directive("gentaxinv", GenTaxInvDirectivTaxInv)
        .directive("verifytaxinv", VerifyTaxInvDirective)
        .directive("amntaxinv", AmnTaxInvDirective)
        .directive("dispatchtaxinv", DisTaxInvDirective);


    function CostAndRevUplDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/cost-revenue-upl/cost-revenue-upl.html",
            link: Link,
            controller: "CostandRevUplDirectiveController",
            controllerAs: "CostandRevUplDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function GenTaxInvDirectivTaxInv() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/generate-tax-invoice/generate-tax-invoice.html",
            link: Link,
            controller: "GenerateTaxInvDirectiveController",
            controllerAs: "GenerateTaxInvDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function VerifyTaxInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/verify-tax-invoice/verify-tax-invoice.html",
            link: Link,
            controller: "VerifyTaxInvDirectiveController",
            controllerAs: "VerifyTaxInvDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function AmnTaxInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/amend-tax-invoice/amend-tax-invoice-edit/amend-tax-invoice-edit.html",
            link: Link,
            controller: "AmendTaxInvDirectiveController",
            controllerAs: "AmendTaxInvDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function DisTaxInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/dispatch-tax-invoice/dispatch-tax-invoice.html",
            link: Link,
            controller: "DispatchTaxInvDirectiveController",
            controllerAs: "DispatchTaxInvDirectiveCtrl",
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