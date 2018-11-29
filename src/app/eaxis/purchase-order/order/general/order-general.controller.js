(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdGeneralController", OrdGeneralController);

    OrdGeneralController.$inject = ["$rootScope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "orderConfig", "toastr", "errorWarningService"];

    function OrdGeneralController($rootScope, APP_CONSTANT, authService, apiService, appConfig, helperService, orderConfig, toastr, errorWarningService) {

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
            OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Order.Entity[OrdGeneralCtrl.currentOrder.code].GlobalErrorWarningList;
            OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Order.Entity[OrdGeneralCtrl.currentOrder.code];
            // DatePicker
            OrdGeneralCtrl.ePage.Masters.DatePicker = {};
            OrdGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrdGeneralCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

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

        function OnChangeDatePicker(type) {
            switch (type) {
                case "RequiredExWorksDate":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1022', 'E1023']);
                    break;
                case "EstimatedInStoreDate":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1022', 'E1023']);
                    break;
                case "EstimatedDepartureDate":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1025', 'E1024', 'E1027', 'E1026']);
                    break;
                case "EstimatedArrivalDate":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1028', 'E1026']);
                    break;
                case "ArrivalIntermediateDate1":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1030', 'E1031']);
                    break;
                case "ArrivalIntermediateDate2":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1030', 'E1031']);
                    break;
                case "EstimatedDepartureDate2":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1029', 'E1027']);
                    break;
                case "ActualArrivalDate":
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1025', 'E1024', 'E1027', 'E1026', 'E1029']);
                    break;
                default:
                    break;
            }
        }

        //  ------------------ Start Order Details  -----------------------------
        function InitOrderDetails() {
            OrdGeneralCtrl.ePage.Masters.Config = orderConfig;
            OrdGeneralCtrl.ePage.Masters.Address = {};
            OrdGeneralCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            OrdGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            OrdGeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            OrdGeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            OrdGeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            OrdGeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            OrdGeneralCtrl.ePage.Masters.FieldChanges = FieldChanges;
            OrdGeneralCtrl.ePage.Masters.CheckOrderNo = CheckOrderNo;
            OrdGeneralCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
            OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = true;

            if (OrdGeneralCtrl.currentOrder.isNew) {
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IncoTerm = "FOB";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.TransportMode = "SEA";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ContainerMode = "FCL";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderStatus = "PLC";
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderDate = new Date();

                CheckOrg();
            }

            GetCfxTypeList();
            GetCountryList();
            GetCurrencyList();
            GetServiceLevelList();
            GetAddressTypeList();
        }

        function CheckOrg() {
            // get Buyer ORG based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgUserAcess.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgUserAcess.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        OrgFindAll(response.data.Response);
                    }
                }
            });
        }

        function OrgFindAll(response) {
            var _filter = {
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "ORG_FK": response[0].ROLE_FK
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK = response.data.Response[0].PK;
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_Code = response.data.Response[0].Code;
                        AutoCompleteOnSelect(response.data.Response[0], 'address', 'SCP');
                    }
                }
            });
        }

        function CheckOrderNo(obj) {
            var _errorCode = ["E1001", "E1004"];
            if (obj.UIPorOrderHeader.OrderNo) {
                if (obj.UIPorOrderHeader.OrderNo && obj.UIAddressContactList.SCP.ORG_FK && obj.UIAddressContactList.CRA.ORG_FK) {
                    // get Buyer ORG based on USER
                    var _filter = {
                        "POH_OrderNo": obj.UIPorOrderHeader.OrderNo,
                        "Buyer": obj.UIAddressContactList.SCP.ORG_Code,
                        "Supplier": obj.UIAddressContactList.CRA.ORG_Code
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 0) {
                                if (!OrdGeneralCtrl.currentOrder.isNew) {
                                    (response.data.Response[0].PK == OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.PK) ? OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = true: OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                } else {
                                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                }
                            } else {
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = true;
                                CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                            }
                        } else {
                            toastr.error("API is failed...");
                        }
                    });
                } else {
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = true;
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                }
            } else {
                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = true;
                CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
            }
        }

        function SelectedLookupData($item, type, addressType) {
            switch (addressType) {
                case "SCP":
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.Buyer = $item.data.entity.Code;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = $item.data.entity.PK;
                    // OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderCurrency = $item.data.entity.OAD_CountryCode;
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.Supplier = $item.data.entity.Code;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = $item.data.entity.PK;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OriginCountry = $item.data.entity.OAD_CountryCode;
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1003"]);
                    break;
                case "Export":
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SendingAgentCode = $item.data.entity.Code;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_SendingAgent_FK = $item.data.entity.PK;
                    break;
                case "Import":
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ReceivingAgentCode = $item.data.entity.Code;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_ReceivingAgent_FK = $item.data.entity.PK;
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item.data.entity, addressType);
                    CheckOrderNo(OrdGeneralCtrl.ePage.Entities.Header.Data);
                    break;
                case "Departure Vessel":
                    FieldChanges($item.data.entity, addressType);
                    break;
                case "Arrival Vessel":
                    FieldChanges($item.data.entity, addressType);
                    break;
                default:
                    break;
            }
        }

        function AutoCompleteOnSelect($item, type, addressType) {
            switch (addressType) {
                case "SCP":
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.Buyer = $item.Code;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = $item.PK;
                    // OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderCurrency = $item.data.entity.OAD_CountryCode;
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.Supplier = $item.Code;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = $item.PK;
                    OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OriginCountry = $item.OAD_CountryCode;
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1003"]);
                    break;
                case "Export":
                    break;
                case "Import":
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item, addressType);
                    CheckOrderNo(OrdGeneralCtrl.ePage.Entities.Header.Data);
                    break;
                case "Departure Vessel":
                    FieldChanges(addressType);
                    break;
                case "Arrival Vessel":
                    FieldChanges(addressType);
                    break;
                default:
                    break;
            }
        }

        function FieldChanges(type) {
            switch (type) {
                case "DepartureVessel":
                    if (!OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["ArrivalVessel"]) {
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["ArrivalVessel"] = OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[type];
                    }
                    break;
                case "ArrivalVessel":
                    if (!OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["DepartureVessel"]) {
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["DepartureVessel"] = OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[type];
                    }
                    break;
                case "DepartureVoyage":
                    if (!OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["ArrivalVoyage"]) {
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["ArrivalVoyage"] = OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[type];
                        OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    }
                    break;
                case "ArrivalVoyage":
                    (!OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["DepartureVoyage"]) ? OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["DepartureVoyage"] = OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[type]: false;
                    if (OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["ArrivalVoyage"]) {

                    } else if (OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["DepartureVoyage"] && OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["IntermediateVoyage"]) {
                        OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    } else {
                        OrdGeneralCtrl.ePage.Masters.IsDisable = true;
                    }
                    break;
                case "IntermediateVoyage":
                    (OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader["IntermediateVoyage"]) ? OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IsDateEnable = true: OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IsDateEnable = false;
                    if (!OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IsDateEnable) {
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ArrivalIntermediateDate1 = "";
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ArrivalIntermediateDate2 = "";
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.EstimatedDepartureDate2 = "";
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.EstimatedArrivalDate = "";
                    }
                    CommonErrorObjInput("Order", OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['E1025', 'E1024', 'E1027', 'E1026']);
                    break;
                default:
                    break;
            }
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                (!$item.Address1) ? $item.Address1 = "": false;
                (!$item.Address2) ? $item.Address2 = "": false;
                str = $item.Address1 + " " + $item.Address2;
                return str;
            } else if ($item != undefined && type == "Contact") {
                (!$item.Email) ? $item.Email = "": false;
                (!$item.ContactName) ? $item.ContactName = "": false;
                (!$item.Phone) ? $item.Phone = "": false;
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str;
            } else {
                return str;
            }
        }

        function AddressContactList($item, addressType) {
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            var ContactList = GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            AutoPopulate();
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
                OrgAddressBaseFields(value[0], addressType);
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

        function OnAddressChange(selectedItem, addressType, type) {
            OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false;
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
                    // Org based POL, POD, Origin and destination auto-populate function
                    OrgAddressBaseFields(selectedItem, addressType);
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
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS", "JOBADDR"];
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
        // ORG BASED BUYER & SUPPLIER MAPPING FIELDS AUTO POPULATE
        function AutoPopulate() {
            if (OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK && OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK + '/' + OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.TransportMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].TransportMode;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ContainerMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ReceivingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_ReceivingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SendingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_SendingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ControlCustomCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerCode;
                                OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ORG_ControlCustom_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerFK;
                            }
                        }
                        if (response.data.Response.UIOrgBuyerSupplierMapping) {
                            OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderCurrency = response.data.Response.UIOrgBuyerSupplierMapping.Currency;
                            // OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OriginCountry = response.data.Response.UIOrgBuyerSupplierMapping.ImporterCountry;
                        } else {
                            OrdGeneralCtrl.ePage.Entities.GlobalVar.IsOrgMapping = false;
                        }
                    }
                });
            }
            if (OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                GetGoodsAddressList(OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK, 'GoodsAvailAt');
            }
            if (OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK) {
                GetGoodsAddressList(OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK, 'GoodsDeliveredTo');
            }
        }
        // Org based POL, POD, Origin and destination auto-populate
        function OrgAddressBaseFields(data, addressType) {
            if (data) {
                switch (addressType) {
                    case "SCP":
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.GoodsDeliveredTo = data.RelatedPortCode;
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.PortOfDischarge = data.RelatedPortCode;
                        break;
                    case "CRA":
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.GoodsAvailableAt = data.RelatedPortCode;
                        OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.PortOfLoading = data.RelatedPortCode;
                        break;
                    default:
                        break;
                }
            }
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
            (OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IntermediateVoyage) ? OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IsDateEnable = true: OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.IsDateEnable = false;
            (OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.DepartureVoyage && OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ArrivalVoyage) ? OrdGeneralCtrl.ePage.Masters.IsDisable = false: OrdGeneralCtrl.ePage.Masters.IsDisable = true;
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
            OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
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
                OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
            }
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            OrdGeneralCtrl.ePage.Masters.GetBatchDetails = GetBatchDetails;
            OrdGeneralCtrl.ePage.Masters.OnSelectBatchNo = OnSelectBatchNo;
            (OrdGeneralCtrl.currentOrder.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetBatchDetails(viewValue) {
            OrdGeneralCtrl.ePage.Masters.NoRecords = false;
            OrdGeneralCtrl.ePage.Masters.IsLoading = true;
            var _inputObj = {
                "BatchNo": viewValue
            };
            var _input = {
                "FilterID": appConfig.Entities.PorOrderBatchUpload.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }

            return apiService.post("eAxisAPI", appConfig.Entities.PorOrderBatchUpload.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdGeneralCtrl.ePage.Masters.NoRecords = false;
                        OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                        OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    }
                } else {
                    OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                    OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                }
                return response.data.Response;
            });
        }

        function OnSelectBatchNo(item) {
            OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.POB_FK = item.PK;
            OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.BatchUploadNo = item.BatchUploadNo;
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            OrdGeneralCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "OrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: OrdGeneralCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.Buyer
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
                    OrdGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });

        }

        function CommonErrorObjInput(moduleName, $item, moduleCode, subModuleCode, errorCode) {
            var _obj = {
                ModuleName: [moduleName],
                Code: [$item.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: moduleCode,
                    SubModuleCode: subModuleCode,
                },
                GroupCode: "ORD_TRAN",
                RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                ErrorCode: errorCode
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();

    }

})();