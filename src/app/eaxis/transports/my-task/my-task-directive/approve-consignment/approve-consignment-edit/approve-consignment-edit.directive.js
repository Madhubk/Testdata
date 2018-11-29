(function () {
    "use strict";

    angular
        .module("Application")
        .directive("approveconsignmentedit", ApproveConsignmentEditDirective);

    ApproveConsignmentEditDirective.$inject = [];

    function ApproveConsignmentEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment-edit/approve-consignment-edit.html",
            controller: "ApproveConsignmentEditDirectiveController",
            controllerAs: "ApproveConsignmentEditDirectiveCtrl",
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

        function Link(scope, ele, attr) { }
    }
})();
