(function () {
    "use strict";

    angular.module("Application")
        .controller("CreditorGeneralController", CreditorGeneralController);

    CreditorGeneralController.$inject = ["helperService", "creditorConfig"];

    function CreditorGeneralController(helperService, creditorConfig) {

        var CreditorGeneralCtrl = this;

        function Init() {

            var currentCreditor = CreditorGeneralCtrl.currentCreditor[CreditorGeneralCtrl.currentCreditor.code].ePage.Entities;

            CreditorGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCreditor
            };

            CreditorGeneralCtrl.ePage.Masters.Config = creditorConfig;
            CreditorGeneralCtrl.ePage.Masters.UICreditor = CreditorGeneralCtrl.ePage.Entities.Header.Data;

            /* Function  */
            CreditorGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
        }

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(CreditorGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                CreditorGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CreditorGeneralCtrl.currentCreditor.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                CreditorGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, CreditorGeneralCtrl.currentCreditor.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();