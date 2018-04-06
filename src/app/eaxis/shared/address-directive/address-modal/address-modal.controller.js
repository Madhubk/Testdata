(function () {
    "use strict";

    angular
        .module("Application")
        .controller("addressModalController", AddressModalController);

    AddressModalController.$inject = ["$scope", "$location", "$injector", "$uibModalInstance", "APP_CONSTANT", "apiService", "helperService", "toastr", "param", "appConfig", "$filter", "$q"];

    function AddressModalController($scope, $location, $injector, $uibModalInstance, APP_CONSTANT, apiService, helperService, toastr, param, appConfig, $filter, $q) {
        var AddressModalCtrl = this;

        function Init() {
            AddressModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            AddressModalCtrl.ePage.Masters.Address = {}
            AddressModalCtrl.ePage.Masters.Address.ReadOnlyView = {};
            AddressModalCtrl.ePage.Masters.Address.FormView = {};
            AddressModalCtrl.ePage.Masters.Address.FormView.ListSource = param.ListSource;
            AddressModalCtrl.ePage.Masters.Address.AddressContactObj = param.AddressContactObj;
            AddressModalCtrl.ePage.Masters.Address.AddressContactObject = param.AddressContactObject;
            AddressModalCtrl.ePage.Masters.EntitySource = param.EntitySource;
            AddressModalCtrl.ePage.Masters.Address.Header = param.Header;
            AddressModalCtrl.ePage.Masters.Address.ReadOnlyView = {};
            AddressModalCtrl.ePage.Masters.Address.FormView.AddressList = [];
            AddressModalCtrl.ePage.Masters.Address.FormView.ContactList = [];
            AddressModalCtrl.ePage.Masters.Address.StateListSource = [];
            AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
            // AddressModalCtrl.ePage.Masters.IsDisableSave = true;

            AddressModalCtrl.ePage.Masters.Address.OnAddressTypeMenuClick = OnAddressTypeMenuClick;
            AddressModalCtrl.ePage.Masters.Address.GetCurrentAddressContact = GetCurrentAddressContact;

            AddressModalCtrl.ePage.Masters.Address.SelectedLookupData = SelectedLookupData;
            AddressModalCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            AddressModalCtrl.ePage.Masters.Save = Save;
            AddressModalCtrl.ePage.Masters.Cancel = Cancel;
            AddressModalCtrl.ePage.Masters.Address.OnContactChange = OnContactChange;
            AddressModalCtrl.ePage.Masters.Address.OnCountryChange = OnCountryChange;
            AddressModalCtrl.ePage.Masters.Address.OnAddressChange = OnAddressChange;
            AddressModalCtrl.ePage.Masters.Address.AddressContactObj = AddressModalCtrl.ePage.Masters.Address.Header.Data.UIAddressContactList;
            AddressModalCtrl.ePage.Masters.Address.AddressTypeList = {};
            AddressModalCtrl.ePage.Masters.Address.AddressTypeList.ListSource = AddressModalCtrl.ePage.Masters.Address.Header.Data.UIAddressContactList.CfxTypeList;

            if (AddressModalCtrl.ePage.Masters.Address.Header.Data.UIAddressContactList.CfxTypeList) {
                if (AddressModalCtrl.ePage.Masters.Address.Header.Data.UIAddressContactList.CfxTypeList.length > 0) {
                    // Set default organization
                    AddressModalCtrl.ePage.Masters.Address.ActiveAddressTypeMenu = AddressModalCtrl.ePage.Masters.Address.Header.Data.UIAddressContactList.CfxTypeList[0];
                    OnAddressTypeMenuClick(AddressModalCtrl.ePage.Masters.Address.ActiveAddressTypeMenu);
                }
            }
        }

        function SelectedLookupData($item) {
            AddressContactList($item.entity);
        }

        function AutoCompleteOnSelect($item) {
            AddressContactList($item);
        }

        function AddressContactList($item) {
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK");
            GetAddressContactList($item, "OrgContact", "ContactList", "PK");
        }

        function OnAddressTypeMenuClick(curAddType) {
            AddressModalCtrl.ePage.Masters.Address.ActiveAddressTypeMenu = curAddType.Key;
            AddressModalCtrl.ePage.Masters.Address.ReadOnlyView = GetCurrentAddressContact(curAddType);
            AddressModalCtrl.ePage.Masters.Address.FormView.AddressType = AddressModalCtrl.ePage.Masters.Address.ReadOnlyView.AddressType;
        }

        function GetCurrentAddressContact(curAddType) {
            return AddressModalCtrl.ePage.Masters.Address.AddressContactObj[curAddType.Key];
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName) {
            AddressModalCtrl.ePage.Masters.Address.FormView.ListSource[listSource] = undefined;
            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AddressModalCtrl.ePage.Masters.Address.FormView.ListSource[listSource] = response.data.Response;
                    // AddressModalCtrl.ePage.Masters.IsDisableSave = false;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function OnAddressChange(selectedItem) {

            if (selectedItem) {
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.CompanyName = selectedItem.CompanyNameOverride;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Address1 = selectedItem.Address1;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Address2 = selectedItem.Address2;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.PostCode = selectedItem.PostCode;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.City = selectedItem.City;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OAD_Code = selectedItem.Code;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.State = selectedItem.State;
                console.log(selectedItem)
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Country = selectedItem.RelatedPortCode.substring(0, 2);
                SetDefaultCountry().then(function (response) {
                    // body...
                });

            }
        }

        function OnContactChange(selectedItem) {

            if (selectedItem) {
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Phone = selectedItem.Phone;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Mobile = selectedItem.Mobile;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Email = selectedItem.Email;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Fax = selectedItem.Fax;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.PhoneExtension = selectedItem.PhoneExtension;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.HomePhone = selectedItem.HomePhone;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OtherPhone = selectedItem.OtherPhone;
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ContactName = selectedItem.ContactName;
            }
        }

        function SetDefaultCountry() {
            AddressModalCtrl.ePage.Masters.Address.StateListSource = [];
            var deferred = $q.defer();
            if (AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Country) {
                var _obj = {
                    COU_Code: AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Country
                };
                OnCountryChange(_obj).then(function (response) {
                    deferred.resolve(response);
                });
            }
            return deferred.promise;
        }

        function OnCountryChange(curCountry) {
            var deferred = $q.defer();
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
                        AddressModalCtrl.ePage.Masters.Address.StateListSource = response.data.Response;
                        deferred.resolve(response);
                    }
                });
            } else {
                AddressModalCtrl.ePage.Masters.Address.StateListSource = [];
            }
            return deferred.promise;
        }

        // function Save() {
        //     // AddressModalCtrl.ePage.Masters.Address.IsEditMode = false;


        //     SaveAddress().then(function (response) {
        //         $uibModalInstance.close(response);
        //     });
        // }

        // function SaveAddress() {
        //     var deferred = $q.defer();
        //     if (AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.PK == "00000000-0000-0000-0000-000000000000") {
        //         var _inputJobAddress = {
        //             "AddressType": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressType,
        //             "OAD_Address_FK": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OAD_Address_FK,
        //             "Contact": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ContactName,
        //             "AddressOverride": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressOverride,
        //             "CompanyName": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.CompanyName,
        //             "Address1": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Address1,
        //             "Address2": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Address2,
        //             "City": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.City,
        //             "Postcode": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Postcode,
        //             "State": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.State,
        //             "RN_NKCountryCode": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Country,
        //             "Phone": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Phone,
        //             "Fax": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Fax,
        //             "Email": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Fax,
        //             "EntityRefKey": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.EntityRefKey,
        //             "EntitySource": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.EntitySource,
        //             "Mobile": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Mobile,
        //             "IsValid": true,
        //             "AddressSequence": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressSequence,
        //             "GovRegNum": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.GovRegNum,
        //             "IsResidential": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.IsResidential,
        //             "GovRegNumType": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.GovRegNumType,
        //             "ScreeningStatus": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ScreeningStatus,
        //             "ORG_FK": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ORG_FK,
        //             "OCT_FK": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OCT_FK,
        //             "ORG_Code": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ORG_Code,
        //             "OAD_Code": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OAD_Code,
        //             "PhoneExtension": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.PhoneExtension,
        //             "HomePhone": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.HomePhone,
        //             "OtherPhone": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OtherPhone
        //         }
        //         apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.Insert.Url, [_inputJobAddress]).then(function (response) {

        //             if (response.data.Response) {
        //                 AddressModalCtrl.ePage.Masters.Address.AddressContactObject[response.data.Response[0].AddressType] = response.data.Response[0];
        //                 toastr.success("Saved successfully...!");
        //                 AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
        //                 AddressModalCtrl.ePage.Masters.Address.AddressDetails = response.data.Response[0];
        //                 deferred.resolve(AddressModalCtrl.ePage.Masters.Address.AddressDetails);
        //             } else {
        //                 toastr.error("Saved failed...!");
        //                 AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
        //             }
        //         });
        //     } else {
        //         var _inputJobAddressUpdate = {
        //             "PK": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.PK,
        //             "AddressType": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressType,
        //             "OAD_Address_FK": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OAD_Address_FK,
        //             "Contact": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ContactName,
        //             "AddressOverride": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressOverride,
        //             "CompanyName": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.CompanyName,
        //             "Address1": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Address1,
        //             "Address2": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Address2,
        //             "City": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.City,
        //             "Postcode": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Postcode,
        //             "State": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.State,
        //             "RN_NKCountryCode": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Country,
        //             "Phone": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Phone,
        //             "Fax": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Fax,
        //             "Email": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Fax,
        //             "EntityRefKey": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.EntityRefKey,
        //             "EntitySource": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.EntitySource,
        //             "Mobile": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.Mobile,
        //             "IsValid": true,
        //             "AddressSequence": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressSequence,
        //             "GovRegNum": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.GovRegNum,
        //             "IsResidential": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.IsResidential,
        //             "GovRegNumType": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.GovRegNumType,
        //             "ScreeningStatus": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ScreeningStatus,
        //             "ORG_FK": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ORG_FK,
        //             "OCT_FK": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OCT_FK,
        //             "ORG_Code": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.ORG_Code,
        //             "OAD_Code": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OAD_Code,
        //             "PhoneExtension": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.PhoneExtension,
        //             "HomePhone": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.HomePhone,
        //             "OtherPhone": AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.OtherPhone,
        //             "IsModified": true
        //         }
        //         apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.Update.Url, _inputJobAddressUpdate).then(function (response) {
        //             if (response.data.Response) {
        //                 AddressModalCtrl.ePage.Masters.Address.AddressContactObject[response.data.Response.AddressType] = response.data.Response;
        //                 toastr.success("Saved successfully...!");
        //                 AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
        //                 AddressModalCtrl.ePage.Masters.Address.AddressDetails = response.data.Response;
        //                 deferred.resolve(AddressModalCtrl.ePage.Masters.Address.AddressDetails);
        //             } else {
        //                 toastr.error("Saved failed...!");
        //                 AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
        //             }
        //         });
        //     }
        //     return deferred.promise;
        // }

        function Save() {
            AddressModalCtrl.ePage.Masters.SaveButtonText = "Please wait";
            AddressModalCtrl.ePage.Masters.Address.AddressContactObj[AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressType] = AddressModalCtrl.ePage.Masters.Address.FormView.ListSource;
            AddressModalCtrl.ePage.Masters.Address.AddressContactObj[AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressType].IsModified = true;
            AddressModalCtrl.ePage.Masters.Address.ActiveAddressTypeMenu = AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.AddressType;
            AddressModalCtrl.ePage.Masters.Address.ReadOnlyView = AddressModalCtrl.ePage.Masters.Address.FormView.ListSource;
            AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.EntityRefKey = AddressModalCtrl.ePage.Masters.Address.Header.Data.PK;
            AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.EntitySource = AddressModalCtrl.ePage.Masters.EntitySource.replace(/["'']/g, "");
            if (AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.PK == "00000000-0000-0000-0000-000000000000") {
                apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.Insert.Url, [AddressModalCtrl.ePage.Masters.Address.FormView.ListSource]).then(function (response) {

                    if (response.data.Response) {
                        AddressModalCtrl.ePage.Masters.Address.AddressContactObject[response.data.Response[0].AddressType] = response.data.Response[0];
                        $uibModalInstance.close(response.data.Response[0]);
                    }
                });
            } else {
                AddressModalCtrl.ePage.Masters.Address.FormView.ListSource.IsModified = true;
                apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.Update.Url, AddressModalCtrl.ePage.Masters.Address.FormView.ListSource).then(function (response) {
                    if (response.data.Response) {
                        AddressModalCtrl.ePage.Masters.Address.AddressContactObject[response.data.Response.AddressType] = response.data.Response;
                        $uibModalInstance.close(response.data.Response);
                    }
                });
            }


        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();