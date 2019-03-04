(function () {
    "use strict";

    angular
        .module("Application")
        .directive("delayReasonModal", DelayReasonModal);

    DelayReasonModal.$inject = ["$uibModal", "$templateCache"];

    function DelayReasonModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="DelayReasonModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Delay Reason</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <delay-reason input="input"></delay-reason>
        </div>`;
        $templateCache.put("DelayReasonModal.html", _template);

        let exports = {
            restrict: "EA",
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                $uibModal.open({
                    animation: true,
                    keyboard: true,
                    windowClass: "right delay-reason",
                    scope: scope,
                    templateUrl: "DelayReasonModal.html",
                    controller: 'DelayReasonModalController as DelayReasonModalCtrl',
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
        .controller("DelayReasonModalController", DelayReasonModalController);

    DelayReasonModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function DelayReasonModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let DelayReasonModalCtrl = this;

        function Init() {
            DelayReasonModalCtrl.ePage = {
                "Title": "",
                "Prefix": "DelayReasonModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            DelayReasonModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
