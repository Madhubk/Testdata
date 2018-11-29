(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeShipmentPickupAndDeliveryController", oneThreeShipmentPickupAndDeliveryController);

    oneThreeShipmentPickupAndDeliveryController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_shipmentConfig", "helperService", "toastr"];

    function oneThreeShipmentPickupAndDeliveryController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, three_shipmentConfig, helperService, toastr) {
        /* jshint validthis: true */
        var oneThreeShipmentPickupAndDeliveryCtrl = this;

        function Init() {
            var currentShipment = oneThreeShipmentPickupAndDeliveryCtrl.currentShipment[oneThreeShipmentPickupAndDeliveryCtrl.currentShipment.label].ePage.Entities;
            oneThreeShipmentPickupAndDeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_PickupAndDeliveryCtrl",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            // DatePicker
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker = {};
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.isOpen = [];
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.DropDownMasterList = three_shipmentConfig.Entities.Header.Meta;

            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.Address = {};
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.OnContactChange = OnContactChange;

            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Pickup = {
                AddressList: [],
                ContactList: []
            };
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Delivery = {
                AddressList: []
            };

            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Pickup = {
                AddressList: [],
                ContactList: []
            };
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Delivery = {
                AddressList: []
            };
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PCFS = {
                AddressList: [],
                ContactList: []
            };
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.DCFS = {
                AddressList: []
            };

            loadAddressContactList()

        }

        function loadAddressContactList() {


            if (oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupTransportFK) {
                var _obj = {
                    "PK": oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupTransportFK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "Pickup", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "Pickup", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            }
            if (oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ExportReceivingCFS_FK) {
                var _obj = {
                    "PK": oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ExportReceivingCFS_FK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "PCFS", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "PCFS", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }
            if (oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryTransportFK) {
                var _obj = {
                    "PK": oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryTransportFK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "Delivery", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                // GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "Delivery", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            }
            if (oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ImportReleaseCFS_FK) {
                var _obj = {
                    "PK": oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ImportReleaseCFS_FK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "DCFS", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                // GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "DCFS", oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SelectedLookupData($item, type, addressType) {
            console.log($item, type, addressType)
            if (type === "address") {
                GetAddressContactList($item.data.entity, "OrgAddress", "AddressList", "PK", addressType, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
                GetAddressContactList($item.data.entity, "OrgContact", "ContactList", "PK", addressType, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            } else if (type === "Pickup") {
                GetAddressContactList($item.data.entity, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                GetAddressContactList($item.data.entity, "OrgContact", "ContactList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "Delivery") {
                GetAddressContactList($item.data.entity, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "PCFS") {
                GetAddressContactList($item.data.entity, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                GetAddressContactList($item.data.entity, "OrgContact", "ContactList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            } else if (type === "DCFS") {
                GetAddressContactList($item.data.entity, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }
        }

        function AutoCompleteOnSelect($item, type, addressType) {
            if (type === "address") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
                GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            } else if (type === "Pickup") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                GetAddressContactList($item, "OrgContact", "ContactList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "Delivery") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            } else if (type === "PCFS") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                GetAddressContactList($item, "OrgContact", "ContactList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            } else if (type === "DCFS") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
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
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnContactChange(selectedItem, addressType, type) {
            if (type === "address") {
                if (selectedItem) {
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    oneThreeShipmentPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }

        // ===================== Pickup Details Start =====================

        function InitPickup() {
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.Pickup = {};
        }

        // ===================== Pickup Details End =====================

        // ===================== Delivery Details Start =====================

        function InitDelivery() {
            oneThreeShipmentPickupAndDeliveryCtrl.ePage.Masters.Delivery = {};
        }

        // ===================== Delivery Details End =====================

        Init();
    }
})();