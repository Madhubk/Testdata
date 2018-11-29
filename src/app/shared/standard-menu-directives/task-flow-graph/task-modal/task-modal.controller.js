(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TaskModalController", TaskModalController);

    TaskModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function TaskModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var TaskModalCtrl = this;

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
