(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolMyTask", ConsolMyTask);

    ConsolMyTask.$inject = [];

    function ConsolMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/consol-my-task.html",
            link: Link,
            controller: "ConsolMyTaskController",
            controllerAs: "ConsolMyTaskCtrl",
            scope: {
                currentConsol: "=",
                listSource: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
