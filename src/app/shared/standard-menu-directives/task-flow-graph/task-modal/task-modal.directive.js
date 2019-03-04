(function () {
    "use strict";

    angular
        .module("Application")
        .directive("taskFlowGraphModal", TaskModal);

    TaskModal.$inject = ["$uibModal", "$templateCache"];

    function TaskModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="TaskModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Task</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <task-flow-graph input="input"></task-flow-graph>
        </div>`;
        $templateCache.put("TaskFlowModal.html", _template);

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
                    windowClass: "right task",
                    scope: scope,
                    templateUrl: "TaskFlowModal.html",
                    controller: 'TaskFlowGraphModalController as TaskModalCtrl',
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
        .controller("TaskFlowGraphModalController", TaskFlowGraphModalController);

    TaskFlowGraphModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function TaskFlowGraphModalController($uibModalInstance, helperService, param) {
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
