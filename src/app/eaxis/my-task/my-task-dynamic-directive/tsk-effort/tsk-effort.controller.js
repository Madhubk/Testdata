(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TaskEffortDirectiveController", TaskEffortDirectiveController);

    TaskEffortDirectiveController.$inject = ["helperService"];

    function TaskEffortDirectiveController(helperService) {
        var TaskEffortDirectiveCtrl = this;

        function Init() {
            TaskEffortDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Effort",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TaskEffortDirectiveCtrl.ePage.Masters.MyTask = TaskEffortDirectiveCtrl.taskObj;

            if (TaskEffortDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof TaskEffortDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    TaskEffortDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(TaskEffortDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        Init();
    }
})();
