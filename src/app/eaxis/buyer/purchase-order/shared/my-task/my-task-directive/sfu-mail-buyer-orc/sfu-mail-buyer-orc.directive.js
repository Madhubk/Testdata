(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfumailbuyerorc", SfuMailBuyerOrcDirective);

    function SfuMailBuyerOrcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc.html",
            link: Link,
            controller: "SfuMailBuyerOrcDirectiveController",
            controllerAs: "SfuMailBuyerOrcDirectiveCtrl",
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