(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PreAdviceHistroyModalController", PreAdviceHistroyModalController);

    PreAdviceHistroyModalController.$inject = ["appConfig", "helperService", "$uibModalInstance", "param"];

    function PreAdviceHistroyModalController(appConfig, helperService, $uibModalInstance, param) {
        var PreAdviceHistroyModalCtrl = this;

        function Init() {
            PreAdviceHistroyModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice_History_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitFollowUpHistory();
        }

        function InitFollowUpHistory() {
            PreAdviceHistroyModalCtrl.ePage.Masters.PreAdviceHistory = param.HistoryList;
            PreAdviceHistroyModalCtrl.ePage.Masters.Cancel = Cancel;
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();