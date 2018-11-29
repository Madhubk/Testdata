/*
    Page : Collect Payment for GST Invoice 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PaymentforGSTInvDirectiveController", PaymentforGSTInvDirectiveController);

    PaymentforGSTInvDirectiveController.$inject = ["helperService"];

    function PaymentforGSTInvDirectiveController(helperService) {
        var PaymentforGSTInvDirectiveCtrl = this;

        function Init() {
            PaymentforGSTInvDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            PaymentforGSTInvDirectiveCtrl.ePage.Masters.emptyText = "True";
            PaymentforGSTInvDirectiveCtrl.ePage.Masters.OrgemptyText = "DEMBUYMEL"
            PaymentforGSTInvDirectiveCtrl.ePage.Masters.MyTask = PaymentforGSTInvDirectiveCtrl.taskObj;
            PaymentforGSTInvDirectiveCtrl.ePage.Masters.Supplemetary = "Supplementary Test"
            if (PaymentforGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                PaymentforGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(PaymentforGSTInvDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
            }
            IsSuppRequired();
        }

        function IsSuppRequired() {
            PaymentforGSTInvDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
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