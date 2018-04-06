/*
    Page : Raise Supplementary Tax Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RaiseSuppTaxInvDirController", RaiseSuppTaxInvDirController);

    RaiseSuppTaxInvDirController.$inject = ["helperService"];

    function RaiseSuppTaxInvDirController(helperService) {
        var RaiseSuppTaxInvDirCtrl = this;

        function Init() {
            RaiseSuppTaxInvDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            RaiseSuppTaxInvDirCtrl.ePage.Masters.emptyText = "True";
            RaiseSuppTaxInvDirCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            RaiseSuppTaxInvDirCtrl.ePage.Masters.MyTask = RaiseSuppTaxInvDirCtrl.taskObj;
            RaiseSuppTaxInvDirCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (RaiseSuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig) {
                RaiseSuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(RaiseSuppTaxInvDirCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            RaiseSuppTaxInvDirCtrl.ePage.Masters.IsSuppRequired = [{
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