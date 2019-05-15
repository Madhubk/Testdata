(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeGeneralController", ChargecodeGeneralController);

    ChargecodeGeneralController.$inject = ["helperService", "toastr", "apiService", "chargecodeConfig"];

    function ChargecodeGeneralController(helperService, toastr, apiService, chargecodeConfig) {

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

            /* Function  */
            ChargecodeGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ChargecodeGeneralCtrl.ePage.Masters.OnChangeChargeCode = OnChangeChargeCode;
            ChargecodeGeneralCtrl.ePage.Masters.OnChangeChargeDesc = OnChangeChargeDesc;
            ChargecodeGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            InitDepartment();
        }

        //#region Department
        function InitDepartment() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": chargecodeConfig.Entities.API.CmpDepartment.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", chargecodeConfig.Entities.API.CmpDepartment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ChargecodeGeneralCtrl.ePage.Masters.DDDepartmentMasterList = response.data.Response;
                }
            });
        }
        //#endregion

        //#region SelectedLookup
        function SelectedLookupData($item, type) {
            if (type == "Company") {
                if ($item.CountryCode == "IN") {
                    ChargecodeGeneralCtrl.ePage.Entities.Header.Data.UIAccChargeCode.CMP_CountryCode = "IN";
                }
                OnChangeValues($item.Code, 'E1362');
            }
        }
        //#endregion

        //#region OnChangeChargeCode, OnChangeChargeDesc
        function OnChangeChargeCode($item) {
            if ($item) {
                if ($item.length > 5) {
                    toastr.error("Charge code maximum 5 char");
                    var ChargeCode = document.getElementById("focusChargeCode");
                    ChargeCode.focus();
                }
            }
        }

        function OnChangeChargeDesc($item) {
            if ($item) {
                if ($item.length > 50) {
                    toastr.error("Charge Desc maximum 50 char");
                    var ChargeDesc = document.getElementById("focusChargeDesc");
                    ChargeDesc.focus();
                }
            }
        }
        //#endregion

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