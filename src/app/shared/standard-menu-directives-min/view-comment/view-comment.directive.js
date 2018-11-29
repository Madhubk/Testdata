(function () {
    "use strict"
    angular
        .module("Application")
        .directive("viewComment", ViewCommentDirective);

    function ViewCommentDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/view-comment/view-comment.html",
            link: Link,
            controller: "ViewCommentController",
            controllerAs: "ViewCommentCtrl",
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();
