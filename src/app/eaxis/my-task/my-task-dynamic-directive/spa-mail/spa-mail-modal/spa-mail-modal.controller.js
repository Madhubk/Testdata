(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SPASendModalController", SPASendModalController);

        SPASendModalController.$inject = ["appConfig", "helperService", "$uibModalInstance", "param"];

    function SPASendModalController(appConfig, helperService, $uibModalInstance, param) {
        var SPASendModalCtrl = this;

        function Init() {
            SPASendModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Send_FollowUp",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitSendFollowUp();
        }

        function InitSendFollowUp() {
            SPASendModalCtrl.ePage.Masters.Cancel = Cancel;
            SPASendModalCtrl.ePage.Masters.Param = {
                "EntityRefKey": param.SendList[0].POH_FK,
                "EntitySource": "POH",
                "EntityRefCode": param.SendList[0].OrderNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": param.SendList
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        
        Init();
    }
})();