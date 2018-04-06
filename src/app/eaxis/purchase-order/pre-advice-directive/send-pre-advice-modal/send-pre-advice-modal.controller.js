(function () {
    "use strict";

    angular
        .module("Application")
        .controller("sendMailModalController", SendMailModalController);

    SendMailModalController.$inject = ["helperService", "$uibModalInstance", "param"];

    function SendMailModalController(helperService, $uibModalInstance , param) {
        var SendMailModalCtrl = this;

        function Init() {
            SendMailModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Send_Pre_Advice_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            
            InitSendPreAdvice();
        }
        
        function InitSendPreAdvice() {
            SendMailModalCtrl.ePage.Masters.Cancel = Cancel;
            SendMailModalCtrl.ePage.Masters.Param = {
                "EntityRefKey" : param.SendList[0].PK,
                "EntitySource" : "POH",
                "EntityRefCode" : param.SendList[0].OrderCumSplitNo
            }
        }
        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
