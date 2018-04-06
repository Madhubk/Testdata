(function () {
    "use strict";

    angular
        .module("Application")
        .directive("processWorkStepDirective", ProcessWorkStepDirective);

    ProcessWorkStepDirective.$inject = ["$rootScope"];

    function ProcessWorkStepDirective($rootScope) {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/process/process-work-step-directive/process-work-step-directive.html",
            controller: "ProcessWorkStepDirectiveController",
            controllerAs: "ProcessWorkStepDirectiveCtrl",
            bindToController: true,
            scope: {
                input: "=",
                instanceList: "=",
                mode: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
