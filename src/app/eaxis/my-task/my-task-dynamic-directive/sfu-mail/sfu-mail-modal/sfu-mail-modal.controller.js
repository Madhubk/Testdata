(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SFUSendModalController", SFUSendModalController);

        SFUSendModalController.$inject = ["appConfig", "helperService", "$uibModalInstance", "param"];

    function SFUSendModalController(appConfig, helperService, $uibModalInstance, param) {
        var SFUSendModalCtrl = this;

        function Init() {
            SFUSendModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Send_FollowUp",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitSendFollowUp();
        }

        function InitSendFollowUp() {
            SFUSendModalCtrl.ePage.Masters.Cancel = Cancel;
            SFUSendModalCtrl.ePage.Masters.Param = {
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
            SFUSendModalCtrl.ePage.Masters.MailObj = {};
            SFUSendModalCtrl.ePage.Masters.MailObj.Template = "SFUMail";
            SFUSendModalCtrl.ePage.Masters.MailObj.TemplateObj = {
                Code: "temp3",
                Desc: "Template 3"
            };
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        
        Init();
    }
})();