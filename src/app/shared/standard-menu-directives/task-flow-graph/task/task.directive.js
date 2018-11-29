(function () {
    "use strict";

    angular
        .module("Application")
        .directive("task", Task);

    Task.$inject = [];

    function Task() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/task/task/task.html",
            controller: 'TaskController',
            controllerAs: 'TaskCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
