(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TaskController", TaskController);

    TaskController.$inject = ["authService", "apiService", "helperService", "appConfig"];

    function TaskController(authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var TaskCtrl = this;

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
            apiService.get("eAxisAPI", appConfig.Entities.EBPMWorkFlow.API.GetByInstanceNo.Url + 2133).then(function (response) {
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
