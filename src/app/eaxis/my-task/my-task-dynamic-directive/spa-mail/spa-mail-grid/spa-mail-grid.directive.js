(function () {
    "use strict";

    angular
        .module("Application")
        .directive("spaMailGridDirective", SPAMailGridDirective);

    SPAMailGridDirective.$inject = [];

    function SPAMailGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/spa-mail/spa-mail-grid/spa-mail-grid-directive.html",
            link: Link,
            controller: "SPAMailGridDirectiveController",
            controllerAs: "SPAMailGridDirectiveCtrl",
            scope: {
                input: "=",
                gridChange: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
