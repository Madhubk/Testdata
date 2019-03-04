(function () {
    "use strict";

    angular
        .module("Application")
        .directive("documentModal", DocumentModal);

    DocumentModal.$inject = ["$uibModal", "$templateCache"];

    function DocumentModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="DocumentModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Document</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <document input="input" mode="mode" type="type" config="config" list-source="listSource"></document>
        </div>`;
        $templateCache.put("DocumentModal.html", _template);

        let exports = {
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
                $uibModal.open({
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
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(() => scope.onCloseModal({
                    $item: "document"
                }), () => scope.onCloseModal({
                    $item: "document"
                }));
            }
        }
    }

    angular
        .module("Application")
        .controller("DocumentModalController", DocumentModalController);

    DocumentModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function DocumentModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let DocumentModalCtrl = this;

        function Init() {
            DocumentModalCtrl.ePage = {
                "Title": "",
                "Prefix": "DocumentModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            DocumentModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
