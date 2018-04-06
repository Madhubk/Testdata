/*
    costandrevupl : Cost and Revenue Upload Edit
    gentaxinv : Generate Tax Invoice Edit
    vertaxinv : Dispatch Tax Invoice Edit
    amntaxinv : Amend Tax Invoice Edit
    distaxinv : Dispatch Tax Invoice Edit
 */
(function () {
    "use strict";

    angular
        .module("Application")
        .directive("costandrevupledit", CostandRevUplEditDirective)
        .directive("gentaxinvedit", GenTaxInvEditDirective)
        .directive("verifytaxinvedit", VerifyTaxInvEditDirective)
        .directive("amntaxinvedit", AmnTaxInvEditDirective)
        .directive("dispatchtaxinvedit", DisTaxInvEditDirective);

    function CostandRevUplEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/cost-revenue-upl/cost-revenue-upl-edit/cost-revenue-upl-edit.html",
            controller: "CostandRevUplEditDirectiveController",
            controllerAs: "CostandRevUplEditDirectiveCtrl",
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

    function GenTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/generate-tax-invoice/generate-tax-invoice-edit/generate-tax-invoice-edit.html",
            controller: "GenerateTaxInvEditDirectiveController",
            controllerAs: "GenerateTaxInvEditDirectiveCtrl",
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

    function VerifyTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/verify-tax-invoice/verify-tax-invoice-edit/verify-tax-invoice-edit.html",
            controller: "VerifyTaxInvEditDirectiveController",
            controllerAs: "VerifyTaxInvEditDirectiveCtrl",
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

    function AmnTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/amend-tax-invoice/amend-tax-invoice-edit/amend-tax-invoice-edit.html",
            controller: "AmendTaxInvEditDirectiveController",
            controllerAs: "AmendTaxInvEditDirectiveCtrl",
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

    function DisTaxInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tax-invoice/dispatch-tax-invoice/dispatch-tax-invoice-edit/dispatch-tax-invoice-edit.html",
            controller: "DispatchTaxInvEditDirectiveController",
            controllerAs: "DispatchTaxInvEditDirectiveCtrl",
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