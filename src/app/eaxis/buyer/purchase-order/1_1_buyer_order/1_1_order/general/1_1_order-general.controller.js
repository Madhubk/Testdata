(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrdGeneralController", one_one_OrdGeneralController);

    one_one_OrdGeneralController.$inject = ["$rootScope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "one_order_listConfig", "toastr", "errorWarningService"];

    function one_one_OrdGeneralController($rootScope, APP_CONSTANT, authService, apiService, appConfig, helperService, one_order_listConfig, toastr, errorWarningService) {

        var one_one_OrdGeneralCtrl = this;

        function Init() {
            var currentOrder = one_one_OrdGeneralCtrl.currentOrder[one_one_OrdGeneralCtrl.currentOrder.label].ePage.Entities;
            one_one_OrdGeneralCtrl.ePage = {
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
            one_one_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            one_one_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Order.Entity[one_one_OrdGeneralCtrl.currentOrder.code].GlobalErrorWarningList;
            one_one_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Order.Entity[one_one_OrdGeneralCtrl.currentOrder.code];
            // DatePicker
            one_one_OrdGeneralCtrl.ePage.Masters.DatePicker = {};
            one_one_OrdGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_one_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_one_OrdGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            one_one_OrdGeneralCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

            InitOrderDetails();
            InitPlanningDetails();
            InitContainer();
            InitCustom();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_one_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OnChangeDatePicker(type) {
            switch (type) {
                case "RequiredExWorksDate":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC022', 'EC023']);
                    break;
                case "EstimatedInStoreDate":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC022', 'EC023']);
                    break;
                case "EstimatedDepartureDate":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC025', 'EC024', 'EC027', 'EC026']);
                    break;
                case "EstimatedArrivalDate":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC028', 'EC026']);
                    break;
                case "ArrivalIntermediateDate1":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC030', 'EC031']);
                    break;
                case "ArrivalIntermediateDate2":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC030', 'EC031']);
                    break;
                case "EstimatedDepartureDate2":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC029', 'EC027']);
                    break;
                case "ActualArrivalDate":
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC025', 'EC024', 'EC027', 'EC026', 'EC029']);
                    break;
                default:
                    break;
            }
        }
        //  ------------------ Start Order Details  -----------------------------
        function InitOrderDetails() {
            one_one_OrdGeneralCtrl.ePage.Masters.Config = one_order_listConfig;
            one_one_OrdGeneralCtrl.ePage.Masters.Address = {};
            one_one_OrdGeneralCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            one_one_OrdGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            one_one_OrdGeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            one_one_OrdGeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            one_one_OrdGeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            one_one_OrdGeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            one_one_OrdGeneralCtrl.ePage.Masters.FieldChanges = FieldChanges;
            one_one_OrdGeneralCtrl.ePage.Masters.CheckOrderNo = CheckOrderNo;
            one_one_OrdGeneralCtrl.ePage.Masters.ModeChange = ModeChange;
            one_one_OrdGeneralCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
            one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ValidOrderNo = true;

            if (one_one_OrdGeneralCtrl.currentOrder.isNew) {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IncoTerm = "FOB";
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.TransportMode = "SEA";
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ContainerMode = "FCL";
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OrderStatus = "PLC";
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OrderDate = new Date();

                CheckOrg();
            }

            GetCfxTypeList();
            CfxContainerType();
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
                        response.data.Response.map(function (val, key) {
                            if (val.IsConsignee) {
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK = response.data.Response[0].PK;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_Code = response.data.Response[0].Code;
                                AutoCompleteOnSelect(val, 'address', 'SCP');
                            }
                        });
                    }
                }
            });
        }

        function CheckOrderNo(obj) {
            var _errorCode = ["EC001", "EC004"];
            if (obj.UIOrder_Buyer.OrderNo) {
                if (obj.UIOrder_Buyer.OrderNo && obj.UIAddressContactList.SCP.ORG_FK && obj.UIAddressContactList.CRA.ORG_FK) {
                    // get Buyer ORG based on USER
                    var _filter = {
                        "POH_OrderNo": obj.UIOrder_Buyer.OrderNo,
                        "Buyer": obj.UIAddressContactList.SCP.ORG_Code,
                        "Supplier": obj.UIAddressContactList.CRA.ORG_Code
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.BuyerOrder.API.findall.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 0) {
                                if (!one_one_OrdGeneralCtrl.currentOrder.isNew) {
                                    (response.data.Response[0].PK == one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK) ? one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ValidOrderNo = true: one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                } else {
                                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                }
                            } else {
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ValidOrderNo = true;
                                CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                            }
                        } else {
                            toastr.error("API is failed...");
                        }
                    });
                } else {
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ValidOrderNo = true;
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                }
            } else {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ValidOrderNo = true;
                CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
            }
        }

        function SelectedLookupData($item, type, addressType) {
            switch (addressType) {
                case "SCP":
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer = $item.data.entity.Code;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK = $item.data.entity.PK;
                    getMDMMiscService(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK);
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["EC002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Supplier = $item.data.entity.Code;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Supplier_FK = $item.data.entity.PK;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OriginCountry = $item.data.entity.OAD_CountryCode;
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["EC003"]);
                    break;
                case "Export":
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SendingAgentCode = $item.data.entity.Code;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_SendingAgent_FK = $item.data.entity.PK;
                    break;
                case "Import":
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ReceivingAgentCode = $item.data.entity.Code;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_ReceivingAgent_FK = $item.data.entity.PK;
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item.data.entity, addressType);
                    CheckOrderNo(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data);
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
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer = $item.Code;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK = $item.PK;
                    getMDMMiscService(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK);
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["EC002"]);
                    GetDynamicControl("ORG");
                    break;
                case "CRA":
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Supplier = $item.Code;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Supplier_FK = $item.PK;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OriginCountry = $item.OAD_CountryCode;
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["EC003"]);
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
                    CheckOrderNo(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data);
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

        function getMDMMiscService(pk) {
            var _inputObj = {
                "ORG_FK": pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    one_one_OrdGeneralCtrl.ePage.Masters.OrgMiscService = response.data.Response[0];
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OrderCurrency = response.data.Response[0].CUR_NKFWDefCurrency;
                }
            });
        }

        function FieldChanges(type) {
            switch (type) {
                case "DepartureVessel":
                    if (!one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["ArrivalVessel"]) {
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["ArrivalVessel"] = one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer[type];
                    }
                    break;
                case "ArrivalVessel":
                    if (!one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["DepartureVessel"]) {
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["DepartureVessel"] = one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer[type];
                    }
                    break;
                case "DepartureVoyage":
                    if (!one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["ArrivalVoyage"]) {
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["ArrivalVoyage"] = one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer[type];
                        one_one_OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    }
                    break;
                case "ArrivalVoyage":
                    (!one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["DepartureVoyage"]) ? one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["DepartureVoyage"] = one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer[type]: false;
                    if (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["ArrivalVoyage"]) {

                    } else if (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["DepartureVoyage"] && one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["IntermediateVoyage"]) {
                        one_one_OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    } else {
                        one_one_OrdGeneralCtrl.ePage.Masters.IsDisable = true;
                    }
                    break;
                case "IntermediateVoyage":
                    (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer["IntermediateVoyage"]) ? one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IsDateEnable = true: one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IsDateEnable = false;
                    if (!one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IsDateEnable) {
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ArrivalIntermediateDate1 = "";
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ArrivalIntermediateDate2 = "";
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.EstimatedDepartureDate2 = "";
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.EstimatedArrivalDate = "";
                    }
                    CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC025', 'EC024', 'EC027', 'EC026']);
                    break;
                default:
                    break;
            }
        }

        function ModeChange(obj) {
            if (obj) {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ContainerMode = obj.Key
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.TransportMode = obj.PARENT_Key
            } else {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ContainerMode = null
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.TransportMode = null
            }

            CommonErrorObjInput("Order", one_one_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['EC007', 'EC008']);
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
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            var ContactList = GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
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
            one_one_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false;
            if (type === "Address") {
                if (selectedItem) {
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    // Org based POL, POD, Origin and destination auto-populate function
                    OrgAddressBaseFields(selectedItem, addressType);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            one_one_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            one_one_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }

        function GetAddressTypeList() {
            var _filter = {
                "EntityRefKey": one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "POH"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobAddress.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject = response.data.Response;

                    var _addressTypeList = one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject.CfxTypeList;
                    _addressTypeList.map(function (value, key) {
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].AddressList = [];
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].ContactList = [];
                    });

                } else {
                    console.log("Address type list empty response");
                }
            });
        }

        function GetCfxTypeList() {
            // var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS", "JOBADDR"];
            var typeCodeList = ["INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS", "JOBADDR"];
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
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }

        function CfxContainerType() {
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.CntType = response.data.Response;
                    var obj = _.filter(one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.CntType, {
                        'Key': one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ContainerMode
                    })[0];
                    one_one_OrdGeneralCtrl.ePage.Masters.SelectedMode = obj;
                }
            });

        }

        function GetCountryList() {
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _input).then(function (response) {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
            });
        }

        function GetCurrencyList() {
            //Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.Currency.ListSource = response.data.Response;
            });
        }

        function GetServiceLevelList() {
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.ServiceLevel.ListSource = response.data.Response;
            });
        }
        // ORG BASED BUYER & SUPPLIER MAPPING FIELDS AUTO POPULATE
        function AutoPopulate() {
            if (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK && one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK + '/' + one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.TransportMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].TransportMode;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ContainerMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ReceivingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_ReceivingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SendingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_SendingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ControlCustomCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerCode;
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_ControlCustom_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerFK;
                            }
                        }
                        if (response.data.Response.UIOrgBuyerSupplierMapping) {
                            // one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OrderCurrency = response.data.Response.UIOrgBuyerSupplierMapping.Currency;
                            // one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OriginCountry = response.data.Response.UIOrgBuyerSupplierMapping.ImporterCountry;
                        } else {
                            one_one_OrdGeneralCtrl.ePage.Entities.GlobalVar.IsOrgMapping = false;
                        }
                    }
                });
            }
            if (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                GetGoodsAddressList(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK, 'GoodsAvailAt');
            }
            if (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK) {
                GetGoodsAddressList(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK, 'GoodsDeliveredTo');
            }
        }
        // Org based POL, POD, Origin and destination auto-populate
        function OrgAddressBaseFields(data, addressType) {
            if (data) {
                switch (addressType) {
                    case "SCP":
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.GoodsDeliveredTo = data.RelatedPortCode;
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PortOfDischarge = data.RelatedPortCode;
                        break;
                    case "CRA":
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.GoodsAvailableAt = data.RelatedPortCode;
                        one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PortOfLoading = data.RelatedPortCode;
                        break;
                    default:
                        break;
                }
            }
        }
        // ----------------- Start Planning -------------------------

        function InitPlanningDetails() {
            GetPacksList();
            if (!one_one_OrdGeneralCtrl.currentOrder.isNew) {
                GetGoodsAddressList(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Supplier_FK, 'GoodsAvailAt');
                GetGoodsAddressList(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK, 'GoodsDeliveredTo');
                GetMainAddress(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Supplier_FK, 'Supplier');
                GetMainAddress(one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ORG_Buyer_FK, 'Buyer');
            }
            (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IntermediateVoyage) ? one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IsDateEnable = true: one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.IsDateEnable = false;
            (one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.DepartureVoyage && one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ArrivalVoyage) ? one_one_OrdGeneralCtrl.ePage.Masters.IsDisable = false: one_one_OrdGeneralCtrl.ePage.Masters.IsDisable = true;
        }

        function GetPacksList() {
            // Get Packs
            var _inputPacks = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPacks).then(function (response) {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta.MstPackType.ListSource = response.data.Response;
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
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Meta[obj].ListSource = response.data.Response;
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
                                one_one_OrdGeneralCtrl.ePage.Masters[org] = {};
                                one_one_OrdGeneralCtrl.ePage.Masters[org][org + 'Add'] = val.Address1 + ' ' + val.City + ' ' + val.State + ' ' + val.PostCode + ' ' + val.RelatedPortCode;
                            }
                        });
                    });
                }
            });
        }
        // ----------------------------------- Init Container-----------------------------------
        function InitContainer() {
            one_one_OrdGeneralCtrl.ePage.Masters.formView = {};
            one_one_OrdGeneralCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            one_one_OrdGeneralCtrl.ePage.Masters.AddNew = AddNew;
            one_one_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
        }

        function SelectedGridRow(data, action, index) {
            if (action == 'edit') {
                one_one_OrdGeneralCtrl.ePage.Masters.formView = data;
                one_one_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Update"
            } else {
                if (data.PK == undefined) {
                    one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer.splice(index, 1)
                } else {
                    var r = confirm("Are You Sure Want To Delete?");
                    if (r == true) {
                        apiService.get("eAxisAPI", one_one_OrdGeneralCtrl.ePage.Entities.Container.API.Delete.Url + data.PK).then(function (response) {
                            if (response.data.Status == 'Success') {
                                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer.splice(index, 1)
                            }
                        });
                    }
                }
            }

        }

        function AddNew(item, action) {
            if (action == 'Add New') {
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer.push(item);
                one_one_OrdGeneralCtrl.ePage.Masters.formView = {};
            } else {
                var _index = one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer.indexOf(item);
                one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer[_index] = item;
                one_one_OrdGeneralCtrl.ePage.Masters.formView = {};
                one_one_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
            }
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            one_one_OrdGeneralCtrl.ePage.Masters.GetBatchDetails = GetBatchDetails;
            one_one_OrdGeneralCtrl.ePage.Masters.OnSelectBatchNo = OnSelectBatchNo;
            (one_one_OrdGeneralCtrl.currentOrder.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetBatchDetails(viewValue) {
            one_one_OrdGeneralCtrl.ePage.Masters.NoRecords = false;
            one_one_OrdGeneralCtrl.ePage.Masters.IsLoading = true;
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
                        one_one_OrdGeneralCtrl.ePage.Masters.NoRecords = false;
                        one_one_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        one_one_OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                        one_one_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    }
                } else {
                    one_one_OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                    one_one_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                }
                return response.data.Response;
            });
        }

        function OnSelectBatchNo(item) {
            one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.POB_FK = item.PK;
            one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.BatchUploadNo = item.BatchUploadNo;
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            one_one_OrdGeneralCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "OrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: one_one_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer
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
                    one_one_OrdGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
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
                GroupCode: "BUYER_ORD_TRANS",
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