/*
    Page : Liner Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolLinerInvGlbController", ExportSeaConsolLinerInvGlbController);

    ExportSeaConsolLinerInvGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolLinerInvGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolLinerInvGlbCtrl = this;

        function Init() {
            ExportSeaConsolLinerInvGlbCtrl.ePage = {
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

            ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolLinerInvGlbCtrl.taskObj) {
                ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolLinerInvGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolLinerInvGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
            // DatePicker
            ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DropDownMasterList = {};

            // Callback
            var _isEmpty = angular.equals({}, ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
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
                        ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolLinerInvGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();