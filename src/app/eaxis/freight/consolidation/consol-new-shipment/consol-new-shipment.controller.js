(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolcreateshipmentModalController", ConsolcreateshipmentModalController);

    ConsolcreateshipmentModalController.$inject = ["$rootScope", "$scope", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "param", "confirmation", "$uibModalInstance"];

    function ConsolcreateshipmentModalController($rootScope, $scope, $uibModal, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, param, confirmation, $uibModalInstance) {
        var ConsolcreateshipmentModalCtrl = this;

        function Init() {
            ConsolcreateshipmentModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_New_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": param.newshipment.Response
                    }
                }
            };
            ConsolcreateshipmentModalCtrl.ePage.Masters.SaveButton = 'Save';
            ConsolcreateshipmentModalCtrl.ePage.Masters.Cancel = Cancel;
            ConsolcreateshipmentModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            ConsolcreateshipmentModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ConsolcreateshipmentModalCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            ConsolcreateshipmentModalCtrl.ePage.Masters.OnContactChange = OnContactChange;
            ConsolcreateshipmentModalCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            ConsolcreateshipmentModalCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            ConsolcreateshipmentModalCtrl.ePage.Masters.Save = Save;
            ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable = true;
            ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable1 = true;
            ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable2 = true;
            ConsolcreateshipmentModalCtrl.ePage.Masters.IsDisabled = false;
        }

        function Save() {
            ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK = ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.PK;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Insert.Url, ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Status == "Success") {
                        updaterecord();
                    }
                }
                else {
                    ConsolcreateshipmentModalCtrl.ePage.Masters.IsDisabled = false;
                }
            });
        }

        function updaterecord() {
            var _tempArray = [];
            var _input = {
                "PK": "",
                "CON_FK": param.conpk,
                "SHP_FK": ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.PK
            }
            _tempArray.push(_input);
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.Insert.Url, _tempArray).then(function (response) {
                if (response.data.Response) {
                    $uibModalInstance.close(param)

                }
            });
        }

        function AutoCompleteOnSelect($item, type, type1, addressType, addressType1) {
            if ($item.Code != null) {
                if (type === "address") {
                    AddressContactList($item, addressType, addressType1);
                }
                if (type1 === "contact") {
                    AddressContactList($item, addressType, addressType1);
                }
                if (addressType == 'CRD') {
                    ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable = true;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.OAD_RelatedPortCode
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
                    // getOrgBuyerSupplierMapping();
                }
                if (addressType == 'CED') {
                    ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable1 = true;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.OAD_RelatedPortCode
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.PK
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.Code
                }
                if (addressType == 'NPP') {
                    ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable2 = true;
                }
                // getMDMDefaulvalues()
            }
        }
        function AddressContactList($item, addressType, addressType1) {
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
            // main address list find
            AddressList.then(function (value) {
                value.map(function (val, key) {
                    var IsMain = val.AddressCapability.some(function (value, key) {
                        return value.IsMainAddress == true;
                    });
                    if (IsMain) {
                        OnAddressChange(val, addressType, "Address", addressType1);
                    }
                });
            });
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                // if ($item.Address1 == null || $item.Address1 == undefined) {
                //     $item.Address1 = "";
                // }
                // if ($item.Address2 == undefined || $item.Address2 == undefined) {
                //     $item.Address2 = "";
                // }
                // if ($item.Address1 && $item.Address2) {
                str = $item.Address1 + " " + $item.Address2;;
                return str
                // }
            }
            else if ($item != undefined && type == "contact") {
                str = $item.CompanyNameOverride + " " + $item.Email + " " + $item.Phone;
                return str
            } else if ($item != undefined && type == "Contact") {
                // if ($item.ContactName == undefined || $item.ContactName == null) {
                //     $item.ContactName = "";
                // }
                // if ($item.Email == undefined || $item.Email == null) {
                //     $item.Email = "";
                // }
                // if ($item.Phone == null || $item.Phone == undefined) {
                //     $item.Phone = "";
                // }
                // if ($item.Phone && $item.Email && $item.ContactName) {
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str
                // }
            }
            else {
                return str
            }
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, addressType, obj, addressType1) {
            obj[addressType][listSource] = undefined;
            obj[addressType].IsModified = true;
            if (addressType1) {
                obj[addressType1][listSource] = undefined;
                obj[addressType1].IsModified = true;
            }

            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            return apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                    if (addressType1) {
                        obj[addressType1][listSource] = response.data.Response;
                    }
                    return response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function OnAddressChange(selectedItem, addressType, type, addressType1) {
            ConsolcreateshipmentModalCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    if (addressType1) {
                        ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType1] = ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType];
                    }
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            ConsolcreateshipmentModalCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            ConsolcreateshipmentModalCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                    if (addressType == 'CRD') {
                        ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable = false;
                    }
                    if (addressType == 'CED') {
                        ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable1 = false;
                    }
                    if (addressType == 'NPP') {
                        ConsolcreateshipmentModalCtrl.ePage.Masters.IsContactEnable2 = false;
                    }

                }
            }
        }

        function SelectedLookupData($item, type, type1, addressType, addressType1, code) {
            // OnFieldValueChange(code);
            if (type == "address") {
                AddressContactList($item.data.entity, addressType, addressType1);
            }
            if (type1 == "contact") {
                AddressContactList($item.data.entity, addressType, addressType1);
            }
            if (addressType == 'CRD') {
                ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.data.entity.OAD_RelatedPortCode
                // OnFieldValueChange('E0031');
            }
            if (addressType == 'CED') {
                ConsolcreateshipmentModalCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.data.entity.OAD_RelatedPortCode

                // OnFieldValueChange('E0032');
            }
            // getMDMDefaulvalues()
        }

        function Cancel() {
            $uibModalInstance.dismiss('close')
        }

        Init();
    }
})();