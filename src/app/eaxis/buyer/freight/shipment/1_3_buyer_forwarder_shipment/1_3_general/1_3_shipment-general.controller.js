(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeShipmentGeneralController", oneThreeShipmentGeneralController);

    oneThreeShipmentGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function oneThreeShipmentGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var oneThreeShipmentGeneralCtrl = this;
        var three_shipmentConfig = $injector.get("three_shipmentConfig");

        function Init() {
            var currentShipment = oneThreeShipmentGeneralCtrl.currentShipment[oneThreeShipmentGeneralCtrl.currentShipment.label].ePage.Entities;
            oneThreeShipmentGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment,
            };
            oneThreeShipmentGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            oneThreeShipmentGeneralCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            oneThreeShipmentGeneralCtrl.ePage.Masters.IsETADisable = false;
            oneThreeShipmentGeneralCtrl.ePage.Masters.isTransportModedisable = false;
            oneThreeShipmentGeneralCtrl.ePage.Masters.isTransportMode = true;
            oneThreeShipmentGeneralCtrl.ePage.Masters.isHBLKey = false;
            oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable = true;
            oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable1 = true;
            oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable2 = true;
            oneThreeShipmentGeneralCtrl.ePage.Masters.ETDChange = ETDChange;

            oneThreeShipmentGeneralCtrl.ePage.Masters.PortOfLoadingAlert = PortOfLoadingAlert;
            oneThreeShipmentGeneralCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Shipment.Entity[oneThreeShipmentGeneralCtrl.currentShipment.code].GlobalErrorWarningList;
            oneThreeShipmentGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Shipment.Entity[oneThreeShipmentGeneralCtrl.currentShipment.code];
            // DatePicker
            oneThreeShipmentGeneralCtrl.ePage.Masters.DatePicker = {};
            oneThreeShipmentGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            oneThreeShipmentGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            oneThreeShipmentGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            oneThreeShipmentGeneralCtrl.ePage.Masters.getOrgBuyerSupplierMapping = getOrgBuyerSupplierMapping;

            oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList = three_shipmentConfig.Entities.Header.Meta;
            oneThreeShipmentGeneralCtrl.ePage.Masters.IsDomestic = IsDomestic;
            oneThreeShipmentGeneralCtrl.ePage.Masters.OnIncotermChange = OnIncotermChange;

            // Callback
            var _isEmpty = angular.equals({}, oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }

            oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = {}
            if (oneThreeShipmentGeneralCtrl.currentShipment.isNew) {
                oneThreeShipmentGeneralCtrl.ePage.Masters.IsETADisable = true;
                oneThreeShipmentGeneralCtrl.ePage.Masters.isTransportMode = true;
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj.EntryType = "PMT"
            } else {
                if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETD == null)
                    oneThreeShipmentGeneralCtrl.ePage.Masters.IsETADisable = true;
                else
                    oneThreeShipmentGeneralCtrl.ePage.Masters.IsETADisable = false;
                if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == null) {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.isTransportMode = true;
                } else {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.isTransportMode = false;
                }
                // AssignDateToNewDateObject();
                GetJobEntryDetails();
            }

            InitShipmentHeader();
            InitPackageDetails();
            $rootScope.GetContainerList = GetContainerList;
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    if (!oneThreeShipmentGeneralCtrl.currentShipment.isNew) {
                        var tempBuyObj = _.filter(oneThreeShipmentGeneralCtrl.ePage.Masters.OrgBuyerDetails, {
                            'ORG_Buyer': oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                        })[0];
                        OnSelectBuyer(tempBuyObj);
                    }
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                oneThreeShipmentGeneralCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                oneThreeShipmentGeneralCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders()
                getMDMDefaulvalues()
                getMDMMiscService()
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].Country;
                        var tempAddrObj = _.filter(res, {
                            'PK': oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK
                        })[0];
                        oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeAddressType = tempAddrObj
                        oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                        if (tempAddrObj) {
                            oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                            oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                        }
                    } else {
                        oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        var tempContactObj = _.filter(res, {
                            'PK': oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK
                        })[0];
                        oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeContact = tempContactObj
                        oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeContactDetails = tempContactObj.Title + "\n" + tempContactObj.Email + "\n" + tempContactObj.Phone
                        if (tempContactObj) {
                            oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeContact = res[0];
                            oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                        }
                    } else {
                        oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeAddressType = [];
                oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeContact = [];
                oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeAddress = "";
                oneThreeShipmentGeneralCtrl.ePage.Masters.ConsigneeContactDetails = "";
                oneThreeShipmentGeneralCtrl.ePage.Masters.buyerName = "";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = ""
            }
            if (oneThreeShipmentGeneralCtrl.currentShipment.isNew) {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIOrderHeaders = []
            }
            OnFieldValueChange('E0032')
            // oneThreeShipmentGeneralCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            oneThreeShipmentGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetJobEntryDetails() {
            oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                if (value.Category === "CUS") {
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                }
            });
        }

        function ETDChange() {
            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETD == null)
                oneThreeShipmentGeneralCtrl.ePage.Masters.IsETADisable = true;
            else
                oneThreeShipmentGeneralCtrl.ePage.Masters.IsETADisable = false;
        }

        function ModeChange(obj) {
            if (obj) {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
            } else {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null;
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null;
            }
            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "AIR")
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "NON";
            else
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = null;
            OnFieldValueChange('E0002');
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["SHPTYPE", "SHP_TRANSTYPE", "SHP_CNTMODE", "CNT_DELIVERYMODE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ENTRYDETAILS", "RELEASETYPE", "AIRWAY", "HOUSEBILL", "ONBOARD", "CHARGEAPLY", "DROPMODE", "HEIGHTUNIT", "PERIODTYPE", "USAGES", "PROFITANDLOSSRESON", "BILLSTATUS", "COMT_DESC", "COMT_Visibility", "COMT_Module", "COMT_Direction", "COMT_Frieght", "SERVICETYPE", "REFNUMTYPE", "ROUTEMODE", "ROUTESTATUS", "JOBADDR", "SHIPPERCOD", "SHP_PAYMENT"];
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
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });


            // Get country
            var _inputCountry = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _inputCountry).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.Country = helperService.metaBase();
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = response.data.Response;

                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });

            // Get Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });

            // Document Type
            var _filter = {
                "DocType": "POD"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.DocumentType = helperService.metaBase();
                    oneThreeShipmentGeneralCtrl.ePage.Masters.DropDownMasterList.DocumentType.ListSource = response.data.Response;
                }
            });
        }

        function OnTransportChange() {
            oneThreeShipmentGeneralCtrl.ePage.Masters.isHBLKey = false;
            oneThreeShipmentGeneralCtrl.ePage.Masters.isTransportMode = false;
            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "AIR") {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "NON";
            } else {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "SHW";
            }

            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode !== "AIR") {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PrintOptionForPackagesOnAWB = "NULL";
            }

            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "AIR") {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = "NULL";
                oneThreeShipmentGeneralCtrl.ePage.Masters.isHBLKey = true;
            } else if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "SEA") {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = "IAU"
            } else {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = "NULL";
            }
        }

        function OnWeightChange() {
            oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Chargeable = oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Weight;
        }

        // ===================== Shipment Header Begin =====================

        function InitShipmentHeader() {
            oneThreeShipmentGeneralCtrl.ePage.Masters.Address = {};
            oneThreeShipmentGeneralCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            oneThreeShipmentGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            oneThreeShipmentGeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            oneThreeShipmentGeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            oneThreeShipmentGeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            oneThreeShipmentGeneralCtrl.ePage.Masters.modeChange = ModeChange;
            oneThreeShipmentGeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            oneThreeShipmentGeneralCtrl.ePage.Masters.OnTransportChange = OnTransportChange;
            oneThreeShipmentGeneralCtrl.ePage.Masters.OnWeightChange = OnWeightChange;
            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookedDate == null) {
                $scope.date = new Date();
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookedDate = $scope.date;
            }
        }

        function SelectedLookupData($item, type, type1, addressType, addressType1, code) {

            OnFieldValueChange(code);
            if (type == "address") {
                AddressContactList($item.data.entity, addressType, addressType1);
            }
            if (type1 == "contact") {
                AddressContactList($item.data.entity, addressType, addressType1);
            }
            if (addressType == 'CRD') {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.data.entity.OAD_RelatedPortCode
                OnFieldValueChange('E0031');
            }
            if (addressType == 'CED') {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.data.entity.OAD_RelatedPortCode
                if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin && oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination) {
                    IsDomestic(oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin, oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination)
                }
                OnFieldValueChange('E0032');
            }
            if (type == 'portOfLoading') {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = $item.data.entity.Code;
            }
            if (type == 'portOfDischarge') {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = $item.data.entity.Code;
            }

            getMDMDefaulvalues()
        }

        function AutoCompleteOnSelect($item, type, type1, addressType, addressType1) {
            // oneThreeShipmentGeneralCtrl.ePage.Masters.enable =true;
            if ($item.Code != null) {
                if (type === "address") {
                    AddressContactList($item, addressType, addressType1);
                }
                if (type1 === "contact") {
                    AddressContactList($item, addressType, addressType1);
                }
                if (addressType == 'CRD') {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable = true;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.OAD_RelatedPortCode
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
                    getOrgBuyerSupplierMapping();
                }
                if (addressType == 'CED') {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable1 = true;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.OAD_RelatedPortCode
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.PK
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.Code
                    if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin && oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination) {
                        IsDomestic(oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin, oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination)
                    }
                }
                if (addressType == 'NPP') {
                    oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable2 = true;
                }
                getMDMDefaulvalues()
            }
            OnFieldValueChange('E0031');
            OnFieldValueChange('E0032');
        }

        function GetOrgAddress(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.PK
            } else {
                _pk = item.ORG_Buyer
            }
            var _inputObj = {
                "ORG_FK": _pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                return oneThreeShipmentGeneralCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
            });
        }

        function getMDMDefaulvalues() {
            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code && oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK + '/' + oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode) {
                                    var obj = _.filter(oneThreeShipmentGeneralCtrl.ePage.Masters.CfxTypesList.CntType, {
                                        'Key': oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                                    })[0];
                                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                } else {
                                    var obj = _.filter(oneThreeShipmentGeneralCtrl.ePage.Masters.CfxTypesList.CntType, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                }
                                oneThreeShipmentGeneralCtrl.ePage.Masters.selectedMode = obj;
                                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                OnIncotermChange();
                                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKGoodsValueCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency
                                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKInsuranceCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency
                            }
                        }
                    }
                });
            }
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
            } else if ($item != undefined && type == "contact") {
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
            } else {
                return str
            }
        }

        function AddressContactList($item, addressType, addressType1) {

            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
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
            oneThreeShipmentGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    if (addressType1) {
                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType1] = oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType];
                    }
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            oneThreeShipmentGeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            oneThreeShipmentGeneralCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                    if (addressType == 'CRD') {
                        oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable = false;
                    }
                    if (addressType == 'CED') {
                        oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable1 = false;
                    }
                    if (addressType == 'NPP') {
                        oneThreeShipmentGeneralCtrl.ePage.Masters.IsContactEnable2 = false;
                    }

                }
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Shipment"],
                Code: [oneThreeShipmentGeneralCtrl.currentShipment.code],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: "SHP_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        // ===================== Shipment Header End =====================

        // ===================== Package Details Begin =====================

        function InitPackageDetails() {
            // Package Details
            oneThreeShipmentGeneralCtrl.ePage.Masters.Package = {};
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.gridConfig = oneThreeShipmentGeneralCtrl.ePage.Entities.Package.Grid.GridConfig;
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.gridConfig._columnDef = oneThreeShipmentGeneralCtrl.ePage.Entities.Package.Grid.ColumnDef;
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsSelected = false;
            // // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsFormView = true;
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView = {};
            // // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.AddNewPackage = AddNewPackage;
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.EditPackage = EditPackage;
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.DeletePackage = DeletePackage;
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.DeleteConfirmation = DeleteConfirmation;
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid;
            oneThreeShipmentGeneralCtrl.ePage.Masters.Package.PackageModal = PackageModal;

            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';

            // oneThreeShipmentGeneralCtrl.ePage.Masters.tabSelected = tabSelected;

            // oneThreeShipmentGeneralCtrl.ePage.Masters.IsShowPackageDetails = false;

            // // Functions
            // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.PackageRowSelectionChanged = PackageRowSelectionChanged;

            if (oneThreeShipmentGeneralCtrl.currentShipment.isNew) {
                oneThreeShipmentGeneralCtrl.ePage.Masters.Package.GridData = [];
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBill = oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo;
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RS_NKServiceLevel = "STD";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight = "KG";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume = "M3";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.OuterPackType = "PLT";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType = "CTN";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentType = "STD";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PrintOptionForPackagesOnAWB = "DEF";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShippedOnBoard = "SHP";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = "NULL";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "SHW";
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ReleaseType = "OBR";
            } else {
                GetPackageList();
            }
        }

        function GetPackageList() {
            var _filter = {
                SHP_FK: oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });
                    GetPackageDetails();
                    $rootScope.GetPackingDetails();
                }
            });
        }

        function GetPackageDetails() {
            var _gridData = [];
            oneThreeShipmentGeneralCtrl.ePage.Masters.Package.GridData = undefined;
            oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView = {};
            oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsSelected = false;
            $timeout(function () {
                if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "STD") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("PackageList is Empty");
                }

                oneThreeShipmentGeneralCtrl.ePage.Masters.Package.GridData = _gridData;
            });
        }

        // function PackageRowSelectionChanged($item) {
        //     console.log($item)
        //     if ($item.isSelected) {
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.SelectedRow = $item;
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsSelected = true;
        //     } else {
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.SelectedRow = undefined;
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsSelected = false;
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView = {};
        //     }
        // }

        // function AddNewPackage() {
        //     oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView = {};
        //     // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsFormView = true;
        // }

        // function EditPackage() {
        //     // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsFormView = true;
        //     oneThreeShipmentGeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update';
        //     oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView = oneThreeShipmentGeneralCtrl.ePage.Masters.Package.SelectedRow.entity;
        // }

        // function tabSelected(index, $event) {
        //     if (index != 1)
        //         $event.preventDefault();
        // }

        // function DeleteConfirmation() {
        //     var modalOptions = {
        //         closeButtonText: 'Cancel',
        //         actionButtonText: 'Ok',
        //         headerText: 'Delete?',
        //         bodyText: 'Are you sure?'
        //     };

        //     confirmation.showModal({}, modalOptions)
        //         .then(function (result) {
        //             DeletePackage();
        //         }, function () {
        //             console.log("Cancelled");
        //         });
        // }

        // function DeletePackage() {
        //     // oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsFormView = false;
        //     oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         var _index = oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.indexOf(oneThreeShipmentGeneralCtrl.ePage.Masters.Package.SelectedRow.entity);
        //         if (_index != -1) {
        //             oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(_index, 1);
        //         }
        //     });

        //     GetPackageDetails();
        //     toastr.success("Record Deleted Successfully...!");
        // }

        // function AddToPackageGrid(btn) {
        //     if (btn == 'Add New') {
        //         var _isEmpty = angular.equals(oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView, {});
        //         if (_isEmpty) {
        //             toastr.warning("Please fill the Details..")
        //         } else {
        //             var _index = oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //                 return value.PK;
        //             }).indexOf(oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView.PK);

        //             oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView.FreightMode = "STD";

        //             if (_index === -1) {
        //                 oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
        //                 oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView);
        //                 GetPackageDetails();
        //             } else {
        //                 oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView;
        //             }
        //         }
        //     } else {
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.FormView = {}
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.SelectedRow = undefined;
        //         oneThreeShipmentGeneralCtrl.ePage.Masters.Package.IsSelected = false;
        //     }
        // }

        function PackageModal() {

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "packing right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_general/tabs/packing.html",
                controller: 'oneThreePackingModalController',
                controllerAs: "oneThreePackingModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentShipment": oneThreeShipmentGeneralCtrl.currentShipment,
                            // "GridData": oneThreeShipmentGeneralCtrl.ePage.Masters.Package.GridData
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {}
            );
        }

        function GetContainerList() {
            var _consolePK = [];

            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                    _consolePK.push(value.PK);
                });

                var _input = {
                    "searchInput": [{
                        "FieldName": "CON_FKS",
                        "value": _consolePK.toString()
                    }],
                    "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            response.data.Response.map(function (value1, key1) {
                                value1.UICntContainerList.map(function (value2, key2) {
                                    var _isExist = oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
                                        return value3.ContainerNo === value2.ContainerNo;
                                    });

                                    if (!_isExist) {
                                        var _obj = {
                                            "ContainerNo": value2.ContainerNo,
                                            "CNT": value2.PK
                                        };
                                        oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                                    }
                                });
                            });
                        } else {
                            oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
                        }
                    }
                });
            } else {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }

        function IsDomestic($item1, $item2) {
            if (three_shipmentConfig.PortsComparison($item1, $item2)) {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsDomestic = true;
            } else {
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsDomestic = false;
            }
        }

        function OnIncotermChange() {
            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "EXW" || oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "FAS" || oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "FOB" || oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "FCA")
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PrepaidCollect = "FRC";
            else
                oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PrepaidCollect = "FRP";
        }

        function PortOfLoadingAlert(_value) {
            if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == 'SEA' && _value.HasSeaport == true) {} else if (oneThreeShipmentGeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == 'AIR' && _value.HasAirport == true) {} else {
                Alert(_value);
            }
        }

        function Alert(_value) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                bodyText: 'Port is different from Transport mode"'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {});
        }

        // ===================== Package Details End =====================

        Init();
    }

    angular
        .module("Application")
        .filter('shpcntmode', function () {
            return function (input, type) {
                var _list = [];
                if (input && type) {
                    var x = input.map(function (value, key) {
                        if (value.OtherConfig != "" && value.OtherConfig != undefined) {
                            var _input = JSON.parse(value.OtherConfig).mode
                            if (_input) {
                                var _index = _input.indexOf(type);
                                if (_index != -1) {
                                    _list.push(value)
                                }
                            }
                        }
                    });
                    return _list;
                }
            };
        });
})();