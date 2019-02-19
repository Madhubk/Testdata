/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolManifestFilingGlbController", ImportSeaConsolManifestFilingGlbController);

    ImportSeaConsolManifestFilingGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ImportSeaConsolManifestFilingGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ImportSeaConsolManifestFilingGlbCtrl = this;

        function Init() {
            ImportSeaConsolManifestFilingGlbCtrl.ePage = {
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

            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaConsolManifestFilingGlbCtrl.taskObj) {
                ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.TaskObj = ImportSeaConsolManifestFilingGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaConsolManifestFilingGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                // ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DatePicker = {};
            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.TypeChange = TypeChange;
            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.RefNumber = true;

            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DropDownMasterList = {};

            // Callback
            var _isEmpty = angular.equals({}, ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
        }

        function TypeChange() {
            if (ImportSeaConsolManifestFilingGlbCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo_Forwarder.SIFilingType == 'CARRIER')
                ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.RefNumber = false;
            else
                ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.RefNumber = true;
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
                        ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList_Forwarder.API.GetByID.Url + ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log(ImportSeaConsolManifestFilingGlbCtrl.ePage.Masters.EntityObj)
                    }
                });
            }
        }

        Init();
    }
})();