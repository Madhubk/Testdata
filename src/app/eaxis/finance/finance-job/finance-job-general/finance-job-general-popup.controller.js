(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobGeneralPopupController", FinanceJobGeneralPopupController);

    FinanceJobGeneralPopupController.$inject = ["$uibModalInstance", "helperService", "financeConfig", "CurrentFinanceJob"];

    function FinanceJobGeneralPopupController($uibModalInstance, helperService, financeConfig, CurrentFinanceJob) {
        var FinanceJobGeneralPopupCtrl = this;

        function Init() {

            FinanceJobGeneralPopupCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_Job_General_Popup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": financeConfig.Entities
            };

            FinanceJobGeneralPopupCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();