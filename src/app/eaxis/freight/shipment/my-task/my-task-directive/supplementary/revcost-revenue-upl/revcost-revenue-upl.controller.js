/*
    Page : Review Cost and Revenue Upload
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RevCostandRevUplDirController", RevCostandRevUplDirController);

    RevCostandRevUplDirController.$inject = ["helperService"];

    function RevCostandRevUplDirController(helperService) {
        var RevCostandRevUplDirCtrl = this;

        function Init() {
            RevCostandRevUplDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            RevCostandRevUplDirCtrl.ePage.Masters.emptyText = "True";
            RevCostandRevUplDirCtrl.ePage.Masters.MyTask = RevCostandRevUplDirCtrl.taskObj;
            RevCostandRevUplDirCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (RevCostandRevUplDirCtrl.ePage.Masters.MyTask.OtherConfig) {
                RevCostandRevUplDirCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(RevCostandRevUplDirCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            RevCostandRevUplDirCtrl.ePage.Masters.IsSuppRequired = [{
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