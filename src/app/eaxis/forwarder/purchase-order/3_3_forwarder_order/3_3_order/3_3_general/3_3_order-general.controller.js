(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrdGeneralController", three_three_OrdGeneralController);

    three_three_OrdGeneralController.$inject = ["$rootScope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "three_order_listConfig", "toastr", "errorWarningService"];

    function three_three_OrdGeneralController($rootScope, APP_CONSTANT, authService, apiService, appConfig, helperService, three_order_listConfig, toastr, errorWarningService) {

        var three_three_OrdGeneralCtrl = this;

        function Init() {
            var currentOrder = three_three_OrdGeneralCtrl.currentOrder[three_three_OrdGeneralCtrl.currentOrder.label].ePage.Entities;
            three_three_OrdGeneralCtrl.ePage = {
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
            three_three_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_three_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Order.Entity[three_three_OrdGeneralCtrl.currentOrder.code].GlobalErrorWarningList;
            three_three_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Order.Entity[three_three_OrdGeneralCtrl.currentOrder.code];
            // DatePicker
            three_three_OrdGeneralCtrl.ePage.Masters.DatePicker = {};
            three_three_OrdGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_three_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_three_OrdGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            three_three_OrdGeneralCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

            InitOrderDetails();
            InitPlanningDetails();
            InitContainer();
            InitCustom();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_three_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OnChangeDatePicker(type) {
            switch (type) {
                case "RequiredExWorksDate":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1022', 'EF1023']);
                    break;
                case "EstimatedInStoreDate":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1022', 'EF1023']);
                    break;
                case "EstimatedDepartureDate":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1025', 'EF1024', 'EF1027', 'EF1026']);
                    break;
                case "EstimatedArrivalDate":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1028', 'EF1026']);
                    break;
                case "ArrivalIntermediateDate1":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1030', 'EF1031']);
                    break;
                case "ArrivalIntermediateDate2":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1030', 'EF1031']);
                    break;
                case "EstimatedDepartureDate2":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1029', 'EF1027']);
                    break;
                case "ActualArrivalDate":
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1025', 'EF1024', 'EF1027', 'EF1026', 'EF1029']);
                    break;
                default:
                    break;
            }
        }

        //  ------------------ Start Order Details  -----------------------------
        function InitOrderDetails() {
            three_three_OrdGeneralCtrl.ePage.Masters.Config = three_order_listConfig;
            three_three_OrdGeneralCtrl.ePage.Masters.Address = {};
            three_three_OrdGeneralCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            three_three_OrdGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            three_three_OrdGeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            three_three_OrdGeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            three_three_OrdGeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            three_three_OrdGeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            three_three_OrdGeneralCtrl.ePage.Masters.FieldChanges = FieldChanges;
            three_three_OrdGeneralCtrl.ePage.Masters.CheckOrderNo = CheckOrderNo;
            three_three_OrdGeneralCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
            three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = true;

            if (three_three_OrdGeneralCtrl.currentOrder.isNew) {
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IncoTerm = "FOB";
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.TransportMode = "SEA";
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ContainerMode = "FCL";
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OrderStatus = "PLC";
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OrderDate = new Date();

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
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK = response.data.Response[0].PK;
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_Code = response.data.Response[0].Code;
                        AutoCompleteOnSelect(response.data.Response[0], 'address', 'SCP');
                    }
                }
            });
        }

        function CheckOrderNo(obj) {
            var _errorCode = ["E1001", "E1004"];
            if (obj.UIOrder_Forwarder.OrderNo) {
                if (obj.UIOrder_Forwarder.OrderNo && obj.UIAddressContactList.SCP.ORG_FK && obj.UIAddressContactList.CRA.ORG_FK) {
                    // get Buyer ORG based on USER
                    var _filter = {
                        "POH_OrderNo": obj.UIOrder_Forwarder.OrderNo,
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
                                if (!three_three_OrdGeneralCtrl.currentOrder.isNew) {
                                    (response.data.Response[0].PK == three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.PK) ? three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = true: three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                } else {
                                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                }
                            } else {
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = true;
                                CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                            }
                        } else {
                            toastr.error("API is failed...");
                        }
                    });
                } else {
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = true;
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                }
            } else {
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = true;
                CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
            }
        }

        function SelectedLookupData($item, type, addressType) {
            switch (addressType) {
                case "SCP":
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.Buyer = $item.data.entity.Code;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Buyer_FK = $item.data.entity.PK;
                    // three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OrderCurrency = $item.data.entity.OAD_CountryCode;
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.Supplier = $item.data.entity.Code;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Supplier_FK = $item.data.entity.PK;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OriginCountry = $item.data.entity.OAD_CountryCode;
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1003"]);
                    break;
                case "Export":
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SendingAgentCode = $item.data.entity.Code;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_SendingAgent_FK = $item.data.entity.PK;
                    break;
                case "Import":
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ReceivingAgentCode = $item.data.entity.Code;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_ReceivingAgent_FK = $item.data.entity.PK;
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item.data.entity, addressType);
                    CheckOrderNo(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data);
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
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.Buyer = $item.Code;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Buyer_FK = $item.PK;
                    // three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OrderCurrency = $item.data.entity.OAD_CountryCode;
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.Supplier = $item.Code;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Supplier_FK = $item.PK;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OriginCountry = $item.OAD_CountryCode;
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["E1003"]);
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
                    CheckOrderNo(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data);
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
                    if (!three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["ArrivalVessel"]) {
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["ArrivalVessel"] = three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder[type];
                    }
                    break;
                case "ArrivalVessel":
                    if (!three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["DepartureVessel"]) {
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["DepartureVessel"] = three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder[type];
                    }
                    break;
                case "DepartureVoyage":
                    if (!three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["ArrivalVoyage"]) {
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["ArrivalVoyage"] = three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder[type];
                        three_three_OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    }
                    break;
                case "ArrivalVoyage":
                    (!three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["DepartureVoyage"]) ? three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["DepartureVoyage"] = three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder[type]: false;
                    if (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["ArrivalVoyage"]) {

                    } else if (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["DepartureVoyage"] && three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["IntermediateVoyage"]) {
                        three_three_OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    } else {
                        three_three_OrdGeneralCtrl.ePage.Masters.IsDisable = true;
                    }
                    break;
                case "IntermediateVoyage":
                    (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder["IntermediateVoyage"]) ? three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IsDateEnable = true: three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IsDateEnable = false;
                    if (!three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IsDateEnable) {
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ArrivalIntermediateDate1 = "";
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ArrivalIntermediateDate2 = "";
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.EstimatedDepartureDate2 = "";
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.EstimatedArrivalDate = "";
                    }
                    CommonErrorObjInput("Order", three_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EF1025', 'EF1024', 'EF1027', 'EF1026']);
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
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            var ContactList = GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
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
            three_three_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false;
            if (type === "Address") {
                if (selectedItem) {
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    // Org based POL, POD, Origin and destination auto-populate function
                    OrgAddressBaseFields(selectedItem, addressType);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            three_three_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            three_three_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }

        function GetAddressTypeList() {
            var _filter = {
                "EntityRefKey": three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "POH"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobAddress.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject = response.data.Response;

                    var _addressTypeList = three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject.CfxTypeList;
                    _addressTypeList.map(function (value, key) {
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].AddressList = [];
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].ContactList = [];
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
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
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
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
            });
        }

        function GetCurrencyList() {
            //Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.Currency.ListSource = response.data.Response;
            });
        }

        function GetServiceLevelList() {
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.ServiceLevel.ListSource = response.data.Response;
            });
        }
        // ORG BASED BUYER & SUPPLIER MAPPING FIELDS AUTO POPULATE
        function AutoPopulate() {
            if (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK && three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK + '/' + three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.TransportMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].TransportMode;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ContainerMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ReceivingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_ReceivingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SendingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_SendingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ControlCustomCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerCode;
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_ControlCustom_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerFK;
                            }
                        }
                        if (response.data.Response.UIOrgBuyerSupplierMapping) {
                            three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OrderCurrency = response.data.Response.UIOrgBuyerSupplierMapping.Currency;
                            // three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OriginCountry = response.data.Response.UIOrgBuyerSupplierMapping.ImporterCountry;
                        } else {
                            three_three_OrdGeneralCtrl.ePage.Entities.GlobalVar.IsOrgMapping = false;
                        }
                    }
                });
            }
            if (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                GetGoodsAddressList(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK, 'GoodsAvailAt');
            }
            if (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK) {
                GetGoodsAddressList(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK, 'GoodsDeliveredTo');
            }
        }
        // Org based POL, POD, Origin and destination auto-populate
        function OrgAddressBaseFields(data, addressType) {
            if (data) {
                switch (addressType) {
                    case "SCP":
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.GoodsDeliveredTo = data.RelatedPortCode;
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.PortOfDischarge = data.RelatedPortCode;
                        break;
                    case "CRA":
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.GoodsAvailableAt = data.RelatedPortCode;
                        three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.PortOfLoading = data.RelatedPortCode;
                        break;
                    default:
                        break;
                }
            }
        }
        // ----------------- Start Planning -------------------------

        function InitPlanningDetails() {
            GetPacksList();
            if (!three_three_OrdGeneralCtrl.currentOrder.isNew) {
                GetGoodsAddressList(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Supplier_FK, 'GoodsAvailAt');
                GetGoodsAddressList(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Buyer_FK, 'GoodsDeliveredTo');
                GetMainAddress(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Supplier_FK, 'Supplier');
                GetMainAddress(three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ORG_Buyer_FK, 'Buyer');
            }
            (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IntermediateVoyage) ? three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IsDateEnable = true: three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.IsDateEnable = false;
            (three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.DepartureVoyage && three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ArrivalVoyage) ? three_three_OrdGeneralCtrl.ePage.Masters.IsDisable = false: three_three_OrdGeneralCtrl.ePage.Masters.IsDisable = true;
        }

        function GetPacksList() {
            // Get Packs
            var _inputPacks = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPacks).then(function (response) {
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.MstPackType.ListSource = response.data.Response;
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
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Meta[obj].ListSource = response.data.Response;
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
                                three_three_OrdGeneralCtrl.ePage.Masters[org] = {};
                                three_three_OrdGeneralCtrl.ePage.Masters[org][org + 'Add'] = val.Address1 + ' ' + val.City + ' ' + val.State + ' ' + val.PostCode + ' ' + val.RelatedPortCode;
                            }
                        });
                    });
                }
            });
        }
        // ----------------------------------- Init Container-----------------------------------
        function InitContainer() {
            three_three_OrdGeneralCtrl.ePage.Masters.formView = {};
            three_three_OrdGeneralCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            three_three_OrdGeneralCtrl.ePage.Masters.AddNew = AddNew;
            three_three_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
        }

        function SelectedGridRow(data, action, index) {
            if (action == 'edit') {
                three_three_OrdGeneralCtrl.ePage.Masters.formView = data;
                three_three_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Update"
            } else {
                if (data.PK == undefined) {
                    three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Forwarder.splice(index, 1)
                } else {
                    var r = confirm("Are You Sure Want To Delete?");
                    if (r == true) {
                        apiService.get("eAxisAPI", three_three_OrdGeneralCtrl.ePage.Entities.Container.API.Delete.Url + data.PK).then(function (response) {
                            if (response.data.Status == 'Success') {
                                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Forwarder.splice(index, 1)
                            }
                        });
                    }
                }
            }

        }

        function AddNew(item, action) {
            if (action == 'Add New') {
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Forwarder.push(item);
                three_three_OrdGeneralCtrl.ePage.Masters.formView = {};
            } else {
                var _index = three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Forwarder.indexOf(item);
                three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Forwarder[_index] = item;
                three_three_OrdGeneralCtrl.ePage.Masters.formView = {};
                three_three_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
            }
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            three_three_OrdGeneralCtrl.ePage.Masters.GetBatchDetails = GetBatchDetails;
            three_three_OrdGeneralCtrl.ePage.Masters.OnSelectBatchNo = OnSelectBatchNo;
            (three_three_OrdGeneralCtrl.currentOrder.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetBatchDetails(viewValue) {
            three_three_OrdGeneralCtrl.ePage.Masters.NoRecords = false;
            three_three_OrdGeneralCtrl.ePage.Masters.IsLoading = true;
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
                        three_three_OrdGeneralCtrl.ePage.Masters.NoRecords = false;
                        three_three_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        three_three_OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                        three_three_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    }
                } else {
                    three_three_OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                    three_three_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                }
                return response.data.Response;
            });
        }

        function OnSelectBatchNo(item) {
            three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.POB_FK = item.PK;
            three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.BatchUploadNo = item.BatchUploadNo;
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            three_three_OrdGeneralCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "OrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: three_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.Buyer
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
                    three_three_OrdGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
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
                GroupCode: "FORWARDER_ORD_TRAN",
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