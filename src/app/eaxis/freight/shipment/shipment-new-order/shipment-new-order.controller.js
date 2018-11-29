(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentcreateorderModalController", ShipmentcreateorderModalController);

    ShipmentcreateorderModalController.$inject = ["$scope", "apiService", "helperService", "appConfig", "$uibModalInstance", "param", "APP_CONSTANT", "shipmentConfig"];

    function ShipmentcreateorderModalController($scope, apiService, helperService, appConfig, $uibModalInstance, param, APP_CONSTANT, shipmentConfig) {
        var ShipmentcreateorderModalCtrl = this;

        function Init() {
            ShipmentcreateorderModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Order",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": param.neworder.Response
                    }
                }
            };
            ShipmentcreateorderModalCtrl.ePage.Masters.SaveButton = 'Save';
            ShipmentcreateorderModalCtrl.ePage.Masters.IsDisabled = false;
            ShipmentcreateorderModalCtrl.ePage.Masters.Cancel = Cancel;
            ShipmentcreateorderModalCtrl.ePage.Masters.Save = Save;
            ShipmentcreateorderModalCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            ShipmentcreateorderModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ShipmentcreateorderModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            ShipmentcreateorderModalCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            ShipmentcreateorderModalCtrl.ePage.Masters.OnContactChange = OnContactChange;
            ShipmentcreateorderModalCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            //DatePicker
            ShipmentcreateorderModalCtrl.ePage.Masters.DatePicker = {};
            ShipmentcreateorderModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ShipmentcreateorderModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            ShipmentcreateorderModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function Save() {
            ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK = ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.PK;
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.insert.Url, ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    ShipmentcreateorderModalCtrl.ePage.Masters.IsDisabled = true;
                    UpdateRecords();
                }
                else {
                    ShipmentcreateorderModalCtrl.ePage.Masters.IsDisabled = false;
                }
            });
        }

        function UpdateRecords() {
            var _tempArray = [];
            var _input = {
                "EntityRefPK": ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK,
                "Properties": [{
                    "PropertyName": "POH_SHP_FK",
                    "PropertyNewValue": param.shpobj.POH_SHP_FK
                }, {
                    "PropertyName": "POH_ShipmentNo",
                    "PropertyNewValue": param.shpobj.POH_ShipmentNo
                }]
            }
            _tempArray.push(_input);
            apiService.post('eAxisAPI', param.ShipmentOrder.API.OrderAttach.Url, _tempArray).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Status == "Success") {
                        $uibModalInstance.close(param)
                    }
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ShipmentcreateorderModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            ShipmentcreateorderModalCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "OrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer
                };
            } else {
                var _filter = {
                    DataEntryName: "OrderHeaderCustom"
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    ShipmentcreateorderModalCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });
        }

        function SelectedLookupData($item, type, addressType) {
            switch (addressType) {
                case "SCP":
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer = $item.data.entity.Code;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK = $item.data.entity.PK;
                    // ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OrderCurrency = $item.data.entity.OAD_CountryCode;
                    // CommonErrorObjInput("Order", ShipmentcreateorderModalCtrl.currentOrder, "ORD", "ORD", ["E1002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Supplier = $item.data.entity.Code;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Supplier_FK = $item.data.entity.PK;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OriginCountry = $item.data.entity.OAD_CountryCode;
                    // CommonErrorObjInput("Order", ShipmentcreateorderModalCtrl.currentOrder, "ORD", "ORD", ["E1003"]);
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item.data.entity, addressType);
                    // CheckOrderNo(ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data);
                    break;
                default:
                    break;
            }
        }

        function AutoCompleteOnSelect($item, type, addressType) {
            switch (addressType) {
                case "SCP":
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer = $item.Code;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK = $item.PK;
                    // ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OrderCurrency = $item.data.entity.OAD_CountryCode;
                    // CommonErrorObjInput("Order", ShipmentcreateorderModalCtrl.currentOrder, "ORD", "ORD", ["E1002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Supplier = $item.Code;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Supplier_FK = $item.PK;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OriginCountry = $item.OAD_CountryCode;
                    // CommonErrorObjInput("Order", ShipmentcreateorderModalCtrl.currentOrder, "ORD", "ORD", ["E1003"]);
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item, addressType);
                    // CheckOrderNo(ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data);
                    break;
                default:
                    break;
            }
        }

        function AddressContactList($item, addressType) {
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            var ContactList = GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            // AutoPopulate();
            // default main address list find
            AddressList.then(function (value) {
                value.map(function (val, key) {
                    var IsMain = val.AddressCapability.some(function (valu, key) {
                        return valu.IsMainAddress == true;
                    });
                    if (IsMain) {
                        OnAddressChange(val, addressType, "Address");
                    }
                });
                // Org based POL, POD, Origin and destination auto-populate function
                // OrgAddressBaseFields(value[0], addressType);
            });
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

            return apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                    return response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                (!$item.Address1) ? $item.Address1 = "" : false;
                (!$item.Address2) ? $item.Address2 = "" : false;
                str = $item.Address1 + " " + $item.Address2;
                return str;
            } else if ($item != undefined && type == "Contact") {
                (!$item.Email) ? $item.Email = "" : false;
                (!$item.ContactName) ? $item.ContactName = "" : false;
                (!$item.Phone) ? $item.Phone = "" : false;
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str;
            } else {
                return str;
            }
        }

        function OnAddressChange(selectedItem, addressType, type) {
            ShipmentcreateorderModalCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false;
            if (type === "Address") {
                if (selectedItem) {
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    // Org based POL, POD, Origin and destination auto-populate function
                    // OrgAddressBaseFields(selectedItem, addressType);
                }
            }
        }

        function OnContactChange(selectedItem, addressType, type) {
            ShipmentcreateorderModalCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    ShipmentcreateorderModalCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            ShipmentcreateorderModalCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function Cancel() {
            $uibModalInstance.dismiss('close')
        }

        Init();
    }
})();