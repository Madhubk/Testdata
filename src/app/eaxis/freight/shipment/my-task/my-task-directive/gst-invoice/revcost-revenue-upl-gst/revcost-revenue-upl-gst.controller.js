/*
    Page : Review Cost and Revenue Upload GST
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RevCostandRevUplGSTDirController", RevCostandRevUplGSTDirController);

    RevCostandRevUplGSTDirController.$inject = ["helperService"];

    function RevCostandRevUplGSTDirController(helperService) {
        var RevCostandRevUplGSTDirCtrl = this;

        function Init() {
            RevCostandRevUplGSTDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Review_Cost_and_Revenue_Upload_GST_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            RevCostandRevUplGSTDirCtrl.ePage.Masters.emptyText = "True";
            RevCostandRevUplGSTDirCtrl.ePage.Masters.MyTask = RevCostandRevUplGSTDirCtrl.taskObj;
            RevCostandRevUplGSTDirCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (RevCostandRevUplGSTDirCtrl.ePage.Masters.MyTask.OtherConfig) {
                RevCostandRevUplGSTDirCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(RevCostandRevUplGSTDirCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        // ============================= Review Cost and Revenue Upload GST Start=============================

        function IsSuppRequired() {
            RevCostandRevUplGSTDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        // ============================= Review Cost and Revenue Upload GST End=============================


        Init();
    }
})();