(function () {
    "use strict";

    angular
        .module("Application")
        .directive("commentModal", CommentModal);

    CommentModal.$inject = ["$uibModal", "$templateCache"];

    function CommentModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="CommentModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Comment</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <comment input="input" mode="mode" type="type" config="config" list-source="listSource"></comment>
        </div>`;
        $templateCache.put("CommentModal.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                config: "=",
                mode: "=",
                type: "=",
                listSource: "=",
                onCloseModal: "&"
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
                    templateUrl: "CommentModal.html",
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
                    scope.onCloseModal({
                        $item: "comment"
                    });
                }, function () {
                    scope.onCloseModal({
                        $item: "comment"
                    });
                    console.log("Cancelled");
                });
            }
        }
    }
})();
