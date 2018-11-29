(function () {
    "use strict";

    angular
        .module("Application")
        .directive("quickbookreject", QuickBookRejectDirective);

    function QuickBookRejectDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/quick-book-reject/quick-book-reject.html",
            link: Link,
            controller: "QuickBookRejectDirectiveController",
            controllerAs: "QuickBookRejectDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
