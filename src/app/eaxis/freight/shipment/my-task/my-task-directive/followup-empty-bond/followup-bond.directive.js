(function () {
    "use strict"
    angular
        .module("Application")
        .directive("follupemptybond", FollowupEmptyBond);

    function FollowupEmptyBond() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/followup-empty-bond/followup-bond/followup-bond.html",
            link: Link,
            controller: "EmptyBondController",
            controllerAs: "EmptyBondDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();