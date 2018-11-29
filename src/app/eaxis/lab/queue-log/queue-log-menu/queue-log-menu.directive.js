(function () {
    "use strict";

    angular
        .module("Application")
        .directive("queueLogMenu", queueLogMenu);

    queueLogMenu.$inject = [];

    function queueLogMenu() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/lab/queue-log/queue-log-menu/queue-log-menu.html",
            link: Link,
            controller: "QueueLogMenuController",
            controllerAs: "QueueLogMenuCtrl",
            scope: {

                currentQueueLog: "=",
                defaultFilter: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();