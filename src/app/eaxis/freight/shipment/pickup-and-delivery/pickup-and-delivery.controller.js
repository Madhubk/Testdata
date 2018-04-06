(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentPickupAndDeliveryController", ShipmentPickupAndDeliveryController);

    ShipmentPickupAndDeliveryController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "shipmentConfig", "helperService", "toastr"];

    function ShipmentPickupAndDeliveryController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, shipmentConfig, helperService, toastr) {
        /* jshint validthis: true */
        var ShipmentPickupAndDeliveryCtrl = this;

        function Init() {
            var currentShipment = ShipmentPickupAndDeliveryCtrl.currentShipment[ShipmentPickupAndDeliveryCtrl.currentShipment.label].ePage.Entities;
            ShipmentPickupAndDeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_PickupAndDeliveryCtrl",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            // DatePicker
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker = {};
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.isOpen = [];
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ShipmentPickupAndDeliveryCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;

            ShipmentPickupAndDeliveryCtrl.ePage.Masters.Address = {};
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.OnContactChange = OnContactChange;

            ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Pickup = {
                AddressList: [],
                ContactList: []
            };
            ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Delivery = {
                AddressList: []
            };

            ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Pickup = {
                AddressList: [],
                ContactList: []
            };
            ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Delivery = {
                AddressList: []
            };
            ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PCFS = {
                AddressList: [],
                ContactList: []
            };
            ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.DCFS = {
                AddressList: []
            };

            loadAddressContactList()
            
        }

        function loadAddressContactList(){


            if (ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupTransportFK) {
                var _obj = {
                    "PK": ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupTransportFK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "Pickup", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "Pickup", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            }
            if (ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ExportReceivingCFS_FK) {
                var _obj = {
                    "PK": ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ExportReceivingCFS_FK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "PCFS", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "PCFS", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }
            if (ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryTransportFK) {
                var _obj = {
                    "PK": ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryTransportFK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "Delivery", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                // GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "Delivery", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            }
            if (ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ImportReleaseCFS_FK) {
                var _obj = {
                    "PK": ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ImportReleaseCFS_FK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "DCFS", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                // GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "DCFS", ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }

        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SelectedLookupData($item, type, addressType) {
            console.log($item, type, addressType)
            if (type === "address") {
                GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK", addressType, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
                GetAddressContactList($item.entity, "OrgContact", "ContactList", "PK", addressType, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            } else if (type === "Pickup") {
                GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                GetAddressContactList($item.entity, "OrgContact", "ContactList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "Delivery") {
                GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "PCFS") {
                GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                GetAddressContactList($item.entity, "OrgContact", "ContactList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            } else if (type === "DCFS") {
                GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }
        }

        function AutoCompleteOnSelect($item, type, addressType) {
            if (type === "address") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
                GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            } else if (type === "Pickup") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                GetAddressContactList($item, "OrgContact", "ContactList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "Delivery") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "PCFS") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                GetAddressContactList($item, "OrgContact", "ContactList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            } else if (type === "DCFS") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, addressType, obj) {
            obj[addressType][listSource] = undefined;
            obj[addressType].IsModified = true;

            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function OnAddressChange(selectedItem, addressType, type) {
            if (type === "address") {
                if (selectedItem) {
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnContactChange(selectedItem, addressType, type) {
            if (type === "address") {
                if (selectedItem) {
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    ShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }

        // ===================== Pickup Details Start =====================

        function InitPickup() {
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.Pickup = {};
        }

        // ===================== Pickup Details End =====================

        // ===================== Delivery Details Start =====================

        function InitDelivery() {
            ShipmentPickupAndDeliveryCtrl.ePage.Masters.Delivery = {};
        }

        // ===================== Delivery Details End =====================

        Init();
    }
})();