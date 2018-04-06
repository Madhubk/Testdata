(function () {
    "use strict";

    angular
        .module("Application")
        .directive("activityTab", ActivityTab);

    ActivityTab.$inject = [];

    function ActivityTab() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/activity-tab/activity-tab.html",
            link: Link,
            controller: "ActivityTabController",
            controllerAs: "ActivityTabCtrl",
            scope: {
                tabList: "=",
                obj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
