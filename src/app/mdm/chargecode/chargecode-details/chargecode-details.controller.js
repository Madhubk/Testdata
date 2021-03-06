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
            if (type == "RevenueMISgroup") {
                ChargecodeDetailsCtrl.ePage.Entities.Header.Data.UIAccChargeCode.AGP_SalesGroup = $item.PK;
            } else if (type == "CostMISgroup") {
                ChargecodeDetailsCtrl.ePage.Entities.Header.Data.UIAccChargeCode.AGP_ExpenseGroup = $item.PK;
            } else if (type == "CostAccural") {
                OnChangeValues($item.AccountNum, 'E1353');
            } else if (type == "RevenueAccural") {
                OnChangeValues($item.AccountNum, 'E1354');
            } else if (type == "CostActual") {
                OnChangeValues($item.AccountNum, 'E1355');
            } else if (type == "RevenueActual") {
                OnChangeValues($item.AccountNum, 'E1356');
            }
        }
        //#endregion

        //#region OnChangeMarginValues
        function OnChangeMarginValues($item) {
            if (parseFloat($item) > 100) {
                toastr.error("Margin % must be allowed 0 to 100 only.");
                var margin = document.getElementById("focusMargin");
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