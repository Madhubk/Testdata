(function () {
    "use strict"
    angular
        .module("Application")
        .directive("linerdeliveryedit", LinerDeliveryEditDirective);

    function LinerDeliveryEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/liner-delivery-order/liner-delivery/liner-delivery-edit/liner-delivery-edit.html",
            link: Link,
            controller: "LinerDeliveryEditController",
            controllerAs: "LinerDeliveryEditDirCtrl",
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