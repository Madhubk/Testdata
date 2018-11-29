(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SLIBookingEditDirectiveController", SLIBookingEditDirectiveController);

    SLIBookingEditDirectiveController.$inject = ["$scope", "$uibModal", "$q", "$injector", "$window", "helperService", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "errorWarningService"];

    function SLIBookingEditDirectiveController($scope, $uibModal, $q, $injector, $window, helperService, apiService, authService, appConfig, APP_CONSTANT, toastr, errorWarningService) {
        var SLIBookingEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SLIBookingEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SLI-Booking_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            // DatePicker
            SLIBookingEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            SLIBookingEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SLIBookingEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SLIBookingEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            SLIBookingEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            InitSLI();
            GetDynamicLookupConfig()
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SLIBookingEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitSLI() {
            SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj = SLIBookingEditDirectiveCtrl.taskObj;
            SLIBookingEditDirectiveCtrl.ePage.Masters.modeChange = ModeChange;
            SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingDisabled = false;
            SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingTxt = "Submit Booking";
            SLIBookingEditDirectiveCtrl.ePage.Masters.isConverted = true;
            SLIBookingEditDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            SLIBookingEditDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            SLIBookingEditDirectiveCtrl.ePage.Masters.submitBooking = SubmitBooking;
            SLIBookingEditDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem;
            SLIBookingEditDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder;
            SLIBookingEditDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView;
            // error warning service
            SLIBookingEditDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
            // error warning modal
            SLIBookingEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            if (SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj) {
                InitBooking();
                GetGridConfig();
                InitValidation();
            }
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,OrgCarrierList";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function InitBooking() {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.UIShipmentHeader.BookingType = "CB";
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                            ePage: SLIBookingEditDirectiveCtrl.ePage
                        },
                        label: SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        code: SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                    };
                    SLIBookingEditDirectiveCtrl.ePage.Masters.TabObj = obj;

                    OrgInit();
                    StandardMenuConfig();
                    getServices();
                    getAttachedOrders();
                    cfxTypeList();
                    cfxContainerType();
                    getPackType();
                }
            });
        }

        function StandardMenuConfig() {
            SLIBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails = []
            SLIBookingEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
            SLIBookingEditDirectiveCtrl.ePage.Masters.ContainerHeader = {
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
            SLIBookingEditDirectiveCtrl.ePage.Masters.RoutingHeader = {
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
            SLIBookingEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true
            };
        }

        function getAttachedOrders() {
            var _inputObj = {
                "SHP_FK": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100,
            };
            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function cfxTypeList() {
            SLIBookingEditDirectiveCtrl.ePage.Masters.cfxTypeList = {}
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
                    SLIBookingEditDirectiveCtrl.ePage.Masters.cfxTypeList[value] = response.data.Response[value];
                });
            });

        }

        function getPackType() {
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.cfxTypeList.PackType = response.data.Response;
                }
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
                    SLIBookingEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType = response.data.Response
                    // var obj = _.filter(SLIBookingEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                    //     'Key': SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    // })[0];
                    // SLIBookingEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        function ModeChange(obj) {
            if (obj) {
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm();
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
        }

        function TransportModeChangesMdm() {
            if (SLIBookingEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(SLIBookingEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;
                }
            }
        }

        function OrgInit() {
            SLIBookingEditDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            SLIBookingEditDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            SLIBookingEditDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            SLIBookingEditDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            SLIBookingEditDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;

            var defaultOrg = Getfullorg(SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
            defaultOrg.then(function (val) {
                OnSelectShipper(val[0]);
                getOpenOrders();
            });
        }

        function Getfullorg(viewValue) {
            var _inputObj = {
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "OrgCode": viewValue
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                return SLIBookingEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            SLIBookingEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.$intervalAddress1 = res[0].Address1;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].RelatedPortCode.substring(0, 2);
                    SLIBookingEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0];
                    SLIBookingEditDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                } else {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    SLIBookingEditDirectiveCtrl.ePage.Masters.ConsignorContact = res[0];
                    SLIBookingEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                } else {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    var tempBuyObj = _.filter(SLIBookingEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj);
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                SLIBookingEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                SLIBookingEditDirectiveCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders();
                getMDMDefaulvalues();
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].RelatedPortCode.substring(0, 2);
                        SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                        SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                    } else {
                        SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0];
                        SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                    } else {
                        SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                SLIBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                SLIBookingEditDirectiveCtrl.ePage.Masters.buyerName = "";
            }
        }

        function getMDMDefaulvalues() {
            if (SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            SLIBookingEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode;
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                var obj = _.filter(SLIBookingEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                                    'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                })[0];
                                SLIBookingEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
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
                return SLIBookingEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
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
                return SLIBookingEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                SLIBookingEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                SLIBookingEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                SLIBookingEditDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                SLIBookingEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                SLIBookingEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                SLIBookingEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getServices() {
            SLIBookingEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }

            apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                    if (SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                        for (var i in SLIBookingEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                'ServiceCode': SLIBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                SLIBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                SLIBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var i in SLIBookingEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            SLIBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                        }
                    }
                }
            });


        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function AutoCompleteOnSelect($item, model, code, IsArray) {
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, $item.data.entity[val], code, IsArray);
        }

        function getOpenOrders() {
            SLIBookingEditDirectiveCtrl.ePage.Masters.paginationOptions = {
                "IsShpCreated": "false",
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "Buyer": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                "Supplier": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            };
            GetGridConfig();
            getDataAsynPage(SLIBookingEditDirectiveCtrl.ePage.Masters.paginationOptions);
        }

        function GetGridConfig() {
            SLIBookingEditDirectiveCtrl.ePage.Masters.column = [{
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
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.SLIBookingEditDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            SLIBookingEditDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: SLIBookingEditDirectiveCtrl.ePage.Masters.column,
                data: SLIBookingEditDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            SLIBookingEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            SLIBookingEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            SLIBookingEditDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        SLIBookingEditDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(SLIBookingEditDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {
            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            SLIBookingEditDirectiveCtrl.ePage.Masters.gridOptions.data = []
            SLIBookingEditDirectiveCtrl.ePage.Masters.IsLoading = true
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data) {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.data = response.data.Response
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (val, key) {
                        var _index = _.findIndex(SLIBookingEditDirectiveCtrl.ePage.Masters.data, function (o) {
                            return o.PK == val.PK;
                        });

                        SLIBookingEditDirectiveCtrl.ePage.Masters.data.splice(_index, 1)

                    });
                    if (SLIBookingEditDirectiveCtrl.ePage.Masters.data.length === 0) {
                        SLIBookingEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        SLIBookingEditDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.data = [];
                    SLIBookingEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                SLIBookingEditDirectiveCtrl.ePage.Masters.IsLoading = false;
                GetGridConfig();
            });
        }

        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data,
                "order": SLIBookingEditDirectiveCtrl.ePage.Masters.data,
                "edit": bool
            }
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',
                windowClass: 'orderLineItem',
                templateUrl: 'app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/orderline-popup.html',
                controller: 'OrderLinePopupController',
                controllerAs: 'OrderLinePopupCtrl',
                resolve: {
                    items: function () {
                        return paramObj;
                    }
                }
            });

            modalInstance.result.then(function () {}, function () {});
        }

        function DeAttachOrder(row, index) {
            if (row.SHP_FK != null || row.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                SLIBookingEditDirectiveCtrl.ePage.Masters.data.push(row);
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1);
            } else {
                SLIBookingEditDirectiveCtrl.ePage.Masters.data.push(row);
                SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1);
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

        function InitValidation() {
            if (SLIBookingEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container');
                errorWarningService.AddModuleToList("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package');
                errorWarningService.AddModuleToList("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
                SLIBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                SLIBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                SLIBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo];
                SLIBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer = errorWarningService.Modules.MyTask.Entity[SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'].GlobalErrorWarningList;
                SLIBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjContainer = errorWarningService.Modules.MyTask.Entity[SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'];
                SLIBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage = errorWarningService.Modules.MyTask.Entity[SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'].GlobalErrorWarningList;
                SLIBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjPackage = errorWarningService.Modules.MyTask.Entity[SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'];
            }
        }

        function GeneralValidation($item, IsApproval) {
            var _input = $item;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.IncoTerm, 'E0003', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Origin, 'E0004', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfLoading, 'E0006', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfDischarge, 'E0007', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Destination, 'E0005', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.HBLAWBChargesDisplay, 'E0039', false, undefined);

            var tempArray = [];
            var tempArrayDoc = [];
            if (!IsApproval) {
                if (SLIBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {
                        if (val.DocumentType == 'DO' || val.DocumentType == 'CRO') {
                            tempArray.push(val);
                        }
                        if (val.DocumentType == 'PKL' || val.DocumentType == 'INP' || val.DocumentType == 'CIV') {
                            tempArrayDoc.push(val);
                        }
                    });
                    if (tempArray.length > 0) {
                        errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0037', false, undefined);
                    } else if (tempArrayDoc.length > 0) {
                        errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
                    } else {
                        errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0037', false, undefined);
                        errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                    }

                } else {
                    errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0037', false, undefined);
                    errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                }
            } else {
                if (SLIBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {
                        if (val.DocumentType == 'PKL' || val.DocumentType == 'INP' || val.DocumentType == 'CIV') {
                            tempArrayDoc.push(val);
                        }
                    });
                    if (tempArrayDoc.length > 0) {
                        errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
                    } else {
                        errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                    }

                } else {
                    errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0037', false, undefined);
                    errorWarningService.OnFieldValueChange("MyTask", SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                }
            }
            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function SubmitBooking(IsApproval) {
            GeneralValidation(SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data, IsApproval).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingDisabled = true;
                    SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingTxt = "Please wait";
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK = SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo["Is" + SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingType + 'ApprovalRequired'] = false

                    var _array = [];
                    for (var i in SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList) {
                        if (i !== "CfxTypeList") {
                            _array.push(SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[i]);
                        }
                    }
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress = [];
                    _array.map(function (value, key) {
                        SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress.push(value);
                    });
                    SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsBooking = true;
                    // SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo["Is" + SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingType + "VerificationRequired"] = true;
                    apiService.post("eAxisAPI", appConfig.Entities.Booking.API.Update.Url, SLIBookingEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                        if (response.data.Response) {
                            SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingDisabled = false;
                            SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingTxt = "Submit Booking";
                            CompleteProcess().then(function (response) {
                                toastr.success("Task Completed...");
                                var _data = {
                                    IsCompleted: true,
                                    Item: SLIBookingEditDirectiveCtrl.taskObj
                                };

                                SLIBookingEditDirectiveCtrl.onComplete({
                                    $item: _data
                                });
                            });
                        } else {
                            toastr.error("Save failed...");
                            SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingDisabled = false;
                            SLIBookingEditDirectiveCtrl.ePage.Masters.SubmitBookingTxt = "Submit Booking";
                        }
                    });
                } else {
                    SLIBookingEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(SLIBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function CompleteProcess() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "EntitySource": SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "KeyReference": SLIBookingEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "IsModified": true
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        Init();
    }
})();