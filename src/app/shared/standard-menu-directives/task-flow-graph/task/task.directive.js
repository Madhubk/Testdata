(function () {
    "use strict";

    angular
        .module("Application")
        .directive("taskFlowGraph", Task);

    function Task() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/task-flow-graph/task/task.html",
            controller: 'TaskFlowGraphController',
            controllerAs: 'TaskCtrl',
            bindToController: true,
            scope: {
                input: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("TaskFlowGraphController", TaskFlowGraphController);

    TaskFlowGraphController.$inject = ["apiService", "helperService", "appConfig"];

    function TaskFlowGraphController(apiService, helperService, appConfig) {
        /* jshint validthis: true */
        let TaskCtrl = this;

        function Init() {
            TaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Audit Log",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": TaskCtrl.input
            };

            if (TaskCtrl.ePage.Entities) {
                InitTask();
            }
        }

        function InitTask() {
            TaskCtrl.ePage.Masters.Task = {};
            TaskCtrl.ePage.Masters.Task.Instance = {};
            TaskCtrl.ePage.Masters.Task.Process = {};

            GetInstanceNo();
        }

        function GetInstanceNo() {
            GetProcessList();
        }

        function GetProcessList() {
            // let _instanceNo = 2133;
            let _instanceNo = TaskCtrl.input.EntityRefCode;
            apiService.get("eAxisAPI", appConfig.Entities.EBPMWorkFlow.API.GetByInstanceNo.Url + _instanceNo).then(response => {
                if (response.data.Response) {
                    TaskCtrl.ePage.Masters.Task.Process.ListSource = response.data.Response.GraphData.Step;
                } else {
                    TaskCtrl.ePage.Masters.Task.Process.ListSource = [];
                }
            });
        }

        Init();
    }
})();
