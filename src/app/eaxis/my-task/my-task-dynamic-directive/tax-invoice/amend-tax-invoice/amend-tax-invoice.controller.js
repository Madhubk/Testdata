/*
    Page : Amend Tax Invoice 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AmendTaxInvDirectiveController", AmendTaxInvDirectiveController);

    AmendTaxInvDirectiveController.$inject = ["helperService"];

    function AmendTaxInvDirectiveController(helperService) {
        var AmendTaxInvDirectiveCtrl = this;

        function Init() {
            AmendTaxInvDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            AmendTaxInvDirectiveCtrl.ePage.Masters.emptyText = "True";
            AmendTaxInvDirectiveCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL";
            AmendTaxInvDirectiveCtrl.ePage.Masters.MyTask = AmendTaxInvDirectiveCtrl.taskObj;
            if (AmendTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                AmendTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(AmendTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        // =============================== Amend Tax Invoice Edit Start =================================

        function IsSuppRequired() {
            AmendTaxInvDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        // =============================== Amend Tax Invoice Edit End =================================

        Init();
    }
})();