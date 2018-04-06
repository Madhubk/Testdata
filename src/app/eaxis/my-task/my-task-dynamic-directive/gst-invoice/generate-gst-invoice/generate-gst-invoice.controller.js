/*
    Page : Generate GST Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GenerateGSTInvDirectiveController", GenerateGSTInvDirectiveController);

    GenerateGSTInvDirectiveController.$inject = ["helperService"];

    function GenerateGSTInvDirectiveController(helperService) {
        var GenerateGSTInvDirectiveCtrl = this;

        function Init() {
            GenerateGSTInvDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            GenerateGSTInvDirectiveCtrl.ePage.Masters.emptyText = "True";
            GenerateGSTInvDirectiveCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            GenerateGSTInvDirectiveCtrl.ePage.Masters.MyTask = GenerateGSTInvDirectiveCtrl.taskObj;
            GenerateGSTInvDirectiveCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (GenerateGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                GenerateGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(GenerateGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            GenerateGSTInvDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
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