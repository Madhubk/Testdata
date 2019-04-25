(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeDetailsController", ChargecodeDetailsController);

    ChargecodeDetailsController.$inject = ["helperService", "chargecodeConfig"];

    function ChargecodeDetailsController(helperService, chargecodeConfig) {

        var ChargecodeDetailsCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeDetailsCtrl.currentChargecode[ChargecodeDetailsCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeDetailsCtrl.ePage.Masters.Config = chargecodeConfig;
            ChargecodeDetailsCtrl.ePage.Masters.UIChargecode = ChargecodeDetailsCtrl.ePage.Entities.Header.Data;

            /* Function  */
            ChargecodeDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
        }

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ChargecodeDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ChargecodeDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ChargecodeDetailsCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ChargecodeDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ChargecodeDetailsCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();