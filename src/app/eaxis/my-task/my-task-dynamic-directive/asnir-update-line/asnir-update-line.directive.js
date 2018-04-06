(function () {
    "use strict";

    angular
        .module("Application")
        .directive("asnirupdateline", AsnirUpdateLineDirective);

    function AsnirUpdateLineDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line.html",
            link: Link,
            controller: "AsnirUpdateLineDirectiveController",
            controllerAs: "AsnirUpdateLineDirectiveCtrl",
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
