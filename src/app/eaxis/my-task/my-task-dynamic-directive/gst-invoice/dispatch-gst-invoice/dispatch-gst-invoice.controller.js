/*
    Page : Dispatch GST Invoice 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchGSTInvDirectiveController", DispatchGSTInvDirectiveController);

    DispatchGSTInvDirectiveController.$inject = ["helperService"];

    function DispatchGSTInvDirectiveController(helperService) {
        var DispatchGSTInvDirectiveCtrl = this;

        function Init() {
            DispatchGSTInvDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            DispatchGSTInvDirectiveCtrl.ePage.Masters.emptyText = "True";
            DispatchGSTInvDirectiveCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            DispatchGSTInvDirectiveCtrl.ePage.Masters.MyTask = DispatchGSTInvDirectiveCtrl.taskObj;
            DispatchGSTInvDirectiveCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (DispatchGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                DispatchGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(DispatchGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            DispatchGSTInvDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
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