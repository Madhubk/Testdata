/*
    Page : Verify Tax Invoice 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifyTaxInvDirectiveController", VerifyTaxInvDirectiveController);

    VerifyTaxInvDirectiveController.$inject = ["helperService"];

    function VerifyTaxInvDirectiveController(helperService) {
        var VerifyTaxInvDirectiveCtrl = this;

        function Init() {
            VerifyTaxInvDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            VerifyTaxInvDirectiveCtrl.ePage.Masters.emptyText = "True";
            VerifyTaxInvDirectiveCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            VerifyTaxInvDirectiveCtrl.ePage.Masters.MyTask = VerifyTaxInvDirectiveCtrl.taskObj;
            VerifyTaxInvDirectiveCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (VerifyTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                VerifyTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(VerifyTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        // =============================== Verify Tax Invoice Start =================================

        function IsSuppRequired() {
            VerifyTaxInvDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        // =============================== VerifyTax Invoice End =================================


        Init();
    }
})();