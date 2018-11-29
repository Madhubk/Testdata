(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SLIUploadDirectiveController", SLIUploadDirectiveController);

    SLIUploadDirectiveController.$inject = ["APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "SLIUploadConfig", "errorWarningService", "confirmation", "toastr"];

    function SLIUploadDirectiveController(APP_CONSTANT, authService, apiService, helperService, appConfig, SLIUploadConfig, errorWarningService, confirmation, toastr) {
        /* jshint validthis: true */
        var SLIUploadDirectiveCtrl = this;

        function Init() {
            var currentSli = SLIUploadDirectiveCtrl.currentSli[SLIUploadDirectiveCtrl.currentSli.label].ePage.Entities;
            SLIUploadDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SLI_Upload_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentSli,
            };

            InitSLI();
        }

        function InitSLI() {
            SLIUploadDirectiveCtrl.ePage.Masters.config = SLIUploadConfig;
            SLIUploadDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            SLIUploadDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.SLIUpload.Entity[SLIUploadDirectiveCtrl.currentSli.code].GlobalErrorWarningList;
            SLIUploadDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.SLIUpload.Entity[SLIUploadDirectiveCtrl.currentSli.code];
            // DatePicker
            SLIUploadDirectiveCtrl.ePage.Masters.DatePicker = {};
            SLIUploadDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SLIUploadDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SLIUploadDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitSLIFun();
        }

        function InitSLIFun() {
            // SLI file upload
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments = {};
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.ListSource = [];
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.Autherization = authService.getUserInfo().AuthToken;
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.UserId = authService.getUserInfo().UserId;
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.fileDetails = [];
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.fileCount = 0;
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.fileSize = 10;

            var _additionalValue = {
                "Entity": "Booking",
                "Path": SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + ",sli-upload"
            };
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.AdditionalValue = JSON.stringify(_additionalValue);
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.GetFileDetails = GetFileDetails;
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.SelectedGridRow = SelectedGridRow;
            SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.UploadedFiles = UploadedFiles;
            SLIUploadDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            SLIUploadDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            OrgInit();
            GetDocumentsTypeList();
            GetDocumentsDetails();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SLIUploadDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OrgInit() {
            SLIUploadDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            SLIUploadDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            SLIUploadDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            SLIUploadDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            SLIUploadDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;
            if (!SLIUploadDirectiveCtrl.currentSli.isNew) {
                var defaultOrg = Getfullorg(SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
                defaultOrg.then(function (val) {
                    OnSelectShipper(val[0]);
                });
            }
        }

        function Getfullorg(viewValue) {
            var _inputObj = {
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "Code": viewValue
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                return SLIUploadDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            SLIUploadDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            SLIUploadDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("SLIUpload", SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false);
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address1 = res[0].Address1;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].Country;
                    var tempAddrObj = _.filter(res, {
                        'PK': SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK
                    })[0];
                    SLIUploadDirectiveCtrl.ePage.Masters.ConsignorAddressType = tempAddrObj
                    SLIUploadDirectiveCtrl.ePage.Masters.ConsignorAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                    if (tempAddrObj) {
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0];
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                    }

                } else {
                    SLIUploadDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    var tempSupConObj = _.filter(res, {
                        'PK': SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK
                    })[0];
                    SLIUploadDirectiveCtrl.ePage.Masters.ConsignorContact = tempSupConObj;
                    SLIUploadDirectiveCtrl.ePage.Masters.ConsignorContactDetails = tempSupConObj.Title + "\n" + tempSupConObj.Email + "\n" + tempSupConObj.Phone;
                    if (tempSupConObj) {
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsignorContact = res[0];
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                    }
                } else {
                    SLIUploadDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SLIUploadDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    if (!SLIUploadDirectiveCtrl.currentSli.isNew) {
                        var tempBuyObj = _.filter(SLIUploadDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                            'ORG_Buyer': SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                        })[0];
                        OnSelectBuyer(tempBuyObj);
                    }
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                SLIUploadDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                SLIUploadDirectiveCtrl.ePage.Masters.Buyer = $item;
                getMDMDefaulvalues();
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].Country;
                        var tempAddrObj = _.filter(res, {
                            'PK': SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK
                        })[0];
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeAddressType = tempAddrObj
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                        if (tempAddrObj) {
                            SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                            SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                        }
                    } else {
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        var tempContactObj = _.filter(res, {
                            'PK': SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK
                        })[0];
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeContact = tempContactObj
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = tempContactObj.Title + "\n" + tempContactObj.Email + "\n" + tempContactObj.Phone
                        if (tempContactObj) {
                            SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0];
                            SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                        }
                    } else {
                        SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                SLIUploadDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                SLIUploadDirectiveCtrl.ePage.Masters.buyerName = "";
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = "";
            }
            if (SLIUploadDirectiveCtrl.currentSli.isNew) {
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = [];
            }
            SLIUploadDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("SLIUpload", SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false);
        }

        function getMDMDefaulvalues() {
            if (SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                            }
                        }
                    }
                });
            }
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
                return SLIUploadDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
            });
        }

        function GetOrgContact(item, type) {
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
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            }
            return apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                return SLIUploadDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                SLIUploadDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                SLIUploadDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                SLIUploadDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                SLIUploadDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                SLIUploadDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                SLIUploadDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function AutoCompleteOnSelect($item, model, code, IsArray) {
            SLIUploadDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("SLIUpload", SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            SLIUploadDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("SLIUpload", SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, $item.data.entity[val], code, IsArray);
        }
        // sli upload 
        function GetDocumentsDetails() {
            var _input = {
                "EntityRefKey": SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "SHP",
                "DocumentType": "SLI",
                "EntityRefCode": SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "Status": "Success"
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
                SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.List = response.data.Response;
                SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments = response.data.Response;
            });
        }

        function GetDocumentsTypeList() {
            var _filter = {
                "DocType": "SLI"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        SLIUploadDirectiveCtrl.ePage.Masters.DocTypeList = response.data.Response[0];
                    }
                } else {
                    SLIUploadDirectiveCtrl.ePage.Masters.DocTypeList = [];
                }
            });
        }

        function GetFileDetails(Files, DocType, mode) {
            Files.map(function (value, key) {
                var _obj = {
                    type: value.type,
                    FileName: value.name,
                    IsActive: true,
                    IsNew: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: value.Doc_PK,
                    EntitySource: "SHP",
                    DocumentType: SLIUploadDirectiveCtrl.ePage.Masters.DocTypeList.DocType,
                    DocumentName: SLIUploadDirectiveCtrl.ePage.Masters.DocTypeList.Desc,
                    PartyType_Code: SLIUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_Code,
                    PartyType_FK: SLIUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_FK,
                    Status: "Success",
                    EntityRefKey: SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.PK
                };
                SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.List.push(_obj);
            });
        }

        function UploadedFiles(Files, DocType, mode) {
            Files.map(function (value1, key1) {
                SLIUploadDirectiveCtrl.ePage.Masters.SLIDocuments.List.map(function (value2, key2) {
                    if (value1.FileName == value2.FileName && value1.DocType == value2.type) {
                        SaveDocument(value1, value2);
                    }
                });
            });
        }

        function SaveDocument($item, row) {
            var _input = {};
            if ($item) {
                var _index = $item.FileName.indexOf(".");
                if (_index != -1) {
                    var _object = $item.FileName.split(".")[0];
                }
                var _input = {
                    FileName: $item.FileName,
                    FileExtension: $item.FileExtension,
                    ContentType: $item.DocType,
                    IsActive: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: $item.Doc_PK,
                    EntitySource: 'SHP',
                    EntityRefKey: SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                    EntityRefCode: SLIUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    DocumentName: _object,
                    PartyType_Code: row.PartyType_Code,
                    PartyType_FK: row.PartyType_FK,
                    DocumentType: row.DocumentType,
                    Status: "Success"
                };
            }
            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    GetDocumentsDetails();
                } else {
                    console.log("Empty Documents Response");
                }
            });
            row.IsNew = false;
        }

        function SelectedGridRow($item, action) {
            if (action === "download") {
                DownloadDocument($item);
            } else if (action === "delete") {
                Confirmation($item);
            }
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DMSDownload.Url + "/" + curDoc.DocFK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function Confirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Close?',
                bodyText: 'Do you want to delete the document(s)?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDocument($item)
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDocument(curDoc) {
            curDoc.IsActive = false;
            curDoc.IsDeleted = true;
            curDoc.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [curDoc]).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Document successfully deleted...");
                    GetDocumentsDetails();
                } else {
                    toastr.success("Document delete failed...");
                }
            });
        }

        Init();
    }
})();