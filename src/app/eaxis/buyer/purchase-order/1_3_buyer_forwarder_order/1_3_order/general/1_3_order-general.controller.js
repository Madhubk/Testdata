(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_OrdGeneralController", one_three_OrdGeneralController);

    one_three_OrdGeneralController.$inject = ["$rootScope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "one_order_listConfig", "orderApiConfig", "toastr", "errorWarningService"];

    function one_three_OrdGeneralController($rootScope, APP_CONSTANT, authService, apiService, appConfig, helperService, one_order_listConfig, orderApiConfig, toastr, errorWarningService) {

        var one_three_OrdGeneralCtrl = this;

        function Init() {
            var currentOrder = one_three_OrdGeneralCtrl.currentOrder[one_three_OrdGeneralCtrl.currentOrder.label].ePage.Entities;
            one_three_OrdGeneralCtrl.ePage = {
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
            one_three_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            one_three_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Order.Entity[one_three_OrdGeneralCtrl.currentOrder.code].GlobalErrorWarningList;
            one_three_OrdGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Order.Entity[one_three_OrdGeneralCtrl.currentOrder.code];
            // DatePicker
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker = {};
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.OnChangeDatePicker = OnChangeDatePicker;

            InitOrderDetails();
            InitPlanningDetails();
            InitContainer();
            InitCustom();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OnChangeDatePicker(type) {
            switch (type) {
                case "RequiredExWorksDate":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED022', 'ED023']);
                    break;
                case "EstimatedInStoreDate":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED022', 'ED023']);
                    break;
                case "EstimatedDepartureDate":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED025', 'ED024', 'ED027', 'ED026']);
                    break;
                case "EstimatedArrivalDate":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED028', 'ED026']);
                    break;
                case "ArrivalIntermediateDate1":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED030', 'ED031']);
                    break;
                case "ArrivalIntermediateDate2":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED030', 'ED031']);
                    break;
                case "EstimatedDepartureDate2":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED029', 'ED027']);
                    break;
                case "ActualArrivalDate":
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED025', 'ED024', 'ED027', 'ED026', 'ED029']);
                    break;
                default:
                    break;
            }
        }
        //  ------------------ Start Order Details  -----------------------------
        function InitOrderDetails() {
            one_three_OrdGeneralCtrl.ePage.Masters.Config = one_order_listConfig;
            one_three_OrdGeneralCtrl.ePage.Masters.Address = {};
            one_three_OrdGeneralCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            one_three_OrdGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            one_three_OrdGeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            one_three_OrdGeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            one_three_OrdGeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            one_three_OrdGeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            one_three_OrdGeneralCtrl.ePage.Masters.FieldChanges = FieldChanges;
            one_three_OrdGeneralCtrl.ePage.Masters.CheckOrderNo = CheckOrderNo;
            one_three_OrdGeneralCtrl.ePage.Masters.ModeChange = ModeChange;
            one_three_OrdGeneralCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
            one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = true;
            one_three_OrdGeneralCtrl.ePage.Masters.OrderListSource = [{
                    "Code": "POR",
                    "Desc": "Purchase Order"
                },
                {
                    "Code": "DOR",
                    "Desc": "Delivery Order"
                }
            ]
            if (one_three_OrdGeneralCtrl.currentOrder.isNew) {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IncoTerm = "FOB";
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.TransportMode = "SEA";
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ContainerMode = "FCL";
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderStatus = "PLC";
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderDate = new Date();
                (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderType) ? false: one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderType = "POR";
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
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK = response.data.Response[0].PK;
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_Code = response.data.Response[0].Code;
                        AutoCompleteOnSelect(response.data.Response[0], 'address', 'SCP');
                    }
                }
            });
        }

        function CheckOrderNo(obj) {
            var _errorCode = ["ED001", "ED004"];
            if (obj.UIOrder_Buyer_Forwarder.OrderNo) {
                if (obj.UIOrder_Buyer_Forwarder.OrderNo && obj.UIAddressContactList.SCP.ORG_FK && obj.UIAddressContactList.CRA.ORG_FK) {
                    // get Buyer ORG based on USER
                    var _filter = {
                        "POH_OrderNo": obj.UIOrder_Buyer_Forwarder.OrderNo,
                        "Buyer": obj.UIAddressContactList.SCP.ORG_Code,
                        "Supplier": obj.UIAddressContactList.CRA.ORG_Code
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": orderApiConfig.Entities.BuyerForwarderOrder.API.findall.FilterID
                    };
                    apiService.post("eAxisAPI", orderApiConfig.Entities.BuyerForwarderOrder.API.findall.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 0) {
                                if (!one_three_OrdGeneralCtrl.currentOrder.isNew) {
                                    (response.data.Response[0].PK == one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.PK) ? one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = true: one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                } else {
                                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = false;
                                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                                }
                            } else {
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = true;
                                CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                            }
                        } else {
                            toastr.error("API is failed...");
                        }
                    });
                } else {
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = true;
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
                }
            } else {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = true;
                CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", _errorCode);
            }
        }

        function SelectedLookupData($item, type, addressType) {
            switch (addressType) {
                case "SCP":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Buyer = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ConsigneeName = $item.data.entity.FullName;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OriginCountry = $item.data.entity.OAD_CountryCode;
                    getMDMMiscService(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK);
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["ED002"]);
                    GetDynamicControl("ORG");
                    if (one_three_OrdGeneralCtrl.currentOrder.isNew) {
                        getOrgBuyerSupplierMapping();
                    }
                    break;
                case "CRA":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Supplier = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ConsignorName = $item.data.entity.FullName;
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["ED003"]);
                    break;
                case "Export":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SendingAgentCode = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_SendingAgent_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_SendingAgentName = $item.data.entity.FullName;
                    break;
                case "Import":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ReceivingAgentCode = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ReceivingAgent_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ReceivingAgentName = $item.data.entity.FullName;
                    break;
                case "ExportCHA":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ExportCHA_Code = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ExportCHA_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ExportCHAName = $item.data.entity.FullName;
                    break;
                case "Carrier":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.CarrierCode = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Carrier_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_CarrierName = $item.data.entity.FullName;
                    break;
                case "BuyingHouseAgent":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.BuyingHouseAgent_Code = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.BuyingHouseAgent_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.BuyingHouseAgentName = $item.data.entity.FullName;
                    break;
                case "ControllingCustomer":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ControlCustomCode = $item.data.entity.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ControlCustom_FK = $item.data.entity.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ControlCustomName = $item.data.entity.FullName;
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item.data.entity, addressType);
                    CheckOrderNo(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data);
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
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Buyer = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ConsigneeName = $item.FullName;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OriginCountry = $item.OAD_CountryCode;
                    getMDMMiscService(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK);
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["ED002"]);
                    GetDynamicControl("ORG");
                    if (one_three_OrdGeneralCtrl.currentOrder.isNew) {
                        getOrgBuyerSupplierMapping();
                    }
                    break;
                case "CRA":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Supplier = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ConsignorName = $item.FullName;
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["ED003"]);
                    break;
                case "Export":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SendingAgentCode = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_SendingAgent_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_SendingAgentName = $item.FullName;
                    break;
                case "Import":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ReceivingAgentCode = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ReceivingAgent_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ReceivingAgentName = $item.FullName;
                    break;
                case "ExportCHA":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ExportCHA_Code = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ExportCHA_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ExportCHAName = $item.FullName;
                    break;
                case "Carrier":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.CarrierCode = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Carrier_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_CarrierName = $item.FullName;
                    break;
                case "BuyingHouseAgent":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.BuyingHouseAgent_Code = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.BuyingHouseAgent_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.BuyingHouseAgentName = $item.FullName;
                    break;
                case "ControllingCustomer":
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ControlCustomCode = $item.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ControlCustom_FK = $item.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ControlCustomName = $item.FullName;
                    break;
                default:
                    break;
            }
            switch (type) {
                case "address":
                    AddressContactList($item, addressType);
                    CheckOrderNo(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data);
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

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "BuyerCode": one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Buyer
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    one_three_OrdGeneralCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    if (one_three_OrdGeneralCtrl.currentOrder.isNew) {
                        var tempBuyObj = one_three_OrdGeneralCtrl.ePage.Masters.OrgBuyerDetails[0];
                        OnSelectSupplier(tempBuyObj);
                    }
                }
            });
        }

        function OnSelectSupplier($item) {
            if ($item) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgHeader.API.GetById.Url + $item.ORG_Supplier).then(function (response) {
                    if (response.data.Response) {
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Supplier = response.data.Response.Code;
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK = response.data.Response.PK;
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ConsignorName = response.data.Response.FullName;
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK = response.data.Response.PK;
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_Code = response.data.Response.Code;
                        $item = response.data.Response;
                        AddressContactList($item, 'CRA');
                        CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ["ED003"]);
                    }
                });
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
                    one_three_OrdGeneralCtrl.ePage.Masters.OrgMiscService = response.data.Response[0];
                    // one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderCurrency = response.data.Response[0].CUR_NKFWDefCurrency;
                }
            });
        }

        function FieldChanges(type) {
            switch (type) {
                case "DepartureVessel":
                    if (!one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["ArrivalVessel"]) {
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["ArrivalVessel"] = one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder[type];
                    }
                    break;
                case "ArrivalVessel":
                    if (!one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["DepartureVessel"]) {
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["DepartureVessel"] = one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder[type];
                    }
                    break;
                case "DepartureVoyage":
                    if (!one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["ArrivalVoyage"]) {
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["ArrivalVoyage"] = one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder[type];
                        one_three_OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    }
                    break;
                case "ArrivalVoyage":
                    (!one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["DepartureVoyage"]) ? one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["DepartureVoyage"] = one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder[type]: false;
                    if (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["ArrivalVoyage"]) {

                    } else if (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["DepartureVoyage"] && one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["IntermediateVoyage"]) {
                        one_three_OrdGeneralCtrl.ePage.Masters.IsDisable = false;
                    } else {
                        one_three_OrdGeneralCtrl.ePage.Masters.IsDisable = true;
                    }
                    break;
                case "IntermediateVoyage":
                    (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder["IntermediateVoyage"]) ? one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IsDateEnable = true: one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IsDateEnable = false;
                    if (!one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IsDateEnable) {
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ArrivalIntermediateDate1 = "";
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ArrivalIntermediateDate2 = "";
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.EstimatedDepartureDate2 = "";
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.EstimatedArrivalDate = "";
                    }
                    CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED025', 'ED024', 'ED027', 'ED026']);
                    break;
                default:
                    break;
            }
        }

        function ModeChange(obj) {
            if (obj) {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ContainerMode = obj.Key
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.TransportMode = obj.PARENT_Key
            } else {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ContainerMode = null
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.TransportMode = null
            }

            CommonErrorObjInput("Order", one_three_OrdGeneralCtrl.currentOrder, "ORD", "ORD", ['ED007', 'ED008']);
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
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            var ContactList = GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
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
                (value.length > 0) ? OrgAddressBaseFields(value[0], addressType): false;
            });
            ContactList.then(function (value) {
                if (value.length > 0) {
                    var _defaultContact = value[0];
                    OnContactChange(_defaultContact, addressType, "Contact");
                }
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
            one_three_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false;
            if (type === "Address") {
                if (selectedItem) {
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    // Org based POL, POD, Origin and destination auto-populate function
                    OrgAddressBaseFields(selectedItem, addressType);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            one_three_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            one_three_OrdGeneralCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }

        function GetAddressTypeList() {
            var _filter = {
                "EntityRefKey": one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "POH"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobAddress.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject = response.data.Response;

                    var _addressTypeList = one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject.CfxTypeList;
                    _addressTypeList.map(function (value, key) {
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].AddressList = [];
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject[value.Key].ContactList = [];
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
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
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
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.CntType = response.data.Response;
                    var obj = _.filter(one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.CntType, {
                        'Key': one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ContainerMode
                    })[0];
                    one_three_OrdGeneralCtrl.ePage.Masters.SelectedMode = obj;
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
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
            });
        }

        function GetCurrencyList() {
            //Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.Currency.ListSource = response.data.Response;
            });
        }

        function GetServiceLevelList() {
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.ServiceLevel.ListSource = response.data.Response;
            });
        }
        // ORG BASED BUYER & SUPPLIER MAPPING FIELDS AUTO POPULATE
        function AutoPopulate() {
            if (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK && one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK + '/' + one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.TransportMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].TransportMode;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ContainerMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ReceivingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ReceivingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SendingAgentCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_SendingAgent_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ControlCustomCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerCode;
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_ControlCustom_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerFK;
                                one_three_OrdGeneralCtrl.ePage.Entities.GlobalVar.IsOrgMapping = true;
                            }
                        }
                        if (response.data.Response.UIOrgBuyerSupplierMapping) {
                            // one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderCurrency = response.data.Response.UIOrgBuyerSupplierMapping.Currency;
                            // one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OriginCountry = response.data.Response.UIOrgBuyerSupplierMapping.ImporterCountry;
                        } else {
                            one_three_OrdGeneralCtrl.ePage.Entities.GlobalVar.IsOrgMapping = false;
                        }
                    }
                });
            }
            if (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK) {
                GetGoodsAddressList(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRA.ORG_FK, 'GoodsAvailAt');
            }
            if (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK) {
                GetGoodsAddressList(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.SCP.ORG_FK, 'GoodsDeliveredTo');
            }
        }
        // Org based POL, POD, Origin and destination auto-populate
        function OrgAddressBaseFields(data, addressType) {
            if (data) {
                switch (addressType) {
                    case "SCP":
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.GoodsDeliveredTo = data.RelatedPortCode;
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.PortOfDischarge = data.RelatedPortCode;
                        break;
                    case "CRA":
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.GoodsAvailableAt = data.RelatedPortCode;
                        one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.PortOfLoading = data.RelatedPortCode;
                        break;
                    default:
                        break;
                }
            }
        }
        // ----------------- Start Planning -------------------------

        function InitPlanningDetails() {
            GetPacksList();
            if (!one_three_OrdGeneralCtrl.currentOrder.isNew) {
                GetGoodsAddressList(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK, 'GoodsAvailAt');
                GetGoodsAddressList(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK, 'GoodsDeliveredTo');
                GetMainAddress(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK, 'Supplier');
                GetMainAddress(one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK, 'Buyer');
            }
            (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IntermediateVoyage) ? one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IsDateEnable = true: one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IsDateEnable = false;
            (one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.DepartureVoyage && one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ArrivalVoyage) ? one_three_OrdGeneralCtrl.ePage.Masters.IsDisable = false: one_three_OrdGeneralCtrl.ePage.Masters.IsDisable = true;
        }

        function GetPacksList() {
            // Get Packs
            var _inputPacks = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPacks).then(function (response) {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta.MstPackType.ListSource = response.data.Response;
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
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Meta[obj].ListSource = response.data.Response;
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
                                one_three_OrdGeneralCtrl.ePage.Masters[org] = {};
                                one_three_OrdGeneralCtrl.ePage.Masters[org][org + 'Add'] = val.Address1 + ' ' + val.City + ' ' + val.State + ' ' + val.PostCode + ' ' + val.RelatedPortCode;
                            }
                        });
                    });
                }
            });
        }
        // ----------------------------------- Init Container-----------------------------------
        function InitContainer() {
            one_three_OrdGeneralCtrl.ePage.Masters.formView = {};
            one_three_OrdGeneralCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            one_three_OrdGeneralCtrl.ePage.Masters.AddNew = AddNew;
            one_three_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
        }

        function SelectedGridRow(data, action, index) {
            if (action == 'edit') {
                one_three_OrdGeneralCtrl.ePage.Masters.formView = data;
                one_three_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Update"
            } else {
                if (data.PK == undefined) {
                    one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer_Forwarder.splice(index, 1)
                } else {
                    var r = confirm("Are You Sure Want To Delete?");
                    if (r == true) {
                        apiService.get("eAxisAPI", one_three_OrdGeneralCtrl.ePage.Entities.Container.API.Delete.Url + data.PK).then(function (response) {
                            if (response.data.Status == 'Success') {
                                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer_Forwarder.splice(index, 1)
                            }
                        });
                    }
                }
            }

        }

        function AddNew(item, action) {
            if (action == 'Add New') {
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer_Forwarder.push(item);
                one_three_OrdGeneralCtrl.ePage.Masters.formView = {};
            } else {
                var _index = one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer_Forwarder.indexOf(item);
                one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrderContainer_Buyer_Forwarder[_index] = item;
                one_three_OrdGeneralCtrl.ePage.Masters.formView = {};
                one_three_OrdGeneralCtrl.ePage.Masters.IsButtonAdd = "Add New";
            }
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            one_three_OrdGeneralCtrl.ePage.Masters.GetBatchDetails = GetBatchDetails;
            one_three_OrdGeneralCtrl.ePage.Masters.OnSelectBatchNo = OnSelectBatchNo;
            (one_three_OrdGeneralCtrl.currentOrder.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetBatchDetails(viewValue) {
            one_three_OrdGeneralCtrl.ePage.Masters.NoRecords = false;
            one_three_OrdGeneralCtrl.ePage.Masters.IsLoading = true;
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
                        one_three_OrdGeneralCtrl.ePage.Masters.NoRecords = false;
                        one_three_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        one_three_OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                        one_three_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                    }
                } else {
                    one_three_OrdGeneralCtrl.ePage.Masters.NoRecords = true;
                    one_three_OrdGeneralCtrl.ePage.Masters.IsLoading = false;
                }
                return response.data.Response;
            });
        }

        function OnSelectBatchNo(item) {
            one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.POB_FK = item.PK;
            one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.BatchUploadNo = item.BatchUploadNo;
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            one_three_OrdGeneralCtrl.ePage.Masters.DynamicControl = undefined;
            // if (mode == "ORG") {
            //     var _filter = {
            //         DataEntryName: "BPOrderHeaderCustomOrg",
            //         IsRoleBased: false,
            //         IsAccessBased: false,
            //         OrganizationCode: one_three_OrdGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Buyer
            //     };
            // } else {
            var _filter = {
                DataEntryName: "BPOrderHeaderCustomOrg"
            };
            // }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response)
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    one_three_OrdGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
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
                GroupCode: "BUY_CS_ORD_TRANS",
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