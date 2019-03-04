(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfuMailBuyerOrcEdit", SfuMailBuyerOrcEditDirective);

    SfuMailBuyerOrcEditDirective.$inject = [];

    function SfuMailBuyerOrcEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/sfu-mail-buyer-orc/sfu-mail-buyer-orc-edit/sfu-mail-buyer-orc-edit.html",
            controller: "SfuMailBuyerOrcEditDirectiveController",
            controllerAs: "SfuMailBuyerOrcEditDirectiveCtrl",
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