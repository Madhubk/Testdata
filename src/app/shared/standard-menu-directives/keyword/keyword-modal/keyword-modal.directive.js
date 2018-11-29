(function () {
    "use strict";

    angular
        .module("Application")
        .directive("keywordModal", KeywordModal);

    KeywordModal.$inject = ["$uibModal", "$templateCache"];

    function KeywordModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="KeywordModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Keyword</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <keyword input="input" mode="mode" type="type"></keyword>
        </div>`;
        $templateCache.put("KeywordModal.html", _template);

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
                    windowClass: "right keyword",
                    scope: scope,
                    templateUrl: "KeywordModal.html",
                    controller: 'KeywordModalController as KeywordModalCtrl',
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
