(function () {
    "use strict";

    angular
        .module("Application")
        .directive("comment", Comment);

    Comment.$inject = [];

    function Comment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/comment/comment/comment.html",
            controller: 'CommentController',
            controllerAs: 'CommentCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
