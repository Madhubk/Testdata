(function () {
    "use strict";

    angular.module("Application")
        .controller("GLaccountGeneralController", GLaccountGeneralController);

        GLaccountGeneralController.$inject = ["helperService", "glaccountConfig"];

    function GLaccountGeneralController(helperService, glaccountConfig) {

        var GLaccountGeneralCtrl = this;

        function Init() {

            var currentGlaccount = GLaccountGeneralCtrl.currentGlaccount[GLaccountGeneralCtrl.currentGlaccount.code].ePage.Entities;

            GLaccountGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_GLaccount",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGlaccount
            };

            GLaccountGeneralCtrl.ePage.Masters.Config = glaccountConfig;
           
            /* Function */
            GLaccountGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            InitGLccount();
            console.log("Check:", GLaccountGeneralCtrl.ePage.Entities.Header.Data);
        }

        //#region GLccount
        function InitGLccount(){
            if (GLaccountGeneralCtrl.currentGlaccount.isNew) {
                GLaccountGeneralCtrl.ePage.Entities.Header.Data.IsValid = true;
            }
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(GLaccountGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                GLaccountGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, GLaccountGeneralCtrl.currentGlaccount.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                GLaccountGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, GLaccountGeneralCtrl.currentGlaccount.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();