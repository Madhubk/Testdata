(function () {
    "use strict";

    angular
        .module("Application")
        .directive("workItemStatusCount", WorkItemStatusCount);

    WorkItemStatusCount.$inject = [];

    function WorkItemStatusCount() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/control-tower/work-item-status-count/work-item-status-count.html",
            controller: "WorkItemStatusCountController",
            controllerAs: "WorkItemStatusCountCtrl",
            bindToController: true,
            scope: {
                workItemList: "=",
                selectedItem: "&",
                code: "=",
                filterInput: "=",
                toggleClick: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
