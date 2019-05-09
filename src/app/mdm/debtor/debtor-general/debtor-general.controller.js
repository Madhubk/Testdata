(function () {
    "use strict";

    angular.module("Application")
        .controller("DebtorGeneralController", DebtorGeneralController);

    DebtorGeneralController.$inject = ["helperService", "debtorConfig"];

    function DebtorGeneralController(helperService, debtorConfig) {

        var DebtorGeneralCtrl = this;

        function Init() {

            var currentDebtor = DebtorGeneralCtrl.currentDebtor[DebtorGeneralCtrl.currentDebtor.code].ePage.Entities;

            DebtorGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Debtor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDebtor
            };

            DebtorGeneralCtrl.ePage.Masters.Config = debtorConfig;
           
            /* Function */
            DebtorGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            InitDebtorGroup();
        }

        //#region DebtorGroup
        function InitDebtorGroup(){
            if (DebtorGeneralCtrl.currentDebtor.isNew) {
                DebtorGeneralCtrl.ePage.Entities.Header.Data.IsValid = true;
            }
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(DebtorGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                DebtorGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DebtorGeneralCtrl.currentDebtor.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                DebtorGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DebtorGeneralCtrl.currentDebtor.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();