(function () {
    "use strict";

    angular
        .module("Application")
        .directive("commentModal", CommentModal);

    CommentModal.$inject = ["$uibModal"];

    function CommentModal($uibModal) {
        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                mode: "=",
                type: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "right comment",
                    scope: scope,
                    templateUrl: "app/shared/standard-menu-directives/comment/comment-modal/comment-modal.html",
                    controller: 'CommentModalController as CommentModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    console.log(response);
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
