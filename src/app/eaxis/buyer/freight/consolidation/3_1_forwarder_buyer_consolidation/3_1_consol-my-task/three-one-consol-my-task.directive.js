(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneConsolMyTask", ThreeOneConsolMyTask);

    ThreeOneConsolMyTask.$inject = [];

    function ThreeOneConsolMyTask() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-my-task/three-one-consol-my-task.html",
            link: Link,
            controller: "ThreeOneConsolMyTaskController",
            controllerAs: "ThreeOneConsolMyTaskCtrl",
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
