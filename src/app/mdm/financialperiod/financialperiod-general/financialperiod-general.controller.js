(function () {
    "use strict";

    angular.module("Application")
        .controller("FinancePeriodGeneralController", FinancePeriodGeneralController);

    FinancePeriodGeneralController.$inject = ["helperService", "financeperiodConfig"];

    function FinancePeriodGeneralController(helperService, financeperiodConfig) {

        var FinancePeriodGeneralCtrl = this;

        function Init() {

            var currentFinancialperiod = FinancePeriodGeneralCtrl.currentFinancialperiod[FinancePeriodGeneralCtrl.currentFinancialperiod.code].ePage.Entities;

            FinancePeriodGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Financeperiod",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentFinancialperiod
            };

            FinancePeriodGeneralCtrl.ePage.Masters.Config = financeperiodConfig;

            /* Function */
            FinancePeriodGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            // InitGLccount();
            console.log("Check:", FinancePeriodGeneralCtrl.ePage.Entities.Header.Data);
        }

        //#region GLccount
        // function InitGLccount(){
        //     if (FinancePeriodGeneralCtrl.currentFinancialperiod.isNew) {
        //         FinancePeriodGeneralCtrl.ePage.Entities.Header.Data.IsValid = true;
        //     }
        // }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(FinancePeriodGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                FinancePeriodGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, FinancePeriodGeneralCtrl.currentFinancialperiod.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                FinancePeriodGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, FinancePeriodGeneralCtrl.currentFinancialperiod.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();