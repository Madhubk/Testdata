(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptionModal", ExceptionModal);

    ExceptionModal.$inject = ["$uibModal", "$templateCache"];

    function ExceptionModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="ExceptionModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Exception</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <exception input="input" mode="mode" type="type" config="config" list-source="listSource"></exception>
        </div>`;
        $templateCache.put("ExceptionModal.html", _template);

        let exports = {
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
                $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "right exception",
                    scope: scope,
                    templateUrl: "ExceptionModal.html",
                    controller: 'ExceptionModalController as ExceptionModalCtrl',
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
                    $item: "exception"
                }), () => scope.onCloseModal({
                    $item: "exception"
                }));
            }
        }
    }

    angular
        .module("Application")
        .controller("ExceptionModalController", ExceptionModalController);

    ExceptionModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function ExceptionModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let ExceptionModalCtrl = this;

        function Init() {
            ExceptionModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ExceptionModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            ExceptionModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
