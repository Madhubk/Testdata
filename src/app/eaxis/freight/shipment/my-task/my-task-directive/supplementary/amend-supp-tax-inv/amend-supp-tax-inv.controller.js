/*
    Page : Amend Supplementary Tax Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AmendSupptaxInvDirController", AmendSupptaxInvDirController);

    AmendSupptaxInvDirController.$inject = ["helperService"];

    function AmendSupptaxInvDirController(helperService) {
        var AmendSupptaxInvDirCtrl = this;

        function Init() {
            AmendSupptaxInvDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            AmendSupptaxInvDirCtrl.ePage.Masters.emptyText = "True";
            AmendSupptaxInvDirCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            AmendSupptaxInvDirCtrl.ePage.Masters.MyTask = AmendSupptaxInvDirCtrl.taskObj;
            AmendSupptaxInvDirCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (AmendSupptaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig) {
                AmendSupptaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(AmendSupptaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            AmendSupptaxInvDirCtrl.ePage.Masters.IsSuppRequired = [{
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