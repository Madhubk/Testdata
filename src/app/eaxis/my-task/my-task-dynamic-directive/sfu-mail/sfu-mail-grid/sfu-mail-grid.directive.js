(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sfuMailGridDirective", SFUMailGridDirective);

    SFUMailGridDirective.$inject = [];

    function SFUMailGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/sfu-mail/sfu-mail-grid/sfu-mail-grid-directive.html",
            link: Link,
            controller: "SFUMailGridDirectiveController",
            controllerAs: "SFUMailGridDirectiveCtrl",
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
