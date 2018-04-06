(function () {
    "use strict";

    angular
        .module("Application")
        .directive("processInstanceWorkItemDetails", ProcessInstanceWorkItemDetails);

    ProcessInstanceWorkItemDetails.$inject = [];

    function ProcessInstanceWorkItemDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/process/process-instance/process-instance-work-item-details/process-instance-work-item-details.html",
            link: Link,
            controller: "ProcessInstanceWorkItemDetailsController",
            controllerAs: "ProcessInstanceWorkItemDetailsCtrl",
            scope: {
                currentProcessInstance: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) {}
    }
})();
