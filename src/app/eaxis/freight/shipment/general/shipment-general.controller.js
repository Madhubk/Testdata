(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GeneralController", GeneralController);

    GeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function GeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var GeneralCtrl = this;
        var shipmentConfig = $injector.get("shipmentConfig");

        function Init() {
            var currentShipment = GeneralCtrl.currentShipment[GeneralCtrl.currentShipment.label].ePage.Entities;
            GeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment,
            };
            GeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            GeneralCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            GeneralCtrl.ePage.Masters.IsETADisable = false;
            GeneralCtrl.ePage.Masters.isTransportModedisable = false;
            GeneralCtrl.ePage.Masters.isTransportMode = true;
            GeneralCtrl.ePage.Masters.isHBLKey = false;
            GeneralCtrl.ePage.Masters.IsContactEnable = true;
            GeneralCtrl.ePage.Masters.IsContactEnable1 = true;
            GeneralCtrl.ePage.Masters.IsContactEnable2 = true;
            GeneralCtrl.ePage.Masters.ETDChange = ETDChange;

            GeneralCtrl.ePage.Masters.PortOfLoadingAlert = PortOfLoadingAlert;
            GeneralCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Shipment.Entity[GeneralCtrl.currentShipment.code].GlobalErrorWarningList;
            GeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Shipment.Entity[GeneralCtrl.currentShipment.code];
            // DatePicker
            GeneralCtrl.ePage.Masters.DatePicker = {};
            GeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            GeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            GeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GeneralCtrl.ePage.Masters.getOrgBuyerSupplierMapping = getOrgBuyerSupplierMapping;

            GeneralCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;
            GeneralCtrl.ePage.Masters.IsDomestic = IsDomestic;
            GeneralCtrl.ePage.Masters.OnIncotermChange = OnIncotermChange;

            GeneralCtrl.ePage.Masters.ConsignorFilter = {
                "IsConsignor": true
            }
            GeneralCtrl.ePage.Masters.ConsigneeFilter = {
                "IsConsignee": true
            }
            GeneralCtrl.ePage.Masters.AgentFilter = {
                "IsForwarder": true
            }

            // Callback
            var _isEmpty = angular.equals({}, GeneralCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }

            GeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = {}
            if (!GeneralCtrl.currentShipment.isNew) {
                GeneralCtrl.ePage.Masters.IsETADisable = false;
                GeneralCtrl.ePage.Masters.isTransportMode = true;
                GeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj.EntryType = "PMT"
            } else {
                if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETD == null)
                    GeneralCtrl.ePage.Masters.IsETADisable = true;
                else
                    GeneralCtrl.ePage.Masters.IsETADisable = false;
                if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == null) {
                    GeneralCtrl.ePage.Masters.isTransportMode = true;
                }
                else {
                    GeneralCtrl.ePage.Masters.isTransportMode = false;
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
                "SupplierCode": GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    if (GeneralCtrl.currentShipment.isNew) {
                        var tempBuyObj = GeneralCtrl.ePage.Masters.OrgBuyerDetails[0];
                        OnSelectBuyer(tempBuyObj);
                    }
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                GeneralCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                GeneralCtrl.ePage.Masters.Buyer = $item;
                var _input = GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK

                apiService.get("eAxisAPI", appConfig.Entities.OrgHeader.API.GetById.Url + _input).then(function (response) {
                    if (response.data.Response) {
                        $item = response.data.Response;
                        AddressContactList($item, 'CED', 'CEG');
                        GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.OAD_RelatedPortCode;
                        getMDMDefaulvalues();

                    }
                    else {
                        GeneralCtrl.ePage.Masters.ConsigneeAddressType = [];
                        GeneralCtrl.ePage.Masters.ConsigneeContact = [];
                        GeneralCtrl.ePage.Masters.ConsigneeAddress = "";
                        GeneralCtrl.ePage.Masters.ConsigneeContactDetails = "";
                        GeneralCtrl.ePage.Masters.buyerName = "";
                        GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = ""
                    }

                });
                //     var defaultAddress = GetOrgAddress($item, 'Consignee');
                //     defaultAddress.then(function (res) {
                //         if (res.length > 0) {
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].Country;
                //             var tempAddrObj = _.filter(res, {
                //                 'PK': GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK
                //             })[0];
                //             GeneralCtrl.ePage.Masters.ConsigneeAddressType = tempAddrObj
                //             GeneralCtrl.ePage.Masters.ConsigneeAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                //             if (tempAddrObj) {
                //                 GeneralCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                //                 GeneralCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                //             }
                //         } else {
                //             GeneralCtrl.ePage.Masters.ConsigneeAddress = "";
                //         }
                //     });
                //     var defaultContact = GetOrgContact($item, 'Consignee');
                //     defaultContact.then(function (res) {
                //         if (res.length > 0) {
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                //             GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                //             var tempContactObj = _.filter(res, {
                //                 'PK': GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK
                //             })[0];
                //             GeneralCtrl.ePage.Masters.ConsigneeContact = tempContactObj
                //             GeneralCtrl.ePage.Masters.ConsigneeContactDetails = tempContactObj.Title + "\n" + tempContactObj.Email + "\n" + tempContactObj.Phone
                //             if (tempContactObj) {
                //                 GeneralCtrl.ePage.Masters.ConsigneeContact = res[0];
                //                 GeneralCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                //             }
                //         } else {
                //             GeneralCtrl.ePage.Masters.ConsigneeContactDetails = "";
                //         }
                //     });
                // } else {
                //     GeneralCtrl.ePage.Masters.ConsigneeAddressType = [];
                //     GeneralCtrl.ePage.Masters.ConsigneeContact = [];
                //     GeneralCtrl.ePage.Masters.ConsigneeAddress = "";
                //     GeneralCtrl.ePage.Masters.ConsigneeContactDetails = "";
                //     GeneralCtrl.ePage.Masters.buyerName = "";
                //     GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = ""
                // }
                // if (GeneralCtrl.currentShipment.isNew) {
                //     GeneralCtrl.ePage.Entities.Header.Data.UIOrderHeaders = []
                // }
                OnFieldValueChange('E0032')
                // GeneralCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false);
            }
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            GeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetJobEntryDetails() {
            GeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                if (value.Category === "CUS") {
                    GeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                }
            });
        }

        function ETDChange() {
            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETD == null)
                GeneralCtrl.ePage.Masters.IsETADisable = true;
            else
                GeneralCtrl.ePage.Masters.IsETADisable = false;
        }

        // function ModeChange(obj) {

        //     if (obj) {
        //         GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
        //         GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
        //     } else {
        //         GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null;
        //         GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null;
        //     }
        //     if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "AIR")
        //         GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "NON";
        //     else
        //         GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = null;
        //     OnFieldValueChange('E0002');
        // }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["SHPTYPE", "SHP_TRANSTYPE", "SHP_CNTMODE", "CNT_DELIVERYMODE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ENTRYDETAILS", "RELEASETYPE", "AIRWAY", "HOUSEBILL", "ONBOARD", "CHARGEAPLY", "DROP_MODE", "HEIGHTUNIT", "PERIODTYPE", "USAGES", "PROFITANDLOSSRESON", "BILLSTATUS", "COMT_DESC", "COMT_Visibility", "COMT_Module", "COMT_Direction", "COMT_Frieght", "SERVICETYPE", "REFNUMTYPE", "ROUTEMODE", "ROUTESTATUS", "JOBADDR", "SHIPPERCOD", "SHP_PAYMENT"];
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
                        GeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Country = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = response.data.Response;

                    GeneralCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    GeneralCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });

            // Get Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
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
                    GeneralCtrl.ePage.Masters.DropDownMasterList.DocumentType = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.DocumentType.ListSource = response.data.Response;
                }
            });
        }

        function OnTransportChange() {
            GeneralCtrl.ePage.Masters.isHBLKey = false;
            GeneralCtrl.ePage.Masters.isTransportMode = false;
            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "AIR") {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "NON";
            } else {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "SHW";
            }

            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode !== "AIR") {
                GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PrintOptionForPackagesOnAWB = null;
            }

            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "AIR") {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = null;
                GeneralCtrl.ePage.Masters.isHBLKey = true;
            }
            else if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "SEA") {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = "IAU"
            } else {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = null;
            }
            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode == '' || GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode == undefined) {
                OnFieldValueChange('E1107')
            }
        }

        function OnWeightChange() {
            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Chargeable = GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Weight;
        }

        // ===================== Shipment Header Begin =====================

        function InitShipmentHeader() {
            GeneralCtrl.ePage.Masters.Address = {};
            GeneralCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            GeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            GeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            GeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            GeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            // GeneralCtrl.ePage.Masters.modeChange = ModeChange;
            GeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            GeneralCtrl.ePage.Masters.OnTransportChange = OnTransportChange;
            GeneralCtrl.ePage.Masters.OnWeightChange = OnWeightChange;
            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookedDate == null) {
                $scope.date = new Date();
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookedDate = $scope.date;
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
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.data.entity.OAD_RelatedPortCode;
                getOrgBuyerSupplierMapping();
                OnFieldValueChange('E0031');
            }
            if (addressType == 'CED') {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.data.entity.OAD_RelatedPortCode
                if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin && GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination) {
                    IsDomestic(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin, GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination)
                }
                OnFieldValueChange('E0032');
            }
            if (type == 'portOfLoading') {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = $item.data.entity.Code;
            }
            if (type == 'portOfDischarge') {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = $item.data.entity.Code;
            }
            getMDMDefaulvalues();
        }

        function AutoCompleteOnSelect($item, type, type1, addressType, addressType1) {
            // GeneralCtrl.ePage.Masters.enable =true;
            if ($item.Code != null) {
                if (type === "address") {
                    AddressContactList($item, addressType, addressType1);
                }
                if (type1 === "contact") {
                    AddressContactList($item, addressType, addressType1);
                }
                if (addressType == 'CRD') {
                    GeneralCtrl.ePage.Masters.IsContactEnable = true;
                    GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.OAD_RelatedPortCode
                    GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
                    GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
                    getOrgBuyerSupplierMapping();
                }
                if (addressType == 'CED') {
                    GeneralCtrl.ePage.Masters.IsContactEnable1 = true;
                    GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.OAD_RelatedPortCode
                    GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.PK
                    GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.Code
                    if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin && GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination) {
                        IsDomestic(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin, GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination)
                    }
                    getMDMDefaulvalues();
                }
                if (addressType == 'NPP') {
                    GeneralCtrl.ePage.Masters.IsContactEnable2 = true;
                }
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
                return GeneralCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
            });
        }

        function getMDMDefaulvalues() {
            if (GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code && GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK + '/' + GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                            // if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode) {
                            //     var obj = _.filter(GeneralCtrl.ePage.Masters.CfxTypesList.CntType, {
                            //         'Key': GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                            //     })[0];
                            //     GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                            //     GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                            // } else {
                            //     var obj = _.filter(GeneralCtrl.ePage.Masters.CfxTypesList.CntType, {
                            //         'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                            //     })[0];
                            //     GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                            //     GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                            // }
                            // GeneralCtrl.ePage.Masters.selectedMode = obj;
                            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                            OnIncotermChange();
                            // GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                            // GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].TransportMode;
                            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode;
                            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKGoodsValueCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency
                            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKInsuranceCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency

                        }
                    }
                });
            }
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                if ($item.Address1 == null || $item.Address1 == undefined) {
                    $item.Address1 = "";
                }
                if ($item.Address2 == undefined || $item.Address2 == null) {
                    $item.Address2 = "";
                }
                if ($item.Address1 || $item.Address2) {
                    str = $item.Address1 + " " + $item.Address2;
                    return str
                }
            }
            if ($item != undefined && type == "contact") {
                if ($item.CompanyNameOverride == null || $item.CompanyNameOverride == undefined) {
                    $item.CompanyNameOverride = "";
                }
                if ($item.Email == undefined || $item.Email == null) {
                    $item.Email = "";
                }
                if ($item.Phone == undefined || $item.Phone == null) {
                    $item.Phone = "";
                }
                if ($item.CompanyNameOverride || $item.Email || $item.Phone) {
                    str = $item.CompanyNameOverride + " " + $item.Email + " " + $item.Phone;
                    return str
                }

            }
            if ($item != undefined && type == "Contact") {
                if ($item.ContactName == undefined || $item.ContactName == null) {
                    $item.ContactName = "";
                }
                if ($item.Email == undefined || $item.Email == null) {
                    $item.Email = "";
                }
                if ($item.Phone == null || $item.Phone == undefined) {
                    $item.Phone = "";
                }
                if ($item.Phone || $item.Email || $item.ContactName) {
                    str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                    return str
                }
            }
            else {
                return str
            }
        }


        function AddressContactList($item, addressType, addressType1) {

            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList, addressType1);
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
            GeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                    if (addressType1) {
                        GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType1] = GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType];
                    }
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            GeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            GeneralCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                    if (addressType == 'CRD') {
                        GeneralCtrl.ePage.Masters.IsContactEnable = false;
                    }
                    if (addressType == 'CED') {
                        GeneralCtrl.ePage.Masters.IsContactEnable1 = false;
                    }
                    if (addressType == 'NPP') {
                        GeneralCtrl.ePage.Masters.IsContactEnable2 = false;
                    }

                }
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Shipment"],
                Code: [GeneralCtrl.currentShipment.code],
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
                EntityObject: GeneralCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        // ===================== Shipment Header End =====================

        // ===================== Package Details Begin =====================

        function InitPackageDetails() {
            // Package Details
            GeneralCtrl.ePage.Masters.Package = {};
            // GeneralCtrl.ePage.Masters.Package.gridConfig = GeneralCtrl.ePage.Entities.Package.Grid.GridConfig;
            // GeneralCtrl.ePage.Masters.Package.gridConfig._columnDef = GeneralCtrl.ePage.Entities.Package.Grid.ColumnDef;
            // GeneralCtrl.ePage.Masters.Package.IsSelected = false;
            // // GeneralCtrl.ePage.Masters.Package.IsFormView = true;
            // GeneralCtrl.ePage.Masters.Package.FormView = {};
            // // GeneralCtrl.ePage.Masters.Package.AddNewPackage = AddNewPackage;
            // GeneralCtrl.ePage.Masters.Package.EditPackage = EditPackage;
            // GeneralCtrl.ePage.Masters.Package.DeletePackage = DeletePackage;
            // GeneralCtrl.ePage.Masters.Package.DeleteConfirmation = DeleteConfirmation;
            // GeneralCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid;
            GeneralCtrl.ePage.Masters.Package.PackageModal = PackageModal;

            // GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';

            // GeneralCtrl.ePage.Masters.tabSelected = tabSelected;

            // GeneralCtrl.ePage.Masters.IsShowPackageDetails = false;

            // // Functions
            // GeneralCtrl.ePage.Masters.Package.PackageRowSelectionChanged = PackageRowSelectionChanged;

            if (GeneralCtrl.currentShipment.isNew) {
                GeneralCtrl.ePage.Masters.Package.GridData = [];
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBill = GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo;
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RS_NKServiceLevel = "STD"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfWeight = "KG"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.UnitOfVolume = "M3"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.OuterPackType = "PLT"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.InnerPackType = "CTN"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentType = "STD"
                GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PrintOptionForPackagesOnAWB = "DEF"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShippedOnBoard = "SHP"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillType = null;
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillCharges = "SHW"
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ReleaseType = "OBR"
            } else {
                GetPackageList();
            }
        }

        function GetPackageList() {
            var _filter = {
                SHP_FK: GeneralCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });
                    GetPackageDetails();
                    $rootScope.GetPackingDetails();
                }
            });
        }

        function GetPackageDetails() {
            var _gridData = [];
            GeneralCtrl.ePage.Masters.Package.GridData = undefined;
            GeneralCtrl.ePage.Masters.Package.FormView = {};
            GeneralCtrl.ePage.Masters.Package.IsSelected = false;
            $timeout(function () {
                if (GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "STD") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("PackageList is Empty");
                }

                GeneralCtrl.ePage.Masters.Package.GridData = _gridData;
            });
        }

        // function PackageRowSelectionChanged($item) {
        //     console.log($item)
        //     if ($item.isSelected) {
        //         GeneralCtrl.ePage.Masters.Package.SelectedRow = $item;
        //         GeneralCtrl.ePage.Masters.Package.IsSelected = true;
        //     } else {
        //         GeneralCtrl.ePage.Masters.Package.SelectedRow = undefined;
        //         GeneralCtrl.ePage.Masters.Package.IsSelected = false;
        //         GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
        //         GeneralCtrl.ePage.Masters.Package.FormView = {};
        //     }
        // }

        // function AddNewPackage() {
        //     GeneralCtrl.ePage.Masters.Package.FormView = {};
        //     // GeneralCtrl.ePage.Masters.Package.IsFormView = true;
        // }

        // function EditPackage() {
        //     // GeneralCtrl.ePage.Masters.Package.IsFormView = true;
        //     GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update';
        //     GeneralCtrl.ePage.Masters.Package.FormView = GeneralCtrl.ePage.Masters.Package.SelectedRow.entity;
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
        //     // GeneralCtrl.ePage.Masters.Package.IsFormView = false;
        //     GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         var _index = GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.indexOf(GeneralCtrl.ePage.Masters.Package.SelectedRow.entity);
        //         if (_index != -1) {
        //             GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(_index, 1);
        //         }
        //     });

        //     GetPackageDetails();
        //     toastr.success("Record Deleted Successfully...!");
        // }

        // function AddToPackageGrid(btn) {
        //     if (btn == 'Add New') {
        //         var _isEmpty = angular.equals(GeneralCtrl.ePage.Masters.Package.FormView, {});
        //         if (_isEmpty) {
        //             toastr.warning("Please fill the Details..")
        //         } else {
        //             var _index = GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //                 return value.PK;
        //             }).indexOf(GeneralCtrl.ePage.Masters.Package.FormView.PK);

        //             GeneralCtrl.ePage.Masters.Package.FormView.FreightMode = "STD";

        //             if (_index === -1) {
        //                 GeneralCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
        //                 GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(GeneralCtrl.ePage.Masters.Package.FormView);
        //                 GetPackageDetails();
        //             } else {
        //                 GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = GeneralCtrl.ePage.Masters.Package.FormView;
        //             }
        //         }
        //     } else {
        //         GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
        //         GeneralCtrl.ePage.Masters.Package.FormView = {}
        //         GeneralCtrl.ePage.Masters.Package.SelectedRow = undefined;
        //         GeneralCtrl.ePage.Masters.Package.IsSelected = false;
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
                templateUrl: "app/eAxis/freight/shipment/general/tabs/packing.html",
                controller: 'PackingModalController',
                controllerAs: "PackingModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentShipment": GeneralCtrl.currentShipment,
                            // "GridData": GeneralCtrl.ePage.Masters.Package.GridData
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) { }
            );
        }

        function GetContainerList() {
            var _consolePK = [];

            if (GeneralCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                GeneralCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
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
                                    var _isExist = GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
                                        return value3.ContainerNo === value2.ContainerNo;
                                    });

                                    if (!_isExist) {
                                        var _obj = {
                                            "ContainerNo": value2.ContainerNo,
                                            "CNT": value2.PK
                                        };
                                        GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                                    }
                                });
                            });
                        } else {
                            GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
                        }
                    }
                });
            } else {
                GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }

        function IsDomestic($item1, $item2) {
            if (shipmentConfig.PortsComparison($item1, $item2)) {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsDomestic = true;
            }
            else {
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsDomestic = false;
            }
        }

        function OnIncotermChange() {
            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "EXW" || GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "FAS" || GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "FOB" || GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm == "FCA")
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PrepaidCollect = "FRC";
            else
                GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PrepaidCollect = "FRP";
        }

        function PortOfLoadingAlert(_value, type) {
            if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode != null) {
                if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == 'SEA' && _value.HasSeaport == true) {
                }
                else if (GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == 'AIR' && _value.HasAirport == true) {
                }
                else {
                    Alert(_value, type);
                }
            }
            else {
                toastr.warning("Please Select Transport Mode")
            }
        }
        function Alert(_value, type) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                bodyText: 'Port is different from Transport mode'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {

                }, function () {
                    if (type == 'portOfLoading') {
                        GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = "";
                    }
                    if (type == 'portOfDischarge') {
                        GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = "";
                    }
                }
                );
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