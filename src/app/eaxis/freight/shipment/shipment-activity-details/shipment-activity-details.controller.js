
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentActivityDetailsController", ShipmentActivityDetailsController);

    ShipmentActivityDetailsController.$inject = ["$scope", "$rootScope", "$q", "$uibModal", "$timeout", "helperService", "appConfig", "apiService", "APP_CONSTANT", "toastr", "authService"];

    function ShipmentActivityDetailsController($scope, $rootScope, $q, $uibModal, $timeout, helperService, appConfig, apiService, APP_CONSTANT, toastr, authService) {
        var ShipmentActivityDetailsCtrl = this;
        var CurrentObject = ShipmentActivityDetailsCtrl.currentObj[ShipmentActivityDetailsCtrl.currentObj.label].ePage.Entities;
        function Init() {
            ShipmentActivityDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Activity_Details",
                "Masters": {},
                "Meta": {},
                "Entities": CurrentObject
            };
            ShipmentActivityDetailsCtrl.ePage.Masters.emptyText = "-";
            // DatePicker
            ShipmentActivityDetailsCtrl.ePage.Masters.DatePicker = {};
            ShipmentActivityDetailsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ShipmentActivityDetailsCtrl.ePage.Masters.DatePicker.isOpen = [];
            ShipmentActivityDetailsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            InitActiviy();
        }

        function InitActiviy() {
            ShipmentActivityDetailsCtrl.ePage.Masters.modeChange = ModeChange;
            ShipmentActivityDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList = {};
            // Callback
            var _isEmpty = angular.equals({}, ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
            GetShpContainerType();
            GetJobEntryDetails();

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ShipmentActivityDetailsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    ShipmentActivityDetailsCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });
        }

        function GetJobEntryDetails() {
            if (ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIJobEntryNums) {
                ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                    if (value.Category === "CUS") {
                        ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                    }
                });
            }
        }

        function GetShpContainerType() {
            ShipmentActivityDetailsCtrl.ePage.Masters.CfxTypesList = {}
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
                    ShipmentActivityDetailsCtrl.ePage.Masters.CfxTypesList.ShpCntType = response.data.Response
                    var obj = _.filter(ShipmentActivityDetailsCtrl.ePage.Masters.CfxTypesList.ShpCntType, {

                        'Key': ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    ShipmentActivityDetailsCtrl.ePage.Masters.shpselectedMode = obj;
                }
            });
        }

        function SelectedLookupData($item, type, addressType, addressType1) {
            if (type === "address") {
                AddressContactList($item.data.entity, addressType, addressType1);
            }
            if (addressType == 'CRD') {
                ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.data.entity.OAD_RelatedPortCode
            }
            if (addressType == 'CED') {
                ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.data.entity.OAD_RelatedPortCode
            }
        }

        function ModeChange(obj) {
            if (obj) {
                ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key

            } else {
                ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                ShipmentActivityDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
        }

        Init();
    }
})();