(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deploymentcompletionedit", DeploymentCompletionEditDirective);

    DeploymentCompletionEditDirective.$inject = [];

    function DeploymentCompletionEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/shared/my-task/my-task-directive/deployment-completion/deployment-completion-edit/deployment-completion-edit.html",
            controller: "DeploymentCompletionEditDirectiveController",
            controllerAs: "DeploymentCompletionEditDirectiveCtrl",
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
