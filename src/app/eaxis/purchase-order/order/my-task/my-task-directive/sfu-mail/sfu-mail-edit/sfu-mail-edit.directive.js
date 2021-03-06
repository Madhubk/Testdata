(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfumailedit", SfuMailEditDirective);

    SfuMailEditDirective.$inject = [];

    function SfuMailEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-mail/sfu-mail-edit/sfu-mail-edit.html",
            controller: "SfuMailEditDirectiveController",
            controllerAs: "SfuMailEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();