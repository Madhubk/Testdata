(function () {
    "use strict";

    angular
        .module("Application")
        .directive("approveconsignment", ApproveConsignmentDirective);

    function ApproveConsignmentDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/approve-consignment/approve-consignment.html",
            link: Link,
            controller: "ApproveConsignmentController",
            controllerAs: "ApproveConsignmentDirectiveCtrl",
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
