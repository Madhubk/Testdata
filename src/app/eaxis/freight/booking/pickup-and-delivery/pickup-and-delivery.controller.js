(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingPickupAndDeliveryController", BookingPickupAndDeliveryController);

    BookingPickupAndDeliveryController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "BookingConfig", "helperService", "toastr"];

    function BookingPickupAndDeliveryController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, BookingConfig, helperService, toastr) {
        /* jshint validthis: true */
        var BookingPickupAndDeliveryCtrl = this;

        function Init() {
            var currentBooking = BookingPickupAndDeliveryCtrl.currentBooking[BookingPickupAndDeliveryCtrl.currentBooking.label].ePage.Entities;
            BookingPickupAndDeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_PickupAndDeliveryCtrl",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking
            };

            BookingPickupAndDeliveryCtrl.ePage.Masters.DropDownMasterList = BookingConfig.Entities.Header.Meta;

            // BookingPickupAndDeliveryCtrl.ePage.Masters.Address = {};
            // BookingPickupAndDeliveryCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            // BookingPickupAndDeliveryCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            // BookingPickupAndDeliveryCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            // BookingPickupAndDeliveryCtrl.ePage.Masters.OnContactChange = OnContactChange;
            BookingPickupAndDeliveryCtrl.ePage.Masters.Address = {};
            BookingPickupAndDeliveryCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            BookingPickupAndDeliveryCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            BookingPickupAndDeliveryCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            BookingPickupAndDeliveryCtrl.ePage.Masters.OnContactChange = OnContactChange;
            BookingPickupAndDeliveryCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            BookingPickupAndDeliveryCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;

            BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Pickup = {
                AddressList: [],
                ContactList: []
            };
            BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Delivery = {
                AddressList: []
            };

            BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Pickup = {
                AddressList: [],
                ContactList: []
            };
            BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.Delivery = {
                AddressList: []
            };
            BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PCFS = {
                AddressList: [],
                ContactList: []
            };
            BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.DCFS = {
                AddressList: []
            };

            loadAddressContactList()

        }

        function loadAddressContactList() {


            if (BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupTransportFK) {
                var _obj = {
                    "PK": BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupTransportFK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "Pickup", BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
                GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "Pickup", BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery);
            }
            if (BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ExportReceivingCFS_FK) {
                var _obj = {
                    "PK": BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ExportReceivingCFS_FK
                }
                GetAddressContactList(_obj, "OrgAddress", "AddressList", "PK", "PCFS", BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
                GetAddressContactList(_obj, "OrgContact", "ContactList", "PK", "PCFS", BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data.UIShipmentHeader);
            }
           

        }

        function SelectedLookupData($item, type, addressType, obj) {
            if (type === "address") {
                AddressContactList($item.entity, addressType, obj);
            }
        }

        function AutoCompleteOnSelect($item, type, addressType, obj) {
            if (type === "address") {
                AddressContactList($item, addressType, obj);
            }
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                str = $item.Address1 + " " + $item.Address2;;
                return str
            } else if ($item != undefined && type == "Contact") {
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str
            } else {
                return str
            }
        }

        function AddressContactList($item, addressType, obj) {
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data[obj]);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data[obj]);
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

        function OnAddressChange(selectedItem, model, addressType, type, mainObj) {
            BookingPickupAndDeliveryCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    if (model != 'OAD_Address_FK') {
                        var _tempObj = BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data[mainObj]
                    } else {
                        _tempObj = BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data[mainObj][addressType]
                    }
                    _tempObj[model] = selectedItem.PK
                    _tempObj.OAD_Code = selectedItem.Code;
                    _tempObj.CompanyName = selectedItem.CompanyNameOverride;
                    _tempObj.Address1 = selectedItem.Address1;
                    _tempObj.Address2 = selectedItem.Address2;
                    _tempObj.PostCode = selectedItem.PostCode;
                    _tempObj.City = selectedItem.City;
                    _tempObj.State = selectedItem.State;
                    _tempObj.Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnAddressEdit(selectedItem, model, addressType, type) {
            BookingPickupAndDeliveryCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, model, addressType, type, mainObj) {
            BookingPickupAndDeliveryCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    if (model != 'OCT_FK') {
                        var _tempObj = BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data[mainObj]
                    } else {
                        _tempObj = BookingPickupAndDeliveryCtrl.ePage.Entities.Header.Data[mainObj][addressType]
                    }
                    _tempObj[model] = selectedItem.PK;
                    _tempObj.ContactName = selectedItem.ContactName;
                    _tempObj.Phone = selectedItem.Phone;
                    _tempObj.Mobile = selectedItem.Mobile;
                    _tempObj.Email = selectedItem.Email;
                    _tempObj.Fax = selectedItem.Fax;
                    _tempObj.PhoneExtension = selectedItem.PhoneExtension;
                    _tempObj.HomePhone = selectedItem.HomePhone;
                    _tempObj.OtherPhone = selectedItem.OtherPhone;
                }
            }
        }


       

        Init();
    }
})();