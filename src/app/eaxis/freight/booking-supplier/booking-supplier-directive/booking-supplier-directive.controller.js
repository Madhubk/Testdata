(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingSupplierDirectiveController", BookingSupplierDirectiveController);

    BookingSupplierDirectiveController.$inject = ["$rootScope", "$scope", "$window", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "BookingSupplierConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function BookingSupplierDirectiveController($rootScope, $scope, $window, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, BookingSupplierConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var BookingSupplierDirectiveCtrl = this;

        function Init() {
            var currentBooking = BookingSupplierDirectiveCtrl.currentBooking[BookingSupplierDirectiveCtrl.currentBooking.label].ePage.Entities;
            BookingSupplierDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
             BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService
            BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.BookingSupplier.Entity[BookingSupplierDirectiveCtrl.currentBooking.code];
             BookingSupplierDirectiveCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange
            // DatePicker
            GetGridConfig()
            BookingSupplierDirectiveCtrl.ePage.Masters.DatePicker = {};
            BookingSupplierDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            BookingSupplierDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            BookingSupplierDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrgInit();
            cfxTypeList();
            cfxContainerType()
            getPackType();
            getAttachedOrders()
            getServices();
            // getContainers();
            // getPackLines();
            // getJobSailing();
            // getDocuments();
            StandardMenuConfig()
            BookingSupplierDirectiveCtrl.ePage.Masters.modeChange = ModeChange;
            BookingSupplierDirectiveCtrl.ePage.Masters.config = BookingSupplierConfig;
            BookingSupplierDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            BookingSupplierDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            BookingSupplierDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem
            BookingSupplierDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView
            BookingSupplierDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder
            //Container
            // BookingSupplierDirectiveCtrl.ePage.Masters.CntObj = {};
            // BookingSupplierDirectiveCtrl.ePage.Masters.addContainer = AddContainer;
            // BookingSupplierDirectiveCtrl.ePage.Masters.deleteContainer = DeleteContainer;
            // //Packlines
            // BookingSupplierDirectiveCtrl.ePage.Masters.PackObj = {};
            // BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.JobLocation = [];
            // BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.PkgCntMapping = [];
            // BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.JobDangerousGoods = [];
            // BookingSupplierDirectiveCtrl.ePage.Masters.packageAdd = PackageAdd;
            // BookingSupplierDirectiveCtrl.ePage.Masters.deletePackage = DeletePackage;
            BookingSupplierDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            BookingSupplierDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function StandardMenuConfig() {
            BookingSupplierDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "EntitySource": "SHP",
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
            BookingSupplierDirectiveCtrl.ePage.Masters.ContainerHeader = {
                "HeaderProperties": [{
                        "columnname": "Container Count",
                        "isenabled": true,
                        "property": "containercount",
                        "position": "1",
                        "width": "300",
                        "display": false
                    },
                    {
                        "columnname": "Container Type",
                        "isenabled": true,
                        "property": "containertype",
                        "position": "2",
                        "width": "300",
                        "display": false
                    },
                    {
                        "columnname": "Commodity",
                        "isenabled": true,
                        "property": "Commodity",
                        "position": "3",
                        "width": "300",
                        "display": false
                    }
                ],
                "containercount": {
                    "isenabled": true,
                    "position": "1",
                    "width": "300"
                },
                "containertype": {
                    "isenabled": true,
                    "position": "2",
                    "width": "300"
                },
                "Commodity": {
                    "isenabled": true,
                    "position": "3",
                    "width": "300"
                }
            };
            BookingSupplierDirectiveCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                // IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };
        }

        function cfxTypeList() {
            BookingSupplierDirectiveCtrl.ePage.Masters.cfxTypeList = {}
            var typeCodeList = ["INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "HEIGHTUNIT", "FREIGHTTERMS"];
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
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                typeCodeList.map(function (value, key) {
                    BookingSupplierDirectiveCtrl.ePage.Masters.cfxTypeList[value] = response.data.Response[value];
                });
            });

        }

        function cfxContainerType() {
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    BookingSupplierDirectiveCtrl.ePage.Masters.cfxTypeList.CntType = response.data.Response
                    var obj = _.filter(BookingSupplierDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                        'Key': BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    BookingSupplierDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        function ModeChange(obj) {
            if (obj) {
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm();
            OnFieldValueChange()
            //  BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('BookingSupplier',  BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,  BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode, 'E0002', false)
        }

        function getPackType() {
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    BookingSupplierDirectiveCtrl.ePage.Masters.cfxTypeList.PackType = response.data.Response;
                }
            });
        }

        function OrgInit() {
            BookingSupplierDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            BookingSupplierDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            BookingSupplierDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            BookingSupplierDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            BookingSupplierDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;
            if (!BookingSupplierDirectiveCtrl.currentBooking.isNew) {
                var defaultOrg = Getfullorg(BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
                defaultOrg.then(function (val) {
                    OnSelectShipper(val[0])
                    getOpenOrders()
                });
            } else {
                var defaultOrg = Getfullorg();
                defaultOrg.then(function (val) {
                    OnSelectShipper(val[0])
                });
                BookingSupplierDirectiveCtrl.ePage.Masters.IsNoRecords = true
            }
        }

        function Getfullorg(viewValue) {
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgUserAcess.API.FindAll.FilterID,
            };
            return apiService.post("eAxisAPI", appConfig.Entities.OrgUserAcess.API.FindAll.Url, _input).then(function (response) {
                BookingSupplierDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
                if (!BookingSupplierDirectiveCtrl.currentBooking.isNew) {
                    var tempAddrObj = _.filter(BookingSupplierDirectiveCtrl.ePage.Masters.OrgDetails, {
                        'ORG_Code': viewValue
                    });
                    return tempAddrObj;

                } else {
                    return BookingSupplierDirectiveCtrl.ePage.Masters.OrgDetails
                }
            });
        }

        function OnSelectShipper($item, $model, $label) {
            BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.ORG_Code;
            BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.ROLE_FK;
            BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.ORG_Code;
            BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.ROLE_FK;
            BookingSupplierDirectiveCtrl.ePage.Masters.shipperName = $item.ORG_FullName;
            OnFieldValueChange('E0031');
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address1 = res[0].Address1;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].Country;
                    var tempAddrObj = _.filter(res, {
                        'PK': BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK
                    })[0];
                    BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorAddressType = tempAddrObj
                    BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                    if (tempAddrObj) {
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0];
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                    }

                } else {
                    BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    var tempSupConObj = _.filter(res, {
                        'PK': BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK
                    })[0];
                    BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorContact = tempSupConObj;
                    BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorContactDetails = tempSupConObj.Title + "\n" + tempSupConObj.Email + "\n" + tempSupConObj.Phone;
                    if (tempSupConObj) {
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorContact = res[0];
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                    }
                } else {
                    BookingSupplierDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingSupplierDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    if (!BookingSupplierDirectiveCtrl.currentBooking.isNew) {
                        var tempBuyObj = _.filter(BookingSupplierDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                            'ORG_Buyer': BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                        })[0];
                        OnSelectBuyer(tempBuyObj)
                    }
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                BookingSupplierDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                BookingSupplierDirectiveCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders()
                getMDMDefaulvalues()
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].Country;
                        var tempAddrObj = _.filter(res, {
                            'PK': BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK
                        })[0];
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeAddressType = tempAddrObj
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                        if (tempAddrObj) {
                            BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                            BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                        }
                    } else {
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        var tempContactObj = _.filter(res, {
                            'PK': BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK
                        })[0];
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeContact = tempContactObj
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = tempContactObj.Title + "\n" + tempContactObj.Email + "\n" + tempContactObj.Phone
                        if (tempContactObj) {
                            BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0];
                            BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                        }
                    } else {
                        BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                BookingSupplierDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                BookingSupplierDirectiveCtrl.ePage.Masters.buyerName = "";
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = ""
            }
            if (BookingSupplierDirectiveCtrl.currentBooking.isNew) {
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = []
            }
            OnFieldValueChange('E0032')
            //  BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier",  BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,  BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false);

        }

        function getMDMDefaulvalues() {
            if (BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            BookingSupplierDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                            if (BookingSupplierDirectiveCtrl.currentBooking.isNew) {
                                if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                    var obj = _.filter(BookingSupplierDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    BookingSupplierDirectiveCtrl.ePage.Masters.selectedMode = obj;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                    OnFieldValueChange()
                                }
                            }
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (BookingSupplierDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(BookingSupplierDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;
                    OnFieldValueChange()
                }
            }
        }

        function GetOrgAddress(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.ROLE_FK
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
                return BookingSupplierDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
            });
        }

        function GetOrgContact(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.ROLE_FK
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
                return BookingSupplierDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                BookingSupplierDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                BookingSupplierDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                BookingSupplierDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                BookingSupplierDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                BookingSupplierDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                BookingSupplierDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getServices() {
            BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            if (!BookingSupplierDirectiveCtrl.currentBooking.isNew) {
                apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                    if (response.data.Response) {
                        BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                        if (BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                            for (var i in BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes) {
                                var tempObj = _.filter(BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                    'ServiceCode': BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i]
                                })[0];
                                if (tempObj == undefined) {
                                    BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                                } else {
                                    BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                                }
                            }
                        } else {
                            for (var i in BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes) {
                                BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                            }
                        }
                    }
                });
            } else {
                for (var i in BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes) {
                    BookingSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                }
            }

        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices[_index].IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function getAttachedOrders() {
            var _inputObj = {
                "SHP_FK": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100,
            };
            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response
                }
            });
        }

        // function getContainers() {

        //     var _inputObj = {
        //         "BookingOnlyLink": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //     };
        //     var _input = {
        //         "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_inputObj)
        //     };
        //     apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response
        //         }
        //     });
        // }


        // function AddContainer() {
        //     ContainerValidation()
        //     if (BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer.length == 0) {
        //         BookingSupplierDirectiveCtrl.ePage.Masters.CntObj.SHP_BookingOnlyLink = BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         BookingSupplierDirectiveCtrl.ePage.Masters.CntObj.IsDeleted = false
        //         BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.push(BookingSupplierDirectiveCtrl.ePage.Masters.CntObj);
        //         BookingSupplierDirectiveCtrl.ePage.Masters.CntObj = {};
        //     }
        // }

        // function ContainerValidation() {

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Container', BookingSupplierDirectiveCtrl.ePage.Masters.CntObj.ContainerCount, 'E0008', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Container', BookingSupplierDirectiveCtrl.ePage.Masters.CntObj.RC_Type, 'E0009', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Container', BookingSupplierDirectiveCtrl.ePage.Masters.CntObj.RH_NKContainerCommodityCode, 'E0010', false);
        // }

        // function DeleteContainer(item, index) {
        //     var _index = BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index !== -1) {
        //         BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.splice(index, 1);
        //     } else {
        //         BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer[index].IsDeleted = true
        //     }
        // }

        // function getPackLines() {

        //     var _inputObj = {
        //         "SHP_FK": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.PK
        //     };
        //     var _input = {
        //         "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_inputObj)
        //     };
        //     apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
        //         }
        //     });
        // }


        // function PackageAdd() {
        //     PackageValidation()
        //     if (BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage == 0) {
        //         BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.SHP_FK = BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.FreightMode = 'OUT';
        //         BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.IsDeleted = false
        //         BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(BookingSupplierDirectiveCtrl.ePage.Masters.PackObj);
        //         BookingSupplierDirectiveCtrl.ePage.Masters.PackObj = {};
        //     }
        // }

        // function PackageValidation() {

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.PackageCount, 'E0011', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.F3_NKPackType, 'E0012', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.ActualWeight, 'E0013', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.ActualWeightUQ, 'E0014', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.ActualVolume, 'E0015', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.ActualVolumeUQ, 'E0016', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.Length, 'E0017', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.Width, 'E0018', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.Height, 'E0019', false);

        //     BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier", BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingSupplierDirectiveCtrl.ePage.Masters.PackObj.UnitOfDimension, 'E0020', false);

        // }

        // function DeletePackage(item, index) {
        //     var _index = BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index !== -1) {
        //         BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
        //     } else {
        //         BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines[index].IsDeleted = true
        //     }
        // }
        function getOpenOrders() {
            BookingSupplierDirectiveCtrl.ePage.Masters.paginationOptions = {
                "IsShpCreated": "false",
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "Buyer": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                "Supplier": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            };
            GetGridConfig();
            getDataAsynPage(BookingSupplierDirectiveCtrl.ePage.Masters.paginationOptions)
        }

        function GetGridConfig() {
            BookingSupplierDirectiveCtrl.ePage.Masters.column = [

                {
                    "field": "OrderNo",
                    "displayName": "Open POs",
                    "width": 135,
                },
                {
                    "field": "OrderDate",
                    "displayName": "PO Date",
                    "width": 70,
                    cellTemplate: "<div class='padding-5'><span  title='{{row.entity.OrderDate}}' >{{row.entity.OrderDate | date:'dd-MMM-yy'}}</span></div>"
                },

                {
                    "field": "GoodsAvailableAt",
                    "displayName": "Origin",
                    "width": 65,
                    // cellTemplate: "<div class='gridCellStyle'><span  title='{{row.entity.GoodsOrigin}}' >{{row.entity.GoodsOrigin}}</span></div>"
                },
                {
                    "field": "GoodsDeliveredTo",
                    "displayName": "Dstn.",
                    "width": 65,
                    // cellTemplate: "<div class='gridCellStyle'><span  title='{{row.entity.GoodsDestination}}' >{{row.entity.GoodsDestination}}</span></div>"
                },
                {
                    "field": "GoodsDeliveredTo",
                    "displayName": "Attach.",
                    "width": 50,
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.BookingSupplierDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            BookingSupplierDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: BookingSupplierDirectiveCtrl.ePage.Masters.column,
                data: BookingSupplierDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            BookingSupplierDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            BookingSupplierDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            BookingSupplierDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        BookingSupplierDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(BookingSupplierDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {

            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            BookingSupplierDirectiveCtrl.ePage.Masters.gridOptions.data = []
            BookingSupplierDirectiveCtrl.ePage.Masters.IsLoading = true
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data) {
                    BookingSupplierDirectiveCtrl.ePage.Masters.data = response.data.Response
                    if (BookingSupplierDirectiveCtrl.ePage.Masters.data.length === 0) {
                        BookingSupplierDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        BookingSupplierDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    BookingSupplierDirectiveCtrl.ePage.Masters.data = [];
                    BookingSupplierDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                BookingSupplierDirectiveCtrl.ePage.Masters.IsLoading = false
                GetGridConfig()
            });
        }
        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data,
                "order": BookingSupplierDirectiveCtrl.ePage.Masters.data,
                "edit": bool
            }
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',
                windowClass: 'orderLineItem',
                templateUrl: 'app/eaxis/freight/booking-branch/booking-branch-directive/tabs/orderline-popup.html',
                controller: 'OrderLinePopupController',
                controllerAs: 'OrderLinePopupCtrl',
                resolve: {
                    items: function () {
                        return paramObj;
                    }
                }
            });
            modalInstance.result.then(function () {

            }, function () {

            });

        }
        function DeAttachOrder(row, index) {
            if (row.SHP_FK != null || row.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                BookingSupplierDirectiveCtrl.ePage.Masters.data.push(row)
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders[index].IsDeleted = true
            } else {
                BookingSupplierDirectiveCtrl.ePage.Masters.data.push(row)
                BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
            }
        }
        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }
        function AutoCompleteOnSelect($item, model, code, IsArray) {
            OnFieldValueChange(code)
            //  BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier",  BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);

        }
        function SelectedLookupData($item, model, code, IsArray, val) {
             BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item
            OnFieldValueChange(code)
            //  BookingSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingSupplier",  BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, $item, code, IsArray);
        }
        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["BookingSupplier"],
                Code: [ BookingSupplierDirectiveCtrl.currentBooking.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_TEST",
                RelatedBasicDetails: [{
                    "UIField": "TEST",
                    "DbField": "TEST",
                    "Value": "TEST"
                }],
                EntityObject:  BookingSupplierDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }
        Init();
    }
})();