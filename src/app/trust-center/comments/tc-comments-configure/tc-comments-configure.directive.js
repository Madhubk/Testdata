(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tcCommentsConfigure", TCCommentsConfigure);

        TCCommentsConfigure.$inject = [];

    function TCCommentsConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/comments/tc-comments-configure/tc-comments-configure.html",
            link: Link,
            controller: "TCCommentsConfigureController",
            controllerAs: "TCCommentsConfigureCtrl",
            scope: {
                currentComments: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
