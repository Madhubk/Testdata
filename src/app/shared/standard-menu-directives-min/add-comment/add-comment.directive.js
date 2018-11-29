(function () {
    "use strict"
    angular
        .module("Application")
        .directive("addComment", AddCommentDirective);

    function AddCommentDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/add-comment/add-comment.html",
            link: Link,
            controller: "AddCommentController",
            controllerAs: "AddCommentCtrl",
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
