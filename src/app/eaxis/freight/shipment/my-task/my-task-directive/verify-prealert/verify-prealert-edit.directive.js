(function () {
    "use strict"
    angular
        .module("Application")
        .directive("verprealertedit", VerifyPreAlertEdit);

    function VerifyPreAlertEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/verify-prealert/verify-prealert/verify-prealert-edit/verify-prealert-edit.html",
            link: Link,
            controller: "VerifyPreAlertEditController",
            controllerAs: "VerifyPreAlertEditDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();