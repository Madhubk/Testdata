(function () {
    "use strict";

    angular
        .module("Application")
        .directive("docDirective", DocDirective);

    DocDirective.$inject = [];

    function DocDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/document-directive/document-directive.html",
            link: Link,
            controller: "DocDirectiveController",
            controllerAs: "DocDirectiveCtrl",
            scope: {
                currentObj: "=",
                entity: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
