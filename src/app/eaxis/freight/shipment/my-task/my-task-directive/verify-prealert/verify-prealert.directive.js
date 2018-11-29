(function () {
    "use strict"
    angular
        .module("Application")
        .directive("verprealert", VerifyPreAlert);
    function VerifyPreAlert() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/verify-prealert/verify-prealert/verify-prealert.html",
            link: Link,
            controller: "VerifyPreAlertController",
            controllerAs: "VerifyPreAlertDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();