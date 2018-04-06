/*
    Page : Cost And Revenue Upload 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CostandRevUplDirectiveController", CostandRevUplDirectiveController);

    CostandRevUplDirectiveController.$inject = ["helperService"];

    function CostandRevUplDirectiveController(helperService) {
        var CostandRevUplDirectiveCtrl = this;

        function Init() {
            CostandRevUplDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Tax_Invoice_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            CostandRevUplDirectiveCtrl.ePage.Masters.emptyText = "True";
            CostandRevUplDirectiveCtrl.ePage.Masters.MyTask = CostandRevUplDirectiveCtrl.taskObj;
            CostandRevUplDirectiveCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (CostandRevUplDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                CostandRevUplDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(CostandRevUplDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        // =============================Cost and Revenue Upload Start=============================

        function IsSuppRequired() {
            CostandRevUplDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        // =============================Cost and Revenue Upload End=============================


        Init();
    }
})();