(function () {
    "use strict";

    angular
        .module("Application")
        .directive("taskAssignStartComplete", TaskAssignStartComplete);

    TaskAssignStartComplete.$inject = [];

    function TaskAssignStartComplete() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/task-assign-start-complete/task-assign-start-complete.html",
            controller: "TaskAssignStartCompleteController",
            controllerAs: "TaskAssignStartCompleteCtrl",
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                onSubmitResponse: "&"
            }
        };
        return exports;
    }
})();
