(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeDetailsController", ChargecodeDetailsController);

    ChargecodeDetailsController.$inject = ["helperService", "apiService", "appConfig", "authService", "toastr", "chargecodeConfig"];

    function ChargecodeDetailsController(helperService, apiService, appConfig, authService, toastr, chargecodeConfig) {

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

            /* Function  */
            ChargecodeDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ChargecodeDetailsCtrl.ePage.Masters.OnChangeMarginValues = OnChangeMarginValues;
            ChargecodeDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            /* DropDown List */
            ChargecodeDetailsCtrl.ePage.Masters.DropDownMasterList = {
                "ChargeType": {
                    "ListSource": []
                },
                "ChargeGroup": {
                    "ListSource": []
                }
            };

            GetDropDownList();
        }

        //#region DropDownList
        function GetDropDownList() {
            var typeCodeList = ["ChargeType", "ChargeGroup"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    console.log("Drop Down", response.data.Response);
                    typeCodeList.map(function (value, key) {
                        ChargecodeDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ChargecodeDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region SelectedLookup
        function SelectedLookupData($item, type) {
            if (type == "CostAccural") {
                ChargecodeDetailsCtrl.ePage.Entities.Header.Data.UIAccChargeCode.AGH_AccrualAccount = $item.PK;
            } else if (type == "RevenueAccural") {
                ChargecodeDetailsCtrl.ePage.Entities.Header.Data.UIAccChargeCode.AGH_WIPAccount = $item.PK;
            } else if (type == "CostActual") {
                ChargecodeDetailsCtrl.ePage.Entities.Header.Data.UIAccChargeCode.AGH_CostAccount = $item.PK;
            } else if (type == "RevenueActual") {
                ChargecodeDetailsCtrl.ePage.Entities.Header.Data.UIAccChargeCode.AGH_RevenueAccount = $item.PK;
            }
        }
        //#endregion

        //#region OnChangeMarginValues
        function OnChangeMarginValues($item) {
            if (parseFloat($item) > 100) {
                toastr.error("Margin % must be allowed o to 100 only.");
                var margin = document.getElementById("focusTextBox");
                margin.focus();
            }
        }
        //#endregion

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