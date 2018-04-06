(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifySuppTaxInvDirController", VerifySuppTaxInvDirController);

    VerifySuppTaxInvDirController.$inject = ["helperService"];

    function VerifySuppTaxInvDirController(helperService) {
        var VerifySuppTaxInvDirCtrl = this;

        function Init() {
            VerifySuppTaxInvDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            VerifySuppTaxInvDirCtrl.ePage.Masters.emptyText = "True";
            VerifySuppTaxInvDirCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            VerifySuppTaxInvDirCtrl.ePage.Masters.MyTask = VerifySuppTaxInvDirCtrl.taskObj;
            VerifySuppTaxInvDirCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (VerifySuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig) {
                VerifySuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(VerifySuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            VerifySuppTaxInvDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
            console.log(VerifySuppTaxInvDirCtrl.ePage.Masters.IsSuppRequired)
        }



        Init();
    }
})();