/*
    revcosrevuplgstedit : Review Cost and Revenue Upload GST Edit
    gstinvoice2edit : Generate GST Invoice Edit
    disgstinv : Dispatch GST Invoice Edit
    colpaygstinv : Collect payment for GST Invoice Edit
 */
(function () {
    "use strict";

    angular
        .module("Application")
        .directive("revcosrevuplgstedit", RevCosRevUplGSTEditDirective)
        .directive("gengstinvedit", GenGSTInvEditDirective)
        .directive("disgstinvedit", DisGSTInvEditDirective)
        .directive("colpaygstinvedit", ColPayGSTInvEditDirective);

    function RevCosRevUplGSTEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/revcost-revenue-upl-gst/revcost-revenue-upl-gst-edit/revcost-revenue-upl-gst-edit.html",
            controller: "RevCostandRevUplGSTEditDirController",
            controllerAs: "RevCostandRevUplGSTEditDirCtrl",
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

    function GenGSTInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/generate-gst-invoice/generate-gst-invoice-edit/generate-gst-invoice-edit.html",
            controller: "GenerateGSTInvEditDirectiveController",
            controllerAs: "GenerateGSTInvEditDirectiveCtrl",
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

    function DisGSTInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/dispatch-gst-invoice/dispatch-gst-invoice-edit/dispatch-gst-invoice-edit.html",
            controller: "DispatchGSTInvEditDirectiveController",
            controllerAs: "DispatchGSTInvEditDirectiveCtrl",
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

    function ColPayGSTInvEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/gst-invoice/coll-pay-gst-inv/coll-pay-gst-inv-edit/coll-pay-gst-inv-edit.html",
            controller: "PaymentforGSTEditDirectiveController",
            controllerAs: "PaymentforGSTEditDirectiveCtrl",
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