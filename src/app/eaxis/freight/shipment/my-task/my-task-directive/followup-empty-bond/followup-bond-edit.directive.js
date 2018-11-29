(function () {
    "use strict"
    angular
        .module("Application")
        .directive("follupemptybondedit", FollowupEmptyBondEdit);

    function FollowupEmptyBondEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/followup-empty-bond/followup-bond/followup-bond-edit/followup-bond-edit.html",
            link: Link,
            controller: "EmptyBondEditController",
            controllerAs: "EmptyBondEditDirCtrl",
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