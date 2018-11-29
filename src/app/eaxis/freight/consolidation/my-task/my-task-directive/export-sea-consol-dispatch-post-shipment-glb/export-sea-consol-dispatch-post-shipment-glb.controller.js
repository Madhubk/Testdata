/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolDispatchPostShipmentGlbController", ExportSeaConsolDispatchPostShipmentGlbController);

    ExportSeaConsolDispatchPostShipmentGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolDispatchPostShipmentGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolDispatchPostShipmentGlbCtrl = this;

        function Init() {
            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage = {
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

            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolDispatchPostShipmentGlbCtrl.taskObj) {
                ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolDispatchPostShipmentGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
            // DatePicker
            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DropDownMasterList = {};

            // Callback
            var _isEmpty = angular.equals({}, ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DropDownMasterList);
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
                        ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log(ExportSeaConsolDispatchPostShipmentGlbCtrl.ePage.Masters.EntityObj);
                    }
                });
            }
        }

        Init();
    }
})();