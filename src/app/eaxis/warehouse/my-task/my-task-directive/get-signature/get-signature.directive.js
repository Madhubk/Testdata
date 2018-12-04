(function () {
    "use strict"
    angular
        .module("Application")
        .directive("getsignature", GetSignatureDirective)
        .directive("getSignatureEdit", GetSignatureEditDirective);

    function GetSignatureDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/get-signature/get-signature-task-list.html",
            link: Link,
            controller: "GetSignatureController",
            controllerAs: "GetSignatureCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function GetSignatureEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/get-signature/get-signature-activity.html",
            link: Link,
            controller: "GetSignatureController",
            controllerAs: "GetSignatureCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
