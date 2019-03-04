(function () {
    "use strict";

    angular
        .module("Application")
        .directive("taskModal", TaskModal);

    TaskModal.$inject = ["$uibModal", "$templateCache"];

    function TaskModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="TaskModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Task</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <task input="input"></task>
        </div>`;
        $templateCache.put("TaskModal.html", _template);

        let exports = {
            restrict: "EA",
            scope: {
                input: "=",
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
                    keyboard: true,
                    windowClass: "right task",
                    scope: scope,
                    templateUrl: "TaskModal.html",
                    controller: 'TaskModalController as TaskModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    scope.onCloseModal({
                        $item: "task"
                    });
                }, function () {
                    scope.onCloseModal({
                        $item: "task"
                    });
                });
            }
        }
    }

    angular
        .module("Application")
        .controller("TaskModalController", TaskModalController);

    TaskModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function TaskModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let TaskModalCtrl = this;

        function Init() {
            TaskModalCtrl.ePage = {
                "Title": "",
                "Prefix": "TaskModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            TaskModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
