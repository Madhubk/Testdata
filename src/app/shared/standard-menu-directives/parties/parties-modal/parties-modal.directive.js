(function () {
    "use strict";

    angular
        .module("Application")
        .directive("partiesModal", PartiesModal);

    PartiesModal.$inject = ["$uibModal", "$templateCache"];

    function PartiesModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="PartiesModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Parties</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <parties input="input" mode="mode" type="type"></parties>
        </div>`;
        $templateCache.put("PartiesModal.html", _template);

        let exports = {
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
                $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "right parties",
                    scope: scope,
                    templateUrl: "PartiesModal.html",
                    controller: 'PartiesModalController as PartiesModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(response => {}, () => {});
            }
        }
    }

    angular
        .module("Application")
        .controller("PartiesModalController", PartiesModalController);

    PartiesModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function PartiesModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let PartiesModalCtrl = this;

        function Init() {
            PartiesModalCtrl.ePage = {
                "Title": "",
                "Prefix": "PartiesModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            PartiesModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
