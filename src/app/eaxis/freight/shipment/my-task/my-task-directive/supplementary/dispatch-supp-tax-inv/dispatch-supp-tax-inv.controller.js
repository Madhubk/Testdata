/*
    Page : Dispatch Supplementary Tax Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchSuppTaxInvDirController", DispatchSuppTaxInvDirController);

    DispatchSuppTaxInvDirController.$inject = ["helperService"];

    function DispatchSuppTaxInvDirController(helperService) {
        var DipatchSuppTaxInvDirCtrl = this;

        function Init() {
            DipatchSuppTaxInvDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            DipatchSuppTaxInvDirCtrl.ePage.Masters.emptyText = "True";
            DipatchSuppTaxInvDirCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            DipatchSuppTaxInvDirCtrl.ePage.Masters.MyTask = DipatchSuppTaxInvDirCtrl.taskObj;
            DipatchSuppTaxInvDirCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (DipatchSuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig) {
                DipatchSuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(DipatchSuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            DipatchSuppTaxInvDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

     

        Init();
    }
})();