/*
Page : Pre Alert
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolPreAlertGlbController", ExportSeaConsolPreAlertGlbController);

    ExportSeaConsolPreAlertGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ExportSeaConsolPreAlertGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ExportSeaConsolPreAlerGlbCtrl = this;

        function Init() {
            ExportSeaConsolPreAlerGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolPreAlerGlbCtrl.taskObj) {
                ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolPreAlerGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolPreAlerGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
            // DatePicker
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.TypeChange = TypeChange;
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.RefNumber = true;
            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DropDownMasterList = {};

            // Callback
            var _isEmpty = angular.equals({}, ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }

        }

        function TypeChange() {
            if (ExportSeaConsolPreAlerGlbCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.SIFilingType == 'CARRIER')
                ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.RefNumber = false;
            else
                ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.RefNumber = true;
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Consol.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "CON",
                    SubModuleCode: "CON",
                    // Code: "E0013"
                },
                EntityObject: ExportSeaConsolPreAlerGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["CON_TYPE", "CON_PAYMENT", "CON_SI_FILING_TYPE"];
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
                        ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolPreAlerGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();