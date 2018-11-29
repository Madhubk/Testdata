/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolidationSIFilingGlbController", ExportSeaConsolidationSIFilingGlbController);

    ExportSeaConsolidationSIFilingGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ExportSeaConsolidationSIFilingGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ExportSeaConsolidationSIFilingGlbCtrl = this;

        function Init() {
            ExportSeaConsolidationSIFilingGlbCtrl.ePage = {
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

            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolidationSIFilingGlbCtrl.taskObj) {
                ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolidationSIFilingGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolidationSIFilingGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.TypeChange = TypeChange;
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.RefNumber = true;
            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DropDownMasterList = {};

            // Callback
            var _isEmpty = angular.equals({}, ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
        }

        function TypeChange() {
            if (ExportSeaConsolidationSIFilingGlbCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.SIFilingType == 'CARRIER')
                ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.RefNumber = false;
            else
                ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.RefNumber = true;
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
                EntityObject: ExportSeaConsolidationSIFilingGlbCtrl.ePage.Entities.Header.Data,
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
                        ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolidationSIFilingGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();