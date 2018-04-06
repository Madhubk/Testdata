(function () {
    "use strict";

    angular
        .module("Application")
        .controller("followUpModalController", FollowUpModalController);

    FollowUpModalController.$inject = ["appConfig", "helperService", "$uibModalInstance", "param"];

    function FollowUpModalController(appConfig, helperService, $uibModalInstance, param) {
        var FollowUpModalCtrl = this;

        function Init() {
            FollowUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Follow_Up_History_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitFollowUpHistory();
        }

        function InitFollowUpHistory() {
            FollowUpModalCtrl.ePage.Masters.SfuHistory = param.HistoryList;
            FollowUpModalCtrl.ePage.Masters.Cancel = Cancel;
        }
        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();