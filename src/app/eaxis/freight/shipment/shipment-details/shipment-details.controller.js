(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentDetailsController", ShipmentDetailsController);

    ShipmentDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function ShipmentDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var ShipmentDetailsCtrl = this;


        function Init() {
            ShipmentDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General_Details",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                },
            };
            ShipmentDetailsCtrl.ePage.Masters.Address = {};
            ShipmentDetailsCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            ShipmentDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ShipmentDetailsCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            ShipmentDetailsCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            ShipmentDetailsCtrl.ePage.Masters.OnContactChange = OnContactChange;
            ShipmentDetailsCtrl.ePage.Masters.readonly = true;

            ShipmentEntityInit();
        }

        function ShipmentEntityInit() {
            ShipmentDetailsCtrl.ePage.Masters.ShipmentEntityObj = ShipmentDetailsCtrl.currentObj;
            ShipmentDetailsCtrl.ePage.Entities.Header.Data = ShipmentDetailsCtrl.currentObj;

            if (ShipmentDetailsCtrl.ePage.Masters.ShipmentEntityObj) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ShipmentDetailsCtrl.ePage.Masters.ShipmentEntityObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ShipmentDetailsCtrl.ePage.Entities.Header.Data = response.data.Response;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            ShipmentDetailsCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function SelectedLookupData($item, type, addressType, addressType1) {
            if (type === "address") {
                AddressContactList($item.data.entity, addressType, addressType1);
            }
            if (addressType == 'CRD') {
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.data.entity.OAD_RelatedPortCode
                // ShipmentDetailsCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', ShipmentDetailsCtrl.currentShipment.code, ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code, 'E0031', false)

            }
            if (addressType == 'CED') {
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.data.entity.OAD_RelatedPortCode
                // ShipmentDetailsCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', ShipmentDetailsCtrl.currentShipment.code, ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code, 'E0032', false)

            }

            getMDMDefaulvalues()
        }

        function AutoCompleteOnSelect($item, type, addressType, addressType1) {
            if (type === "address") {
                AddressContactList($item, addressType, addressType1);
            }
            if (addressType == 'CRD') {
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.OAD_RelatedPortCode
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
                // ShipmentDetailsCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', ShipmentDetailsCtrl.currentShipment.code, ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code, 'E0031', false)

            }
            if (addressType == 'CED') {
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.OAD_RelatedPortCode
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.PK
                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.Code
                // ShipmentDetailsCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', ShipmentDetailsCtrl.currentShipment.code, ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code, 'E0032', false)
            }
            getMDMDefaulvalues();
        }
        function AddressContactList($item, addressType, addressType1) {
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
            // main address list find
            AddressList.then(function (value) {
                value.map(function (val, key) {
                    var IsMain = val.AddressCapability.some(function (valu, key) {
                        return valu.IsMainAddress == true;
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
                str = $item.Address1 + " " + $item.Address2;;
                return str
            } else if ($item != undefined && type == "Contact") {
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str
            } else {
                return str
            }
        }
        function OnAddressChange(selectedItem, addressType, type, addressType1) {
            ShipmentDetailsCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    if (addressType1) {
                        ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType1] = ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType];
                    }
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            ShipmentDetailsCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            ShipmentDetailsCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }
        function getMDMDefaulvalues() {
            if (ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code && ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK + '/' + ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                if (ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode) {
                                    var obj = _.filter(ShipmentDetailsCtrl.ePage.Masters.CfxTypesList.CntType, {
                                        'Key': ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                                    })[0];
                                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                } else {
                                    var obj = _.filter(ShipmentDetailsCtrl.ePage.Masters.CfxTypesList.CntType, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                }
                                ShipmentDetailsCtrl.ePage.Masters.selectedMode = obj;
                                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKGoodsValueCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency
                                ShipmentDetailsCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKInsuranceCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency
                            }
                        }
                    }
                });
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

        Init();
    }
})();