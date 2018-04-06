(function () {
    "use strict";

    angular
        .module("Application")
        .directive("asnirupdatelineedit", AsnirUpdateLineEditDirective);

    AsnirUpdateLineEditDirective.$inject = [];

    function AsnirUpdateLineEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/asnir-update-line/asnir-update-line-edit/asnir-update-line-edit.html",
            controller: "AsnirUpdateLineEditDirectiveController",
            controllerAs: "AsnirUpdateLineEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) { }
    }
})();
