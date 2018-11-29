(function () {
    "use strict";

    angular
        .module("Application")
        .directive("documentModal", DocumentModal);

    DocumentModal.$inject = ["$uibModal", "$templateCache"];

    function DocumentModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="DocumentModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Document</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <document input="input" mode="mode" type="type" config="config" list-source="listSource"></document>
        </div>`;
        $templateCache.put("DocumentModal.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                mode: "=",
                config: "=",
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
                    windowClass: "right document",
                    scope: scope,
                    templateUrl: "DocumentModal.html",
                    controller: 'DocumentModalController as DocumentModalCtrl',
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
                        $item: "document"
                    });
                }, function () {
                    console.log("Cancelled");
                    scope.onCloseModal({
                        $item: "document"
                    });
                });
            }
        }
    }
})();
