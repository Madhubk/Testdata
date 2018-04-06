/*
    Page : Generate Tax Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GenerateTaxInvDirectiveController", GenerateTaxInvDirectiveController);

    GenerateTaxInvDirectiveController.$inject = ["helperService"];

    function GenerateTaxInvDirectiveController(helperService) {
        var GenerateTaxInvDirectiveCtrl = this;

        function Init() {
            GenerateTaxInvDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            GenerateTaxInvDirectiveCtrl.ePage.Masters.emptyText = "True";
            GenerateTaxInvDirectiveCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            GenerateTaxInvDirectiveCtrl.ePage.Masters.MyTask = GenerateTaxInvDirectiveCtrl.taskObj;
            GenerateTaxInvDirectiveCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (GenerateTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                GenerateTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(GenerateTaxInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        // =============================Generate Tax Invoice Start============================

        function IsSuppRequired() {
            GenerateTaxInvDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        // ============================= Generate Tax Invoice End ============================

        Init();
    }
})();