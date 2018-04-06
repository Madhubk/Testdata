(function () {
    "use strict";

    angular
        .module("Application")
        .controller("addressDirectiveController", addressDirectiveController);

    addressDirectiveController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "$uibModal", "$window", "appConfig", "$filter"];

    function addressDirectiveController($rootScope, $scope, state, $timeout, $location, $q, APP_CONSTANT, authService, apiService, helperService, toastr, $uibModal, $window, appConfig, $filter) {
        var addressDirectiveCtrl = this;

        function Init() {
            var currentObj = addressDirectiveCtrl.currentObj[addressDirectiveCtrl.currentObj.label].ePage.Entities;
            addressDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Address_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };

            addressDirectiveCtrl.ePage.Masters.EntitySource = addressDirectiveCtrl.entitysource;
            addressDirectiveCtrl.ePage.Masters.Address = {}
            addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView = {};
            addressDirectiveCtrl.ePage.Masters.Address.FormView = {};
            addressDirectiveCtrl.ePage.Masters.Address.FormView.AddressList = [];
            addressDirectiveCtrl.ePage.Masters.Address.FormView.ContactList = [];
            addressDirectiveCtrl.ePage.Masters.Address.StateListSource = [];

            addressDirectiveCtrl.ePage.Masters.Address.OnAddressTypeMenuClick = OnAddressTypeMenuClick;
            addressDirectiveCtrl.ePage.Masters.Address.GetCurrentAddressContact = GetCurrentAddressContact;
            /*addressDirectiveCtrl.ePage.Masters.Address.SelectedLookupData = SelectedLookupData;

            addressDirectiveCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            addressDirectiveCtrl.ePage.Masters.Address.OnAddressChange = OnAddressChange;
            addressDirectiveCtrl.ePage.Masters.Address.OnContactChange = OnContactChange;
            addressDirectiveCtrl.ePage.Masters.Address.OnCountryChange = OnCountryChange;
            addressDirectiveCtrl.ePage.Masters.Address.OnBackClick = OnBackClick;
            addressDirectiveCtrl.ePage.Masters.Address.OnDoneClick = OnDoneClick;
            addressDirectiveCtrl.ePage.Masters.Address.SaveAddress = SaveAddress;*/
            addressDirectiveCtrl.ePage.Masters.Address.OnEditAddress = OnEditAddress;
            $rootScope.OnAddressEditNavType = OnAddressEditNavType


            addressDirectiveCtrl.ePage.Masters.Address.IsEdit = false;
            addressDirectiveCtrl.ePage.Masters.Address.IsEditMode = false;

            addressDirectiveCtrl.ePage.Masters.Address.AddressContactObj = addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList;
            addressDirectiveCtrl.ePage.Masters.Address.AddressTypeList = {};
            addressDirectiveCtrl.ePage.Masters.Address.AddressTypeList.ListSource = addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CfxTypeList;

            // if (addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CfxTypeList) {
            //     if (addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CfxTypeList.length > 0) {
            //         // Set default organization
            //         addressDirectiveCtrl.ePage.Masters.Address.ActiveAddressTypeMenu = addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CfxTypeList[0];
            //         OnAddressTypeMenuClick(addressDirectiveCtrl.ePage.Masters.Address.ActiveAddressTypeMenu);
            //     }
            // }
        }

        function OnAddressEditNavType(selectedItem, addressType, type) {
            addressDirectiveCtrl.ePage.Masters.Address.IsAddress = true;
            addressDirectiveCtrl.ePage.Masters.Address.ActiveAddressTypeMenu = addressType;
            addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView = GetCurrentAddressContacts(addressDirectiveCtrl.ePage.Masters.Address.ActiveAddressTypeMenu);
            addressDirectiveCtrl.ePage.Masters.Address.FormView.AddressType = addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView.AddressType;
            OnEditAddress()
        }

        function OnAddressTypeMenuClick(curAddType) {
            addressDirectiveCtrl.ePage.Masters.Address.IsAddress = false;
            addressDirectiveCtrl.ePage.Masters.Address.ActiveAddressTypeMenu = curAddType.Key;
            addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView = GetCurrentAddressContact(curAddType);
            addressDirectiveCtrl.ePage.Masters.Address.FormView.AddressType = addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView.AddressType;
            OnEditAddress()
        }

        /*function OnBackClick() {
            addressDirectiveCtrl.ePage.Masters.Address.IsEditMode = false;
        }

        function OnDoneClick() {
            addressDirectiveCtrl.ePage.Masters.Address.IsEditMode = false;
            addressDirectiveCtrl.ePage.Masters.Address.AddressContactObj[addressDirectiveCtrl.ePage.Masters.Address.FormView.AddressType] = addressDirectiveCtrl.ePage.Masters.Address.FormView;
            addressDirectiveCtrl.ePage.Masters.Address.AddressContactObj[addressDirectiveCtrl.ePage.Masters.Address.FormView.AddressType].IsModified = true;
            addressDirectiveCtrl.ePage.Masters.Address.ActiveAddressTypeMenu = addressDirectiveCtrl.ePage.Masters.Address.FormView.AddressType;
            addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView = addressDirectiveCtrl.ePage.Masters.Address.FormView;

            SaveAddress();
        }*/

        function OnEditAddress() {
            /* addressDirectiveCtrl.ePage.Masters.Address.IsEditMode = true;
             if (AddressModalCtrl.ePage.Masters.Address.FormView.ORG_FK) {
                GetAddressContactList(AddressModalCtrl.ePage.Masters.Address.FormView.ListSource, "OrgAddress", "AddressList", "ORG_FK");
                GetAddressContactList(AddressModalCtrl.ePage.Masters.Address.FormView.ListSource, "OrgContact", "ContactList", "ORG_FK");
            }*/

            addressDirectiveCtrl.ePage.Masters.Address.FormView = angular.copy(addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView);
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "address-modal",
                scope: $scope,
                templateUrl: "app/eAxis/shared/address-directive/address-modal/address-modal.html",
                controller: 'addressModalController',
                controllerAs: "AddressModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "ListSource": addressDirectiveCtrl.ePage.Masters.Address.FormView,
                            "AddressContactObj": addressDirectiveCtrl.ePage.Masters.Address.AddressContactObj,
                            "EntitySource": addressDirectiveCtrl.ePage.Masters.EntitySource,
                            "Header": addressDirectiveCtrl.ePage.Entities.Header,
                            "AddressContactObject": addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    // body

                    addressDirectiveCtrl.ePage.Masters.Address.IsEditMode = false
                    addressDirectiveCtrl.ePage.Masters.Address.ReadOnlyView = response;
                    if (addressDirectiveCtrl.ePage.Masters.Address.IsAddress) {
                        $rootScope.OnAddressEditBack();
                        addressDirectiveCtrl.ePage.Masters.Address.IsAddress = false
                    }

                    // SaveAddress()
                },
                function () {
                    addressDirectiveCtrl.ePage.Masters.Address.IsEditMode = false;
                    console.log("Cancelled");
                    if (addressDirectiveCtrl.ePage.Masters.Address.IsAddress) {
                        $rootScope.OnAddressEditBack();
                        addressDirectiveCtrl.ePage.Masters.Address.IsAddress = false
                    }
                }

            );
        }

        function GetCurrentAddressContact(curAddType) {
            return addressDirectiveCtrl.ePage.Masters.Address.AddressContactObj[curAddType.Key];
        }

        function GetCurrentAddressContacts(curAddType) {
            return addressDirectiveCtrl.ePage.Masters.Address.AddressContactObj[curAddType];
        }

        /*function SelectedLookupData($item) {
            GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK");
            GetAddressContactList($item.entity, "OrgContact", "ContactList", "PK");
        }

        function AutoCompleteOnSelect($item) {
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK");
            GetAddressContactList($item, "OrgContact", "ContactList", "PK");
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName) {
            addressDirectiveCtrl.ePage.Masters.Address.FormView[listSource] = undefined;
            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    addressDirectiveCtrl.ePage.Masters.Address.FormView[listSource] = response.data.Response
                } else {
                    console.log("Empty Response");
                }
            });
        } 

        function OnAddressChange(selectedItem) {
            if (selectedItem) {
                addressDirectiveCtrl.ePage.Masters.Address.FormView.CompanyName = selectedItem.CompanyNameOverride;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.Address1 = selectedItem.Address1;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.Address2 = selectedItem.Address2;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.PostCode = selectedItem.PostCode;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.City = selectedItem.City;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.OAD_Code = selectedItem.Code;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.State = selectedItem.State;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.Country = selectedItem.RelatedPortCode.substring(0, 2);
            }
        }

        function OnContactChange(selectedItem) {
            if (selectedItem) {
                addressDirectiveCtrl.ePage.Masters.Address.FormView.Phone = selectedItem.Phone;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.Mobile = selectedItem.Mobile;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.Email = selectedItem.Email;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.Fax = selectedItem.Fax;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.PhoneExtension = selectedItem.PhoneExtension;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.HomePhone = selectedItem.HomePhone;
                addressDirectiveCtrl.ePage.Masters.Address.FormView.OtherPhone = selectedItem.OtherPhone;
            }
        }

        function OnCountryChange(curCountry) {
            if (curCountry) {
                var _filter = {
                    "CountryCode": curCountry.COU_Code
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.CountryState.API.FindAll.FilterID,
                };

                apiService.post("eAxisAPI", appConfig.Entities.CountryState.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        addressDirectiveCtrl.ePage.Masters.Address.StateListSource = response.data.Response;
                    }
                });
            } else {
                addressDirectiveCtrl.ePage.Masters.Address.StateListSource = [];
            }
        }

        function SetDefaultCountry() {
            addressDirectiveCtrl.ePage.Masters.Address.StateListSource = [];

            if (addressDirectiveCtrl.ePage.Masters.Address.FormView.Country) {
                var _obj = {
                    COU_Code: addressDirectiveCtrl.ePage.Masters.Address.FormView.Country
                };
                OnCountryChange(_obj);
            }
        } 

        function SaveAddress() {
            addressDirectiveCtrl.ePage.Masters.Address.FormView.EntityRefKey = addressDirectiveCtrl.ePage.Entities.Header.Data.PK;
            addressDirectiveCtrl.ePage.Masters.Address.FormView.EntitySource = addressDirectiveCtrl.ePage.Masters.EntitySource;
            if (addressDirectiveCtrl.ePage.Masters.Address.FormView.PK == "00000000-0000-0000-0000-000000000000") {
                apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.Insert.Url, [addressDirectiveCtrl.ePage.Masters.Address.FormView]).then(function (response) {

                    if (response.data.Response) {
                        addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[response.data.Response[0].AddressType] = response.data.Response[0];
                    }
                });
            } else {
                apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.Update.Url, addressDirectiveCtrl.ePage.Masters.Address.FormView).then(function (response) {
                    if (response.data.Response) {
                        addressDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[response.data.Response.AddressType] = response.data.Response;
                    }
                });
            }


        }*/
        Init();
    }
})();