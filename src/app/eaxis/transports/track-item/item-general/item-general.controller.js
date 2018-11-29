(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ItemGeneralController", ItemGeneralController);

    ItemGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "itemConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "$uibModal"];

    function ItemGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, itemConfig, helperService, toastr, $injector, $window, confirmation, $uibModal) {

        var ItemGeneralCtrl = this;

        function Init() {

            var currentItem = ItemGeneralCtrl.currentItem[ItemGeneralCtrl.currentItem.label].ePage.Entities;

            ItemGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Item_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentItem,
            };

            ItemGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ItemGeneralCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            ItemGeneralCtrl.ePage.Masters.SelectedLookupReceiver = SelectedLookupReceiver;
            ItemGeneralCtrl.ePage.Masters.OtherAddresses = OtherAddresses;
            ItemGeneralCtrl.ePage.Masters.OnChangeReceiver = OnChangeReceiver;

            ItemGeneralCtrl.ePage.Masters.Config = itemConfig;
            ItemGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = false;

            ItemGeneralCtrl.ePage.Masters.selectedRow = 0;
            ItemGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            // DatePicker
            ItemGeneralCtrl.ePage.Masters.DatePicker = {};
            ItemGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ItemGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            ItemGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetDropDownList();
            generalOperation();
            GetNewItemAddress();
            // GetOrgSenderAddress();
            // GetOrgReceiverAddress();
            if (!ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderCode) {
                getOrgSender();
            } else {
                GetOrgSenderAddress();
                Orgheader();
            }
        }

        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        ItemGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                        ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = response.data.Response[0].ORG_Code;
                        ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = response.data.Response[0].ORG_FullName;
                        ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = response.data.Response[0].ROLE_FK;
                        ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderCode = response.data.Response[0].ORG_Code;
                        ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderName = response.data.Response[0].ORG_FullName;
                        ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Sender_ORG_FK = response.data.Response[0].ROLE_FK;
                        ItemGeneralCtrl.ePage.Masters.Sender = response.data.Response[0].ORG_Code + ' - ' + response.data.Response[0].ORG_FullName;
                        GetOrgSenderAddress();
                        Orgheader();
                    } else {
                        ItemGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        ItemGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                }
            });
        }

        function generalOperation() {
            // Sender
            if (ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderCode == null)
                ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderCode = "";
            if (ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderName == null)
                ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderName = "";
            ItemGeneralCtrl.ePage.Masters.Sender = ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderCode + ' - ' + ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.SenderName;
            if (ItemGeneralCtrl.ePage.Masters.Sender == " - ")
                ItemGeneralCtrl.ePage.Masters.Sender = "";
        }

        function SelectedLookupSender(item) {
            if (item.data) {
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.data.entity.Code;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.data.entity.FullName;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.data.entity.PK;
                ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Sender_ORG_FK = item.data.entity.PK;
                ItemGeneralCtrl.ePage.Masters.Sender = item.data.entity.Code + '-' + item.data.entity.FullName;

                angular.forEach(ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
                        value.ORG_FK = item.data.entity.PK;
                        value.OAD_Address_FK = item.data.entity.OAD_PK;
                        value.Address1 = item.data.entity.OAD_Address1;
                        value.Address2 = item.data.entity.OAD_Address2;
                        value.State = item.data.entity.OAD_State;
                        value.PostCode = item.data.entity.OAD_PostCode;
                        value.City = item.data.entity.OAD_City;
                        value.Email = item.data.entity.OAD_Email;
                        value.Mobile = item.data.entity.OAD_Mobile;
                        value.Phone = item.data.entity.OAD_Phone;
                        value.RN_NKCountryCode = item.data.entity.OAD_CountryCode;
                        value.Fax = item.data.entity.OAD_Fax;
                    }
                });
            }
            else {
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.Code;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.FullName;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.PK;
                ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Sender_ORG_FK = item.PK;
                ItemGeneralCtrl.ePage.Masters.Sender = item.Code + '-' + item.FullName;

                angular.forEach(ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
                        value.ORG_FK = item.PK;
                        value.OAD_Address_FK = item.OAD_PK;
                        value.Address1 = item.OAD_Address1;
                        value.Address2 = item.OAD_Address2;
                        value.State = item.OAD_State;
                        value.PostCode = item.OAD_PostCode;
                        value.City = item.OAD_City;
                        value.Email = item.OAD_Email;
                        value.Mobile = item.OAD_Mobile;
                        value.Phone = item.OAD_Phone;
                        value.RN_NKCountryCode = item.OAD_CountryCode;
                        value.Fax = item.OAD_Fax;
                    }
                });
            }
            GetOrgSenderAddress();
            Orgheader()
        }

        function SelectedLookupReceiver(item) {
            if (item.data) {
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = item.data.entity.Code;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = item.data.entity.FullName;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = item.data.entity.PK;
                ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Receiver_ORG_FK = item.data.entity.PK;

                angular.forEach(ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "REC") {
                        value.ORG_FK = item.data.entity.PK;
                        value.OAD_Address_FK = item.data.entity.OAD_PK;
                        value.Address1 = item.data.entity.OAD_Address1;
                        value.Address2 = item.data.entity.OAD_Address2;
                        value.State = item.data.entity.OAD_State;
                        value.PostCode = item.data.entity.OAD_PostCode;
                        value.City = item.data.entity.OAD_City;
                        value.Email = item.data.entity.OAD_Email;
                        value.Mobile = item.data.entity.OAD_Mobile;
                        value.Phone = item.data.entity.OAD_Phone;
                        value.RN_NKCountryCode = item.data.entity.OAD_CountryCode;
                        value.Fax = item.data.entity.OAD_Fax;
                    }
                });
            }
            else {
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = item.Code;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = item.FullName;
                ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = item.PK;
                ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Receiver_ORG_FK = item.PK;

                angular.forEach(ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "REC") {
                        value.ORG_FK = item.PK;
                        value.OAD_Address_FK = item.OAD_PK;
                        value.Address1 = item.OAD_Address1;
                        value.Address2 = item.OAD_Address2;
                        value.State = item.OAD_State;
                        value.PostCode = item.OAD_PostCode;
                        value.City = item.OAD_City;
                        value.Email = item.OAD_Email;
                        value.Mobile = item.OAD_Mobile;
                        value.Phone = item.OAD_Phone;
                        value.RN_NKCountryCode = item.OAD_CountryCode;
                        value.Fax = item.OAD_Fax;
                    }
                });
            }
            GetOrgReceiverAddress();
        }

        function GetOrgSenderAddress() {
            var _filter = {
                "ORG_FK": ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ItemGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ItemGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ItemGeneralCtrl.ePage.Masters.OrgSenderAddress = response.data.Response;

                    angular.forEach(ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.PostCode = response.data.Response[0].PostCode;
                            value.City = response.data.Response[0].City;
                            value.Email = response.data.Response[0].Email;
                            value.Mobile = response.data.Response[0].Mobile;
                            value.Phone = response.data.Response[0].Phone;
                            value.RN_NKCountryCode = response.data.Response[0].CountryCode;
                            value.Fax = response.data.Response[0].Fax;
                        }
                    });
                }
            });
        }

        function GetOrgReceiverAddress() {
            var _filter = {
                "ORG_FK": ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Receiver_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ItemGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ItemGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ItemGeneralCtrl.ePage.Masters.OrgReceiverAddress = response.data.Response;

                    angular.forEach(ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "REC") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.PostCode = response.data.Response[0].PostCode;
                            value.City = response.data.Response[0].City;
                            value.Email = response.data.Response[0].Email;
                            value.Mobile = response.data.Response[0].Mobile;
                            value.Phone = response.data.Response[0].Phone;
                            value.RN_NKCountryCode = response.data.Response[0].CountryCode;
                            value.Fax = response.data.Response[0].Fax;
                        }
                    });
                }
            });
        }

        function OtherAddresses(otheraddress, ClientType) {
            $uibModal.open({

                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/eaxis/transports/track-item/item-general/item-address/item-address.html',
                controller: 'ItemAddressController as ItemAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "JobAddress": ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress,
                            "otheraddress": otheraddress,
                            "ClientType": ClientType
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewItemAddress() {
            var myvalue = ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": ItemGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "SND",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": ItemGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "REC",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                ItemGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj1);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ItemGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["PickOption", "WMSYESNO"];
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
                        ItemGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ItemGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetReceiver() {
            if (ItemGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                ItemGeneralCtrl.ePage.Masters.MappingCode = "DC_DEPOT_STORE"
            } else {
                ItemGeneralCtrl.ePage.Masters.MappingCode = "SENDER_RECEIVER";
            }
            var _filter = {
                "MappingFor_FK": ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Sender_ORG_FK,
                "MappingCode": ItemGeneralCtrl.ePage.Masters.MappingCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ItemGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ItemGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ItemGeneralCtrl.ePage.Masters.ReceiverList = response.data.Response;
                }
            });
        }

        function Orgheader() {
            var _filter = {
                "Code": ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code,
                "FullName": ItemGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ItemGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ItemGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ItemGeneralCtrl.ePage.Masters.SenderDetail = response.data.Response[0];
                    ItemGeneralCtrl.ePage.Masters.SenderZone = response.data.Response[0].TMZ_Name;
                    ItemGeneralCtrl.ePage.Masters.SenderZoneFK = response.data.Response[0].TMZ_FK;
                    // if(!ItemGeneralCtrl.currentConsignment.isNew&&ItemGeneralCtrl.ePage.Masters.SenderZoneFK&&ItemGeneralCtrl.ePage.Masters.ReceiverZoneFK){
                    //     GetJourneyTitle()
                    // }   
                    GetReceiver()
                }
            });
        }

        function OnChangeReceiver(receiver) {
            angular.forEach(ItemGeneralCtrl.ePage.Masters.ReceiverList, function (value, key) {
                if (value.ORG_MappingToCode == receiver) {
                    ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.Receiver_ORG_FK = value.MappingTo_FK;
                    ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.ReceiverCode = value.ORG_MappingToCode;
                    ItemGeneralCtrl.ePage.Entities.Header.Data.TmsItemHeader.ReceiverName = value.ORG_MappingToName;
                    ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingTo_FK;
                    ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_MappingToCode;
                    ItemGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_MappingToName;
                    GetOrgReceiverAddress();
                }
            });
        }


        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ItemGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ItemGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ItemGeneralCtrl.currentItem.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ItemGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ItemGeneralCtrl.currentItem.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }




        Init();
    }

})();