(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingBranchDirectiveController", BookingBranchDirectiveController);

    BookingBranchDirectiveController.$inject = ["$rootScope", "$scope", "$window", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "BookingBranchConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function BookingBranchDirectiveController($rootScope, $scope, $window, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, BookingBranchConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var BookingBranchDirectiveCtrl = this;

        function Init() {
            var currentBooking = BookingBranchDirectiveCtrl.currentBooking[BookingBranchDirectiveCtrl.currentBooking.label].ePage.Entities;
            BookingBranchDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService
            BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.BookingBranch.Entity[BookingBranchDirectiveCtrl.currentBooking.code];
            BookingBranchDirectiveCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange
            // DatePicker
            GetGridConfig()
            BookingBranchDirectiveCtrl.ePage.Masters.config = BookingBranchConfig;
            BookingBranchDirectiveCtrl.ePage.Masters.DatePicker = {};
            BookingBranchDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            BookingBranchDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            BookingBranchDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
            StandardMenuConfig();
            BookingBranchDirectiveCtrl.ePage.Masters.modeChange = ModeChange
            BookingBranchDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            BookingBranchDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            // BookingBranchDirectiveCtrl.ePage.Masters.addVessel = AddVessel;
            BookingBranchDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem
            BookingBranchDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView
            BookingBranchDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder
            //Container
            // BookingBranchDirectiveCtrl.ePage.Masters.CntObj = {};
            // BookingBranchDirectiveCtrl.ePage.Masters.addContainer = AddContainer;
            // BookingBranchDirectiveCtrl.ePage.Masters.deleteContainer = DeleteContainer;
            // //Packlines
            // BookingBranchDirectiveCtrl.ePage.Masters.PackObj = {};
            // BookingBranchDirectiveCtrl.ePage.Masters.PackObj.JobLocation = [];
            // BookingBranchDirectiveCtrl.ePage.Masters.PackObj.PkgCntMapping = [];
            // BookingBranchDirectiveCtrl.ePage.Masters.PackObj.JobDangerousGoods = [];
            // BookingBranchDirectiveCtrl.ePage.Masters.packageAdd = PackageAdd;
            // BookingBranchDirectiveCtrl.ePage.Masters.deletePackage = DeletePackage;
            // BookingBranchDirectiveCtrl.ePage.Masters.deleteVessel = DeleteVessel;
            BookingBranchDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            BookingBranchDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function StandardMenuConfig() {
            BookingBranchDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
            BookingBranchDirectiveCtrl.ePage.Masters.ContainerHeader = {
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
            BookingBranchDirectiveCtrl.ePage.Masters.RoutingHeader = {

                "HeaderProperties": [{
                        "columnname": "Checkbox",
                        "isenabled": false,
                        "property": "routingcheckbox",
                        "position": "1",
                        "width": "45",
                        "display": false
                    }, {
                        "columnname": "Job #",
                        "isenabled": false,
                        "property": "jobno",
                        "position": "2",
                        "width": "1600",
                        "display": false
                    },
                    {
                        "columnname": "Leg Order #",
                        "isenabled": false,
                        "property": "legorder",
                        "position": "3",
                        "width": "40",
                        "display": true
                    },
                    {
                        "columnname": "T.Mode",
                        "isenabled": true,
                        "property": "mode",
                        "position": "4",
                        "width": "160",
                        "display": true
                    },
                    {
                        "columnname": "Transport Type",
                        "isenabled": false,
                        "property": "transporttype",
                        "position": "5",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Status",
                        "isenabled": false,
                        "property": "status",
                        "position": "6",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Vessel",
                        "isenabled": true,
                        "property": "vessel",
                        "position": "7",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Voyage/Flight",
                        "isenabled": true,
                        "property": "voyageflight",
                        "position": "8",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "LoadPort",
                        "isenabled": true,
                        "property": "pol",
                        "position": "9",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "DischargePort",
                        "isenabled": true,
                        "property": "pod",
                        "position": "10",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ETD",
                        "isenabled": true,
                        "property": "etd",
                        "position": "11",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ETA",
                        "isenabled": true,
                        "property": "eta",
                        "position": "12",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ATD",
                        "isenabled": false,
                        "property": "atd",
                        "position": "13",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ATA",
                        "isenabled": false,
                        "property": "ata",
                        "position": "14",
                        "width": "120",
                        "display": true
                    }
                ],
                "routingcheckbox": {
                    "isenabled": false,
                    "position": "1",
                    "width": "45"
                },
                "jobno": {
                    "isenabled": false,
                    "position": "2",
                    "width": "40"
                },
                "legorder": {
                    "isenabled": false,
                    "position": "3",
                    "width": "160"
                },
                "mode": {
                    "isenabled": true,
                    "position": "4",
                    "width": "160"
                },
                "transporttype": {
                    "isenabled": false,
                    "position": "5",
                    "width": "160"
                },
                "status": {
                    "isenabled": false,
                    "position": "6",
                    "width": "120"
                },
                "vessel": {
                    "isenabled": true,
                    "position": "7",
                    "width": "120"
                },
                "voyageflight": {
                    "isenabled": true,
                    "position": "8",
                    "width": "120"
                },
                "pol": {
                    "isenabled": true,
                    "position": "9",
                    "width": "120"
                },
                "pod": {
                    "isenabled": true,
                    "position": "10",
                    "width": "120"
                },
                "etd": {
                    "isenabled": true,
                    "position": "11",
                    "width": "120"
                },
                "eta": {
                    "isenabled": true,
                    "position": "12",
                    "width": "120"
                },
                "atd": {
                    "isenabled": false,
                    "position": "13",
                    "width": "120"
                },
                "ata": {
                    "isenabled": false,
                    "position": "14",
                    "width": "120"
                }
            }
            BookingBranchDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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
            BookingBranchDirectiveCtrl.ePage.Masters.cfxTypeList = {}
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
                    BookingBranchDirectiveCtrl.ePage.Masters.cfxTypeList[value] = response.data.Response[value];
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
                    BookingBranchDirectiveCtrl.ePage.Masters.cfxTypeList.CntType = response.data.Response
                    var obj = _.filter(BookingBranchDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                        'Key': BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    BookingBranchDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        function getPackType() {
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    BookingBranchDirectiveCtrl.ePage.Masters.cfxTypeList.PackType = response.data.Response;
                }
            });
        }

        function ModeChange(obj) {
            if (obj) {
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm();
            OnFieldValueChange()
            // BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('BookingBranch', BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode, 'E0002', false)
        }

        function OrgInit() {
            BookingBranchDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            BookingBranchDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            BookingBranchDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            BookingBranchDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            BookingBranchDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;
            if (!BookingBranchDirectiveCtrl.currentBooking.isNew) {
                var defaultOrg = Getfullorg(BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
                defaultOrg.then(function (val) {
                    OnSelectShipper(val[0])
                    getOpenOrders()
                });
            } else {
                BookingBranchDirectiveCtrl.ePage.Masters.IsNoRecords = true
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
                return BookingBranchDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            BookingBranchDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            OnFieldValueChange('E0031');
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address1 = res[0].Address1;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].Country;
                    var tempAddrObj = _.filter(res, {
                        'PK': BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK
                    })[0];
                    BookingBranchDirectiveCtrl.ePage.Masters.ConsignorAddressType = tempAddrObj
                    BookingBranchDirectiveCtrl.ePage.Masters.ConsignorAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                    if (tempAddrObj) {
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0];
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                    }

                } else {
                    BookingBranchDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    var tempSupConObj = _.filter(res, {
                        'PK': BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK
                    })[0];
                    BookingBranchDirectiveCtrl.ePage.Masters.ConsignorContact = tempSupConObj;
                    BookingBranchDirectiveCtrl.ePage.Masters.ConsignorContactDetails = tempSupConObj.Title + "\n" + tempSupConObj.Email + "\n" + tempSupConObj.Phone;
                    if (tempSupConObj) {
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsignorContact = res[0];
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                    }
                } else {
                    BookingBranchDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingBranchDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    if (!BookingBranchDirectiveCtrl.currentBooking.isNew) {
                        var tempBuyObj = _.filter(BookingBranchDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                            'ORG_Buyer': BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                        })[0];
                        OnSelectBuyer(tempBuyObj)
                    }
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                BookingBranchDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                BookingBranchDirectiveCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders()
                getMDMDefaulvalues()
                getMDMMiscService()
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].Country;
                        var tempAddrObj = _.filter(res, {
                            'PK': BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK
                        })[0];
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeAddressType = tempAddrObj
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                        if (tempAddrObj) {
                            BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                            BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                        }
                    } else {
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        var tempContactObj = _.filter(res, {
                            'PK': BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK
                        })[0];
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeContact = tempContactObj
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = tempContactObj.Title + "\n" + tempContactObj.Email + "\n" + tempContactObj.Phone
                        if (tempContactObj) {
                            BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0];
                            BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                        }
                    } else {
                        BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                BookingBranchDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                BookingBranchDirectiveCtrl.ePage.Masters.buyerName = "";
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = ""
            }
            if (BookingBranchDirectiveCtrl.currentBooking.isNew) {
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = []
            }
            OnFieldValueChange('E0032')
            // BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false);
        }

        function getMDMDefaulvalues() {
            if (BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            BookingBranchDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                            if (BookingBranchDirectiveCtrl.currentBooking.isNew) {
                                if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                    var obj = _.filter(BookingBranchDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    BookingBranchDirectiveCtrl.ePage.Masters.selectedMode = obj;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                    OnFieldValueChange()

                                }
                            }
                        }
                    }
                });
            }
        }

        function getMDMMiscService() {
            BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.OrgMiscService = {}
            var _inputObj = {
                "ORG_FK": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.OrgMiscService = response.data.Response[0];
                }
            });
        }

        function TransportModeChangesMdm() {
            if (BookingBranchDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(BookingBranchDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;
                    OnFieldValueChange()
                }
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
                return BookingBranchDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
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
                return BookingBranchDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                BookingBranchDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                BookingBranchDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                BookingBranchDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                BookingBranchDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                BookingBranchDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                BookingBranchDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getServices() {
            BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            if (!BookingBranchDirectiveCtrl.currentBooking.isNew) {
                apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                    if (response.data.Response) {
                        BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                        if (BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                            for (var i in BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes) {
                                var tempObj = _.filter(BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                    'ServiceCode': BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes[i]
                                })[0];
                                if (tempObj == undefined) {
                                    BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                                } else {
                                    BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                                }
                            }
                        } else {
                            for (var i in BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes) {
                                BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                            }
                        }
                    }
                });
            } else {
                for (var i in BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes) {
                    BookingBranchDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                }
            }

        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function getAttachedOrders() {
            var _inputObj = {
                "SHP_FK": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK,
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
                    BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response
                }
            });
        }

        // function getContainers() {

        //     var _inputObj = {
        //         "BookingOnlyLink": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //     };
        //     var _input = {
        //         "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_inputObj)
        //     };
        //     apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response
        //         }
        //     });
        // }


        // function AddContainer() {
        //     ContainerValidation()
        //     if (BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer.length == 0) {
        //         BookingBranchDirectiveCtrl.ePage.Masters.CntObj.SHP_BookingOnlyLink = BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         BookingBranchDirectiveCtrl.ePage.Masters.CntObj.IsDeleted = false
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.push(BookingBranchDirectiveCtrl.ePage.Masters.CntObj);
        //         BookingBranchDirectiveCtrl.ePage.Masters.CntObj = {};
        //     }
        // }

        // function ContainerValidation() {

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Container', BookingBranchDirectiveCtrl.ePage.Masters.CntObj.ContainerCount, 'E0008', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Container', BookingBranchDirectiveCtrl.ePage.Masters.CntObj.RC_Type, 'E0009', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Container', BookingBranchDirectiveCtrl.ePage.Masters.CntObj.RH_NKContainerCommodityCode, 'E0010', false);
        // }

        // function DeleteContainer(item, index) {
        //     var _index = BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.splice(index, 1);
        //     } else {
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer[index].IsDeleted = true
        //     }
        // }

        // function getPackLines() {

        //     var _inputObj = {
        //         "SHP_FK": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK
        //     };
        //     var _input = {
        //         "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_inputObj)
        //     };
        //     apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
        //         }
        //     });
        // }


        // function PackageAdd() {
        //     PackageValidation()
        //     if (BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage == 0) {
        //         BookingBranchDirectiveCtrl.ePage.Masters.PackObj.SHP_FK = BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         BookingBranchDirectiveCtrl.ePage.Masters.PackObj.FreightMode = 'OUT';
        //         BookingBranchDirectiveCtrl.ePage.Masters.PackObj.IsDeleted = false
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(BookingBranchDirectiveCtrl.ePage.Masters.PackObj);
        //         BookingBranchDirectiveCtrl.ePage.Masters.PackObj = {};
        //     }
        // }

        // function PackageValidation() {

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.PackageCount, 'E0011', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.F3_NKPackType, 'E0012', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.ActualWeight, 'E0013', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.ActualWeightUQ, 'E0014', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.ActualVolume, 'E0015', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.ActualVolumeUQ, 'E0016', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.Length, 'E0017', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.Width, 'E0018', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.Height, 'E0019', false);

        //     BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + 'Package', BookingBranchDirectiveCtrl.ePage.Masters.PackObj.UnitOfDimension, 'E0020', false);

        // }

        // function DeletePackage(item, index) {
        //     var _index = BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
        //     } else {
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines[index].IsDeleted = true
        //     }
        // }


        // function getJobSailing() {

        //     var _filter = {
        //         "EntityRefKey": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             response.data.Response.map(function (val, key) {
        //                 var obj = {
        //                     "IsDeleted": false,
        //                     "UIJobSailing": {
        //                         "PK": val.JBS_FK,
        //                         "LCLCutOff": val.CargoCutOffDate
        //                     },
        //                     "UIJobRoutes": {
        //                         "PK": val.PK,
        //                         "CarrierOrg_Code": val.CarrierOrg_Code,
        //                         "Vessel": val.Vessel,
        //                         "VoyageFlight": val.VoyageFlight,
        //                         "ETD": val.ETD,
        //                         "ETA": val.ETA,
        //                         "DocumentCutOffDate": val.DocumentCutOffDate,
        //                         "CarrierReference": val.CarrierReference
        //                     }
        //                 }
        //                 BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UISailingList.push(obj)
        //             })
        //         }
        //     });
        // }


        // function AddVessel() {

        //     var modalInstance = $uibModal.open({
        //         animation: true,
        //         backdrop: "static",
        //         keyboard: false,
        //         windowClass: "vessel-mod right",
        //         scope: $scope,
        //         // size : "sm",
        //         templateUrl: "app/eaxis/freight/booking-branch/booking-vessel-modal/booking-vessel-modal.html",
        //         controller: 'ConvertBookingVesselModalController',
        //         controllerAs: "ConvertBookingVesselModalCtrl",
        //         bindToController: true,
        //         resolve: {
        //             param: function () {
        //                 var exports = {
        //                     "ParentObj": BookingBranchDirectiveCtrl.ePage
        //                 };
        //                 return exports;
        //             }
        //         }
        //     }).result.then(
        //         function (response) {},
        //         function (response) {}
        //     );
        // }

        // function DeleteVessel(item, index) {
        //     var _index = BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UISailingList.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UISailingList.splice(index, 1);
        //     } else {
        //         BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UISailingList[index].IsDeleted = true
        //     }
        // }

        // function getDocuments() {
        //     BookingBranchDirectiveCtrl.ePage.Masters.Documents = {};
        //     BookingBranchDirectiveCtrl.ePage.Masters.Autherization = authService.getUserInfo().AuthToken;
        //     BookingBranchDirectiveCtrl.ePage.Masters.fileDetails = [];
        //     BookingBranchDirectiveCtrl.ePage.Masters.fileSize = 10;
        //     BookingBranchDirectiveCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;

        //     var _additionalValue = {
        //         "Entity": "Shipment",
        //         "Path": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
        //     };

        //     BookingBranchDirectiveCtrl.ePage.Masters.AdditionalValue = JSON.stringify(_additionalValue);
        //     BookingBranchDirectiveCtrl.ePage.Masters.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

        //     BookingBranchDirectiveCtrl.ePage.Masters.GetUploadedFiles = GetUploadedFiles;
        //     BookingBranchDirectiveCtrl.ePage.Masters.GetSelectedFiles = GetSelectedFiles;
        //     BookingBranchDirectiveCtrl.ePage.Masters.docdownloadDoc = DocdownloadDoc;
        //     BookingBranchDirectiveCtrl.ePage.Masters.removeDocument = RemoveDocument;
        //     BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails = [];

        //     GetDocType();
        //     getJobDocuments()
        // }

        // function GetDocType() {
        //     var _filter = {
        //         "EntitySource": "CONFIGURATION",
        //         "SourceEntityRefKey": "DocType",
        //         "Key": "Shipment"
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
        //         if (response.data.Response) {
        //             if (response.data.Response.length > 0) {
        //                 var _response = response.data.Response[0];
        //                 if (!_response.Value) {
        //                     _response.Value = "GEN";
        //                 }
        //                 GetDocumentTypeList(_response.Value);
        //             } else {
        //                 GetDocumentTypeList("GEN");
        //             }
        //         }
        //     });
        // }

        // function getJobDocuments() {
        //     var _input = {
        //         "EntityRefKey": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //         "EntitySource": "SHP",
        //         "EntityRefCode": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //         "Status": "Success"
        //     };

        //     var inputObj = {
        //         "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_input)
        //     }
        //     apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails = response.data.Response;
        //     });
        // }


        // function GetDocumentTypeList($item) {
        //     var _filter = {
        //         DocType: $item
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             var _list = response.data.Response;
        //             var _obj = {
        //                 DocType: "ALL",
        //                 Desc: "All"
        //             };

        //             _list.push(_obj);
        //             _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

        //             BookingBranchDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = _list;
        //         }
        //     });
        // }

        // function GetSelectedFiles(Files, docType) {
        //     Files.map(function (value1, key1) {
        //         var _obj = {
        //             type: value1.type,
        //             FileName: value1.name,
        //             IsActive: true,
        //             DocumentType: docType.DocType,
        //             DocumentName: docType.Desc,
        //             Status: "Success",
        //             IsNew: true,
        //             IsDeleted: false,
        //             UploadedDateTime: new Date()
        //         };
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails.push(_obj);
        //     });

        // }

        // function GetUploadedFiles(Files, docType) {
        //     Files.map(function (value1, key1) {
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value2, key2) {
        //             if (value1.FileName == value2.FileName && value1.DocType == value2.type) {
        //                 SaveDocument(value1, value2);
        //             }
        //         });
        //     });
        // }

        // function SaveDocument($item, row) {
        //     var _input = {};
        //     if ($item) {
        //         var _index = $item.FileName.indexOf(".");
        //         if (_index != -1) {
        //             var _object = $item.FileName.split(".")[0];
        //         }

        //         var _input = {
        //             FileName: $item.FileName,
        //             FileExtension: $item.FileExtension,
        //             ContentType: $item.DocType,
        //             IsActive: true,
        //             IsModified: true,
        //             IsDeleted: false,
        //             DocFK: $item.Doc_PK,
        //             EntitySource: 'SHP',
        //             EntityRefKey: BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //             EntityRefCode: BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //             DocumentName: _object,
        //             DocumentType: row.DocumentType
        //         };
        //     }
        //     _input.Status = "Success"

        //     BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.push(_input)
        //     row.IsNew = false;

        // }

        // function DocdownloadDoc(doc) {
        //     apiService.getEaxis('JobDocument/DownloadFile/' + doc.PK + '/c0b3b8d9-2248-44cd-a425-99c85c6c36d8').then(function (response) {
        //         if (response.data.Response) {
        //             if (response.data.Response !== "No Records Found!") {
        //                 appService.downloadDocument(response.data.Response);
        //             }
        //         } else {}
        //     });
        // }

        // function RemoveDocument(item, index) {

        //     var _index = BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails.splice(index, 1);
        //     } else {
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails[index].Status = "Deleted"
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsActive = true
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsModified = true
        //         BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsDeleted = true
        //     }
        //     // // item.Status = "Deleted"
        //     // // item.IsActive = true;
        //     // // item.IsModified = true;
        //     // BookingBranchDirectiveCtrl.ePage.Masters.DocumentDetails.splice(index, 1)
        //     // BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.splice(index, 1)
        //     // // apiService.postEaxis('JobDocument/Upsert/c0b3b8d9-2248-44cd-a425-99c85c6c36d8', [item]).then(function (response) {
        //     // //     getJobDocuments()
        //     // // });
        // }

        function getOpenOrders() {
            BookingBranchDirectiveCtrl.ePage.Masters.paginationOptions = {
                "IsShpCreated": "false",
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "Buyer": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                "Supplier": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            };
            GetGridConfig();
            getDataAsynPage(BookingBranchDirectiveCtrl.ePage.Masters.paginationOptions)
        }

        function GetGridConfig() {
            BookingBranchDirectiveCtrl.ePage.Masters.column = [

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
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.BookingBranchDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            BookingBranchDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: BookingBranchDirectiveCtrl.ePage.Masters.column,
                data: BookingBranchDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            BookingBranchDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            BookingBranchDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            BookingBranchDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        BookingBranchDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(BookingBranchDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {

            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            BookingBranchDirectiveCtrl.ePage.Masters.gridOptions.data = []
            BookingBranchDirectiveCtrl.ePage.Masters.IsLoading = true
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data) {
                    BookingBranchDirectiveCtrl.ePage.Masters.data = response.data.Response
                    if (BookingBranchDirectiveCtrl.ePage.Masters.data.length === 0) {
                        BookingBranchDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        BookingBranchDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    BookingBranchDirectiveCtrl.ePage.Masters.data = [];
                    BookingBranchDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                BookingBranchDirectiveCtrl.ePage.Masters.IsLoading = false
                GetGridConfig()
            });


        }

        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": BookingBranchDirectiveCtrl.ePage.Entities.Header.Data,
                "order": BookingBranchDirectiveCtrl.ePage.Masters.data,
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
                BookingBranchDirectiveCtrl.ePage.Masters.data.push(row)
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders[index].IsDeleted = true
            } else {
                BookingBranchDirectiveCtrl.ePage.Masters.data.push(row)
                BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
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
            // BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray) {
            BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item
            OnFieldValueChange(code)
            // BookingBranchDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("BookingBranch", BookingBranchDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, $item, code, IsArray);
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["BookingBranch"],
                Code: [BookingBranchDirectiveCtrl.currentBooking.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_Test",
                RelatedBasicDetails: [{
                    "UIField": "TEST",
                    "DbField": "TEST",
                    "Value": "TEST"
                }],
                EntityObject: BookingBranchDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();