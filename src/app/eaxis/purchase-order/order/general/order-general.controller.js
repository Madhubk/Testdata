(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdGeneralController", OrdGeneralController);

    OrdGeneralController.$inject = ["$rootScope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService"];

    function OrdGeneralController($rootScope, APP_CONSTANT, authService, apiService, appConfig, helperService) {

        var OrdGeneralCtrl = this;
        function Init() {
            var currentOrder = OrdGeneralCtrl.currentOrder[OrdGeneralCtrl.currentOrder.label].ePage.Entities;
            OrdGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_General",
                "Masters": {
                    "PorOrderLine": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentOrder,
            };

            InitOrderGerenral();
        }

        function InitOrderGerenral() {
            // DatePicker
            OrdGeneralCtrl.ePage.Masters.DatePicker = {};
            OrdGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitOrderDetails();
            InitPlanningDetails();
            InitContainer();
            InitCustom();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        //  ------------------ Start Order Details  -----------------------------
        function InitOrderDetails() {

            OrdGeneralCtrl.ePage.Masters.Address = {};
            OrdGeneralCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            OrdGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            OrdGeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            OrdGeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            OrdGeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            OrdGeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;

            if (OrdGeneralCtrl.currentOrder.isNew) {
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IncoTerm = "FOB";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.TransportMode = "SEA";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ContainerMode = "FCL";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderStatus = "PLC";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderDate = new Date();
            }

            GetCfxTypeList();
            GetCountryList();
            GetCurrencyList();
            GetServiceLevelList();
            GetAddressTypeList();
        }

        function SelectedLookupData($item, type, addressType) {
            if (type === "address") {
                AddressContactList($item.entity, addressType);
            }
        }

        function AutoCompleteOnSelect($item, type, addressType) {
            if (type === "address") {
                AddressContactList($item, addressType);
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

        function AddressContactList($item, addressType) {
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
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
            OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            OrdGeneralCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }
        
        function GetAddressTypeList() {
            var _filter = {
                "EntityRefKey": OrdGeneralCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "POH"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobAddress.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject = response.data.Response;

                    var _addressTypeList = OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject.CfxTypeList;
                    _addressTypeList.map(function (value, key) {
                        OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].AddressList = [];
                        OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].ContactList = [];
                    });

                } else {
                    console.log("Address type list empty response");
                }
            });
        }

        function GetCfxTypeList() {
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS","JOBADDR"];
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
                typeCodeList.map(function (value, key) {
                    OrdGeneralCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    OrdGeneralCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }

        function GetCountryList() {
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _input).then(function (response) {
                OrdGeneralCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
            });
        }

        function GetCurrencyList() {
            //Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                OrdGeneralCtrl.ePage.Entities.Header.Meta.Currency.ListSource = response.data.Response;
            });
        }

        function GetServiceLevelList() {
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                OrdGeneralCtrl.ePage.Entities.Header.Meta.ServiceLevel.ListSource = response.data.Response;
            });
        }

        // ----------------- Start Planning -------------------------

        function InitPlanningDetails() {
            GetPacksList();
            if (!OrdGeneralCtrl.currentOrder.isNew) {
                GetGoodsAddressList(OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Supplier_FK, 'GoodsAvailAt');
                GetGoodsAddressList(OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Buyer_FK, 'GoodsDeliveredTo');
                GetMainAddress(OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Supplier_FK, 'Supplier');
                GetMainAddress(OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Buyer_FK, 'Buyer');
            }
        }

        function GetPacksList() {
            // Get Packs
            var _inputPacks = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPacks).then(function (response) {
                OrdGeneralCtrl.ePage.Entities.Header.Meta.MstPackType.ListSource = response.data.Response;
            });
        }

        function GetGoodsAddressList(pk, obj) {
            var _filter = {
                ORG_FK: pk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                OrdGeneralCtrl.ePage.Entities.Header.Meta[obj].ListSource = response.data.Response;
            });
        }

        function GetMainAddress(pk, org) {
            var _filter = {
                ORG_FK: pk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.ORG_FK.map(function (val, key) {
                        val.AddressCapability.map(function (v, k) {
                            if (v.IsMainAddress && v.AddressType == 'OFC') {
                                OrdGeneralCtrl.ePage.Masters[org] = {};
                                OrdGeneralCtrl.ePage.Masters[org][org + 'Add'] = val.Address1 + ' ' + val.City + ' ' + val.State + ' ' + val.PostCode + ' ' + val.RelatedPortCode;
                            }
                        });
                    });
                }
            });
        }
        // ----------------------------------- Init Container-----------------------------------
        function InitContainer() {
            OrdGeneralCtrl.ePage.Masters.formView = {};
            OrdGeneralCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            OrdGeneralCtrl.ePage.Masters.AddNew = AddNew;
            OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New"
        }

        function SelectedGridRow(data, action, index) {
            if (action == 'edit') {
                OrdGeneralCtrl.ePage.Masters.formView = data;
                OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Update"
            } else {
                if (data.PK == undefined) {
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderContainer.splice(index, 1)
                } else {
                    var r = confirm("Are You Sure Want To Delete?");
                    if (r == true) {
                        apiService.get("eAxisAPI", OrdGeneralCtrl.ePage.Entities.Container.API.Delete.Url + data.PK).then(function (response) {
                            if (response.data.Status == 'Success') {
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderContainer.splice(index, 1)
                            }
                        });
                    }
                }
            }

        }

        function AddNew(item, action) {
            if (action == 'Add New') {
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderContainer.push(item);
                OrdGeneralCtrl.ePage.Masters.formView = {};
            } else {
                var _index = OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderContainer.indexOf(item);
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderContainer[_index] = item;
                OrdGeneralCtrl.ePage.Masters.formView = {};
                OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New"
            }
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            GetDynamicControl();
        }

        function GetDynamicControl() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "OrderHeaderCustom"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    OrdGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });

        }
      
        Init();

    }

})();