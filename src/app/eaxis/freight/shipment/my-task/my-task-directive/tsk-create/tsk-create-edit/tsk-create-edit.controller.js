(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TaskCreateEditDirectiveController", TaskCreateEditDirectiveController);

    TaskCreateEditDirectiveController.$inject = ["helperService"];

    function TaskCreateEditDirectiveController(helperService) {
        var TaskCreateEditDirectiveCtrl = this;

        function Init() {
            TaskCreateEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
