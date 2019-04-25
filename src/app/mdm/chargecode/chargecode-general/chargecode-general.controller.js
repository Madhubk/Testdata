(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeGeneralController", ChargecodeGeneralController);

    ChargecodeGeneralController.$inject = ["helperService", "chargecodeConfig"];

    function ChargecodeGeneralController(helperService, chargecodeConfig) {

        var ChargecodeGeneralCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeGeneralCtrl.currentChargecode[ChargecodeGeneralCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeGeneralCtrl.ePage.Masters.Config = chargecodeConfig;
            ChargecodeGeneralCtrl.ePage.Masters.UIChargecode = ChargecodeGeneralCtrl.ePage.Entities.Header.Data;

            /* Function  */
            ChargecodeGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
        }

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ChargecodeGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ChargecodeGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ChargecodeGeneralCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ChargecodeGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ChargecodeGeneralCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();