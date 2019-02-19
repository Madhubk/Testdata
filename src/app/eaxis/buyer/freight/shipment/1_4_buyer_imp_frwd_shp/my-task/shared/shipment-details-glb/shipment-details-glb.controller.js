/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentDetailsGlbController", ShipmentDetailsGlbController);

    ShipmentDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "$timeout", "myTaskActivityConfig", "authService", "APP_CONSTANT"];

    function ShipmentDetailsGlbController($scope, apiService, helperService, appConfig, $timeout, myTaskActivityConfig, authService, APP_CONSTANT) {
        var ShipmentGlbCtrl = this;

        function Init() {
            ShipmentGlbCtrl.ePage = {
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
            ShipmentGlbCtrl.ePage.Masters.Package={}
            ShipmentGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Shipment) {
                ShipmentGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ShipmentGlbCtrl.currentShipment = myTaskActivityConfig.Entities.Shipment;
            }

            // DatePicker
            ShipmentGlbCtrl.ePage.Masters.DatePicker = {};
            ShipmentGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ShipmentGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ShipmentGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ShipmentGlbCtrl.ePage.Masters.TableProperty={
                "status": {
                    "isenabled": true,
                    "position": "5",
                    "width": "120"
                },
                "vessel": {
                    "isenabled": true,
                    "position": "7",
                    "width": "120"
                },
                "voyageflight": {
                    "isenabled": true,
                    "position": "6",
                    "width": "120"
                },
                "etd": {
                    "isenabled": true,
                    "position": "10",
                    "width": "120"
                },
                "eta": {
                    "isenabled": true,
                    "position": "11",
                    "width": "120"
                },
                "atd": {
                    "isenabled": true,
                    "position": "12",
                    "width": "120"
                },
                "ata": {
                    "isenabled": true,
                    "position": "13",
                    "width": "120"
                },
                "legno": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                },
                "islinked": {
                    "isenabled": true,
                    "position": "2",
                    "width": "100"
                },
                "mode": {
                    "isenabled": true,
                    "position": "3",
                    "width": "120"
                },
                "type": {
                    "isenabled": true,
                    "position": "4",
                    "width": "120"
                },
                "pol": {
                    "isenabled": true,
                    "position": "8",
                    "width": "120"
                },
                "pod": {
                    "isenabled": true,
                    "position": "9",
                    "width": "120"
                },
                "definedby": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                },
                "entitysource": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                }

            }

            GetShpContainerType();
            GetMastersList();
            ShipmentGlbCtrl.ePage.Masters.DropDownMasterList = {};

            ShipmentGlbCtrl.ePage.Masters.ModeChange = ModeChange;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ShipmentGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ModeChange(obj) {
            if (obj) {
                ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key

            } else {
                ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
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
                        ShipmentGlbCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ShipmentGlbCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    ShipmentGlbCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ShipmentGlbCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ShipmentGlbCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ShipmentGlbCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;                    
                    GetPackageDetails();
                }
            });
        }


        function GetShpContainerType() {
            ShipmentGlbCtrl.ePage.Masters.CfxTypesList = {}
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
                    ShipmentGlbCtrl.ePage.Masters.CfxTypesList.ShpCntType = response.data.Response
                    var obj = _.filter(ShipmentGlbCtrl.ePage.Masters.CfxTypesList.ShpCntType, {
                        'Key': ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    ShipmentGlbCtrl.ePage.Masters.shpselectedMode = obj;
                }
            });
        }

        function GetPackageDetails() {
            var _gridData = [];
            console.log(ShipmentGlbCtrl.currentShipment);
            ShipmentGlbCtrl.ePage.Masters.Package.GridData = undefined;
            ShipmentGlbCtrl.ePage.Masters.Package.FormView = {};
            ShipmentGlbCtrl.ePage.Masters.Package.FormView.F3_NKPackType = ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType;
            ShipmentGlbCtrl.ePage.Masters.Package.FormView.UnitOfDimension = "M";
            ShipmentGlbCtrl.ePage.Masters.Package.FormView.ActualWeightUQ = ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight;
            ShipmentGlbCtrl.ePage.Masters.Package.FormView.ActualVolumeUQ = ShipmentGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume;
            ShipmentGlbCtrl.ePage.Masters.Package.IsSelected = false;
            $timeout(function () {
                if (ShipmentGlbCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    ShipmentGlbCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "STD") {
                            value.Index = key
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("PackageList is Empty");
                }
                ShipmentGlbCtrl.ePage.Masters.Package.GridData = _gridData;
            });
        }
        Init();
    }
})();