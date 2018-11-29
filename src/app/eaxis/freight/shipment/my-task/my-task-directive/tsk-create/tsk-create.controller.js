(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TaskCreateDirectiveController", TaskCreateDirectiveController);

    TaskCreateDirectiveController.$inject = ["helperService"];

    function TaskCreateDirectiveController(helperService) {
        var TaskCreateDirectiveCtrl = this;

        function Init() {
            TaskCreateDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Effort",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TaskCreateDirectiveCtrl.ePage.Masters.MyTask = TaskCreateDirectiveCtrl.taskObj;

            if (TaskCreateDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                TaskCreateDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(TaskCreateDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
        }

        Init();
    }
})();
