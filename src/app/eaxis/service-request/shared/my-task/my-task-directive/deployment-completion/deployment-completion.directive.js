(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deploymentcompletion", DeploymentCompletionDirective);

    function DeploymentCompletionDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion.html",
            link: Link,
            controller: "DeploymentCompletionDirectiveController",
            controllerAs: "DeploymentCompletionDirectiveCtrl",
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