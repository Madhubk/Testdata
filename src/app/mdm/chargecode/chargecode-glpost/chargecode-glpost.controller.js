(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeGlpostController", ChargecodeGlpostController);

    ChargecodeGlpostController.$inject = ["helperService", "chargecodeConfig"];

    function ChargecodeGlpostController(helperService, chargecodeConfig) {

        var ChargecodeGlpostCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeGlpostCtrl.currentChargecode[ChargecodeGlpostCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeGlpostCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeGlpostCtrl.ePage.Masters.Config = chargecodeConfig;
            ChargecodeGlpostCtrl.ePage.Masters.UIChargecode = ChargecodeGlpostCtrl.ePage.Entities.Header.Data;

            /* Function  */
            ChargecodeGlpostCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
        }

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ChargecodeGlpostCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ChargecodeGlpostCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ChargecodeGlpostCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ChargecodeGlpostCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ChargecodeGlpostCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();