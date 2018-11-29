
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentHouseBillDetailsController", ShipmentHouseBillDetailsController);

    ShipmentHouseBillDetailsController.$inject = ["helperService", "appConfig", "apiService", "authService", "APP_CONSTANT", "errorWarningService"];

    function ShipmentHouseBillDetailsController(helperService, appConfig, apiService, authService, APP_CONSTANT, errorWarningService) {
        var ShipmentHouseBillDetailsCtrl = this;
        var CurrentObject = ShipmentHouseBillDetailsCtrl.currentObj[ShipmentHouseBillDetailsCtrl.currentObj.label].ePage.Entities;
        function Init() {
            ShipmentHouseBillDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Activity_Details",
                "Masters": {},
                "Meta": {},
                "Entities": CurrentObject
            };

            ShipmentHouseBillDetailsCtrl.ePage.Masters.TaskObj = ShipmentHouseBillDetailsCtrl.taskObj;
            ShipmentHouseBillDetailsCtrl.ePage.Masters.DropDownMasterList = {};
            // DatePicker
            ShipmentHouseBillDetailsCtrl.ePage.Masters.DatePicker = {};
            ShipmentHouseBillDetailsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ShipmentHouseBillDetailsCtrl.ePage.Masters.DatePicker.isOpen = [];
            ShipmentHouseBillDetailsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            // Callback
            var _isEmpty = angular.equals({}, ShipmentHouseBillDetailsCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }

            ShipmentHouseBillDetailsCtrl.listSource = ShipmentHouseBillDetailsCtrl.ePage.Entities.Header.Data;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ShipmentHouseBillDetailsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["HOUSEBILL", "RELEASETYPE", "ONBOARD", "CHARGEAPLY"];
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
                        ShipmentHouseBillDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ShipmentHouseBillDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        Init();
    }
})();