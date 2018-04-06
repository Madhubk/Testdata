/*
    revcosrevuplgst : Review Cost and Revenue Upload GST
    gengstinv : Generate GST Invoice
    disgstinv : Dispatch GST Invoice
    colpaygstinv : Collect payment for GST Invoice
 */

(function () {
    "use strict";

    angular
        .module("Application")
        .directive("revcosrevuplgst", RevCosRevUplGSTDirective)
        .directive("gengstinv", GenGSTInvDirective)
        .directive("disgstinv", DisGSTInvDirective)
        .directive("colpaygstinv", ColPayInvDirective);

    function RevCosRevUplGSTDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/revcost-revenue-upl-gst/revcost-revenue-upl-gst.html",
            link: Link,
            controller: "RevCostandRevUplGSTDirController",
            controllerAs: "RevCostandRevUplGSTDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function GenGSTInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/generate-gst-invoice/generate-gst-invoice.html",
            link: Link,
            controller: "GenerateGSTInvDirectiveController",
            controllerAs: "GenerateGSTInvDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function DisGSTInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/dispatch-gst-invoice/dispatch-gst-invoice.html",
            link: Link,
            controller: "DispatchGSTInvDirectiveController",
            controllerAs: "DispatchGSTInvDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function ColPayInvDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/coll-pay-gst-inv/coll-pay-gst-inv.html",
            link: Link,
            controller: "PaymentforGSTInvDirectiveController",
            controllerAs: "PaymentforGSTInvDirectiveCtrl",
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