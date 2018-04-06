(function () {
    "use strict";

    angular
        .module("Application")
        .directive("errorWarningDirective", ErrorWarningDirective);

    function ErrorWarningDirective() {
        var exports = {
            restrict: "EA",
            transclude: true,
            templateUrl: "app/shared/error-warning/error-warning-directive.html",
            scope: {
                list: "=",
                type: "=",
                icon: "@",
                parentType: "=",
                parentRef: "=",
                gParentRef: "=",
                rowIndex: "=",
                colIndex: "="
            },
            link: Link
        };
        return exports;
        function Link(scope) { }
    }
})();
