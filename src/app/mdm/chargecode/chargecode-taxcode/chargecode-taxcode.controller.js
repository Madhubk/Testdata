(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeTaxcodeController", ChargecodeTaxcodeController);

    ChargecodeTaxcodeController.$inject = ["helperService", "chargecodeConfig"];

    function ChargecodeTaxcodeController(helperService, chargecodeConfig) {

        var ChargecodeTaxcodeCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeTaxcodeCtrl.currentChargecode[ChargecodeTaxcodeCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeTaxcodeCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeTaxcodeCtrl.ePage.Masters.Config = chargecodeConfig;
            ChargecodeTaxcodeCtrl.ePage.Masters.UIChargecode = ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data;

            /* Function  */
            ChargecodeTaxcodeCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
        }

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ChargecodeTaxcodeCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ChargecodeTaxcodeCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ChargecodeTaxcodeCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ChargecodeTaxcodeCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ChargecodeTaxcodeCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();