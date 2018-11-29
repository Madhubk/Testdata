/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportShipmentDetailsSeaGlbController", ExportShipmentDetailsSeaGlbController);

    ExportShipmentDetailsSeaGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "$timeout", "myTaskActivityConfig", "authService", "APP_CONSTANT"];

    function ExportShipmentDetailsSeaGlbController($scope, apiService, helperService, appConfig, $timeout, myTaskActivityConfig, authService, APP_CONSTANT) {
        var ExportShipmentSeaGlbCtrl = this;

        function Init() {
            ExportShipmentSeaGlbCtrl.ePage = {
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
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package={}
            ExportShipmentSeaGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Shipment) {
                ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportShipmentSeaGlbCtrl.currentShipment = myTaskActivityConfig.Entities.Shipment;
            }

            // DatePicker
            ExportShipmentSeaGlbCtrl.ePage.Masters.DatePicker = {};
            ExportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetShpContainerType();
            GetMastersList();
            ExportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList = {};

            ExportShipmentSeaGlbCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportShipmentSeaGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ModeChange(obj) {
            if (obj) {
                ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key

            } else {
                ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
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
                        ExportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ExportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    ExportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ExportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ExportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ExportShipmentSeaGlbCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;                    
                    GetPackageDetails();
                }
            });
        }


        function GetShpContainerType() {
            ExportShipmentSeaGlbCtrl.ePage.Masters.CfxTypesList = {}
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
                    ExportShipmentSeaGlbCtrl.ePage.Masters.CfxTypesList.ShpCntType = response.data.Response
                    var obj = _.filter(ExportShipmentSeaGlbCtrl.ePage.Masters.CfxTypesList.ShpCntType, {
                        'Key': ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    ExportShipmentSeaGlbCtrl.ePage.Masters.shpselectedMode = obj;
                }
            });
        }

        function GetPackageDetails() {
            var _gridData = [];
            console.log(ExportShipmentSeaGlbCtrl.currentShipment);
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package.GridData = undefined;
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package.FormView = {};
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package.FormView.F3_NKPackType = ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType;
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package.FormView.UnitOfDimension = "M";
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package.FormView.ActualWeightUQ = ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight;
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package.FormView.ActualVolumeUQ = ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume;
            ExportShipmentSeaGlbCtrl.ePage.Masters.Package.IsSelected = false;
            $timeout(function () {
                if (ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    ExportShipmentSeaGlbCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "STD") {
                            value.Index = key
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("PackageList is Empty");
                }
                ExportShipmentSeaGlbCtrl.ePage.Masters.Package.GridData = _gridData;
            });
        }
        Init();
    }
})();