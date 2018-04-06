/*
    Page : Dispatch Tax Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchTaxInvDirectiveController", DispatchTaxInvDirectiveController);

    DispatchTaxInvDirectiveController.$inject = ["helperService"];

    function DispatchTaxInvDirectiveController(helperService) {
        var DispatchTaxInvDirectiveCtrl = this;

        function Init() {
            DispatchTaxInvDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            DispatchTaxInvDirectiveCtrl.ePage.Masters.emptyText = "True";
            DispatchTaxInvDirectiveCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            DispatchTaxInvDirectiveCtrl.ePage.Masters.MyTask = DispatchTaxInvDirectiveCtrl.taskObj;
            DispatchTaxInvDirectiveCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (DispatchTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                DispatchTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(DispatchTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        // ========================== Dispatch Tax Invoice Start ==================================

        function IsSuppRequired() {
            DispatchTaxInvDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        // ========================== Dispatch Tax Invoice End ==================================

        Init();
    }
})();