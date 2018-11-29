(function () {
    "use strict";

    angular
        .module("Application")
        .directive("spamailedit", SpaMailEditDirective);

    SpaMailEditDirective.$inject = [];

    function SpaMailEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-edit/spa-mail-edit.html",
            controller: "SpaMailEditDirectiveController",
            controllerAs: "SpaMailEditDirectiveCtrl",
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