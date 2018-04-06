(function () {
    "use strict";

    angular
        .module("Application")
        .controller("sendPopUpModalController", SendPopUpModalController);

    SendPopUpModalController.$inject = ["appConfig", "helperService", "$uibModalInstance", "param"];

    function SendPopUpModalController(appConfig, helperService, $uibModalInstance, param) {
        var SendPopUpModalCtrl = this;

        function Init() {
            SendPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Send_FollowUp",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitSendFollowUp();
        }

        function InitSendFollowUp() {
            SendPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            SendPopUpModalCtrl.ePage.Masters.Param = {
                "EntityRefKey": param.SendList[0].PK,
                "EntitySource": "POH",
                "EntityRefCode": param.SendList[0].OrderCumSplitNo,
                "RowObj": param.SendList
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        
        Init();
    }
})();