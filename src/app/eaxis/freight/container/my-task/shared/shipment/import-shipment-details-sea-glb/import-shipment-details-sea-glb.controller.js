/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportShipmentDetailsSeaGlbController", ImportShipmentDetailsSeaGlbController);

    ImportShipmentDetailsSeaGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "authService", "APP_CONSTANT"];

    function ImportShipmentDetailsSeaGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, authService, APP_CONSTANT) {
        var ImportShipmentSeaGlbCtrl = this;

        function Init() {
            ImportShipmentSeaGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Package",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ImportShipmentSeaGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Shipment) {
                ImportShipmentSeaGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ImportShipmentSeaGlbCtrl.currentShipment = myTaskActivityConfig.Entities.Shipment;
            }

            // DatePicker
            ImportShipmentSeaGlbCtrl.ePage.Masters.DatePicker = {};
            ImportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetShpContainerType();
            GetMastersList();
            ImportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList = {};

            ImportShipmentSeaGlbCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ModeChange(obj) {
            if (obj) {
                ImportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                ImportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key

            } else {
                ImportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                ImportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["RELEASETYPE", "INCOTERM", "SHPTYPE", "CON_TYPE", "AIRWAY", "HOUSEBILL", "ONBOARD", "CON_PAYMENT", "CHARGEAPLY", "ENTRYDETAILS", "WEIGHTUNIT", "VOLUMEUNIT"];
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
                        ImportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ImportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            // Get Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    ImportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ImportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ImportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ImportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }


        function GetShpContainerType() {
            ImportShipmentSeaGlbCtrl.ePage.Masters.CfxTypesList = {}
            //ContainerType
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    ImportShipmentSeaGlbCtrl.ePage.Masters.CfxTypesList.ShpCntType = response.data.Response
                    var obj = _.filter(ImportShipmentSeaGlbCtrl.ePage.Masters.CfxTypesList.ShpCntType, {
                        'Key': ImportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    ImportShipmentSeaGlbCtrl.ePage.Masters.shpselectedMode = obj;
                }
            });
        }

        Init();
    }
})();