(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickBookRejectBranchEditDirectiveController", QuickBookRejectBranchEditDirectiveController);

    QuickBookRejectBranchEditDirectiveController.$inject = ["$scope", "$q", "$window", "$uibModal", "$injector", "helperService", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "errorWarningService"];

    function QuickBookRejectBranchEditDirectiveController($scope, $q, $window, $uibModal, $injector, helperService, apiService, authService, appConfig, APP_CONSTANT, toastr, errorWarningService) {
        var QuickBookRejectBranchEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Quick_Booking_Rejection_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            // DatePicker
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            TaskGetById();
            GetRelatedLookupList();
        }

        function TaskGetById() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.TaskObj = QuickBookRejectBranchEditDirectiveCtrl.taskObj;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.modeChange = ModeChange;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.submitBooking = SubmitBooking;
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.addVessel = AddVessel;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking"
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = false;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.Loaded = false

            // //Container
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj = {};
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.addContainer = AddContainer;
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.deleteContainer = DeleteContainer;
            // //Packlines
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj = {};
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.JobLocation = [];
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.PkgCntMapping = [];
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.JobDangerousGoods = [];
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.packageAdd = PackageAdd;
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.deletePackage = DeletePackage;
            // QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.deleteVessel = DeleteVessel;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
            // error warning modal
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            GetGridConfig()


            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    OrgInit();
                    cfxTypeList();
                    cfxContainerType()
                    getPackType();
                    getAttachedOrders()
                    getServices();
                    getContainers();
                    getPackLines();
                    getJobSailing();
                    // getDocuments();
                    initValidation()
                    StandardMenuConfig()
                    var obj = {
                        [QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                            ePage: QuickBookRejectBranchEditDirectiveCtrl.ePage
                        },
                        label: QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        code: QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                    };
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.TabObj = obj
                }
            });
        }

        function StandardMenuConfig() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails = []
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ContainerHeader = {
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
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.RoutingHeader = {

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
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdCarrierPlanning_2834,OrdVesselPlanning_3187,VesselPOL_3309,VesselPOD_3310",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        function cfxTypeList() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList = {}
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
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList[value] = response.data.Response[value];
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
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType = response.data.Response
                    var obj = _.filter(QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                        'Key': QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
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
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.PackType = response.data.Response;
                }
            });
        }

        function ModeChange(obj) {
            if (obj) {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm()
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode, 'E0002', false)
        }

        function OrgInit() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;

            var defaultOrg = Getfullorg(QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
            defaultOrg.then(function (val) {
                OnSelectShipper(val[0])
                getOpenOrders()
            });
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
                return QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address1 = res[0].Address1;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].Country;
                    var tempAddrObj = _.filter(res, {
                        'PK': QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK
                    })[0];
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = tempAddrObj
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                    if (tempAddrObj) {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0];
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                    }

                } else {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    var tempSupConObj = _.filter(res, {
                        'PK': QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK
                    })[0];
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorContact = tempSupConObj;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = tempSupConObj.Title + "\n" + tempSupConObj.Email + "\n" + tempSupConObj.Phone;
                    if (tempSupConObj) {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorContact = res[0];
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                    }
                } else {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;

                    var tempBuyObj = _.filter(QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj)
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.Loaded = true
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders()
                getMDMDefaulvalues()
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].Country;
                        var tempAddrObj = _.filter(res, {
                            'PK': QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK
                        })[0];
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = tempAddrObj
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                        if (tempAddrObj) {
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                        }
                    } else {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        var tempContactObj = _.filter(res, {
                            'PK': QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK
                        })[0];
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContact = tempContactObj
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = tempContactObj.Title + "\n" + tempContactObj.Email + "\n" + tempContactObj.Phone
                        if (tempContactObj) {
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0];
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                        }
                    } else {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.buyerName = "";
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = ""
            }
        }

        function getMDMDefaulvalues() {
            if (QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;
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
                return QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
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
                return QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getServices() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }

            apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                    if (QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                        for (var i in QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                'ServiceCode': QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var i in QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                        }
                    }
                }
            });

        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function getAttachedOrders() {
            var _inputObj = {
                "SHP_FK": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
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
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response
                }
            });
        }

        function getContainers() {

            var _inputObj = {
                "SHP_BookingOnlyLink": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response
                }
            });
        }


        // function AddContainer() {
        //     ContainerValidation()
        //     if (QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer.length == 0) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj.SHP_BookingOnlyLink = QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj.IsDeleted = false
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.push(QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj);
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj = {};
        //     }
        // }

        // function ContainerValidation() {

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj.ContainerCount, 'E0008', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj.RC_Type, 'E0009', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.CntObj.RH_NKContainerCommodityCode, 'E0010', false);
        // }

        // function DeleteContainer(item, index) {
        //     var _index = QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.splice(index, 1);
        //     } else {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer[index].IsDeleted = true
        //     }
        // }

        function getPackLines() {

            var _inputObj = {
                "SHP_FK": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
                }
            });
        }


        // function PackageAdd() {
        //     PackageValidation()
        //     if (QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage == 0) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.SHP_FK = QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.FreightMode = 'OUT';
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.IsDeleted = false
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj);
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj = {};
        //     }
        // }

        // function PackageValidation() {

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.PackageCount, 'E0011', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.F3_NKPackType, 'E0012', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeight, 'E0013', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeightUQ, 'E0014', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolume, 'E0015', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolumeUQ, 'E0016', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.Length, 'E0017', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.Width, 'E0018', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.Height, 'E0019', false);

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.PackObj.UnitOfDimension, 'E0020', false);

        // }

        // function DeletePackage(item, index) {
        //     var _index = QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
        //     } else {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines[index].IsDeleted = true
        //     }
        // }


        function getJobSailing() {

            var _filter = {
                "EntityRefKey": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response
                }
            });
        }


        // function AddVessel() {

        //     var modalInstance = $uibModal.open({
        //         animation: true,
        //         backdrop: "static",
        //         keyboard: false,
        //         windowClass: "vessel-mod right",
        //         scope: $scope,
        //         // size : "sm",
        //         templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-vessel-modal/convert-booking-vessel-modal.html",
        //         controller: 'ConvertBookingVesselModalController',
        //         controllerAs: "ConvertBookingVesselModalCtrl",
        //         bindToController: true,
        //         resolve: {
        //             param: function () {
        //                 var exports = {
        //                     "ParentObj": QuickBookRejectBranchEditDirectiveCtrl.ePage
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
        //     var _index = QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UISailingList.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UISailingList.splice(index, 1);
        //     } else {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UISailingList[index].IsDeleted = true
        //     }
        // }

        // function getDocuments() {
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.Documents = {};
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.Autherization = authService.getUserInfo().AuthToken;
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.fileDetails = [];
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.fileSize = 10;
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;

        //     var _additionalValue = {
        //         "Entity": "Shipment",
        //         "Path": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
        //     };

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.AdditionalValue = JSON.stringify(_additionalValue);
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.GetUploadedFiles = GetUploadedFiles;
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.GetSelectedFiles = GetSelectedFiles;
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.docdownloadDoc = DocdownloadDoc;
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.removeDocument = RemoveDocument;
        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails = [];

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
        //         "EntityRefKey": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //         "EntitySource": "SHP",
        //         "EntityRefCode": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //         "Status": "Success"
        //     };

        //     var inputObj = {
        //         "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_input)
        //     }
        //     apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails = response.data.Response;
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments = response.data.Response;
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

        //             QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = _list;
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
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.push(_obj);
        //     });

        // }

        // function GetUploadedFiles(Files, docType) {
        //     Files.map(function (value1, key1) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value2, key2) {
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
        //             EntityRefKey: QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //             EntityRefCode: QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //             DocumentName: _object,
        //             DocumentType: row.DocumentType
        //         };
        //     }
        //     _input.Status = "Success"

        //     QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.push(_input)
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
        //     var _index = QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.splice(index, 1);
        //     } else {
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].Status = "Deleted"
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsActive = true
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsModified = true
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsDeleted = true
        //         QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments[index].IsDeleted = true;
        //     }
        // }

        function getOpenOrders() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.paginationOptions = {
                "IsShpCreated": "false",
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "Buyer": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                "Supplier": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            };
            GetGridConfig();
            getDataAsynPage(QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.paginationOptions)
        }

        function GetGridConfig() {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.column = [

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
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.column,
                data: QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {

            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.gridOptions.data = []
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.IsLoading = true
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.data = response.data.Response
                    if (QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.data.length === 0) {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.data = [];
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.IsLoading = false
                GetGridConfig()
            });


        }

        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data,
                "order": QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.data,
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
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.data.push(row)
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders[index].IsDeleted = true
            } else {
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.data.push(row)
                QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
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
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, $item, code, IsArray);
        }



        function SubmitBooking() {
            GeneralValidation(QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    var _array = [];
                    for (var i in QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList) {
                        if (i !== "CfxTypeList") {
                            _array.push(QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[i]);
                        }
                    }
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress = [];
                    _array.map(function (value, key) {
                        QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress.push(value);
                    });
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBooking = "Please wait..";
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = true;
                    // update ooking details 
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data = filterObjectUpdate(QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data, "IsModified");
                    apiService.post("eAxisAPI", appConfig.Entities.Booking.API.Update.Url, QuickBookRejectBranchEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                        if (response.data.Response) {
                            TaskComplete();
                            toastr.success("Succeesfully saved...");
                        } else {
                            toastr.error("Save failed...");
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking";
                            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = false;
                        }
                    });
                } else {

                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function JobInsertInput(type, _input, obj) {
            var _jobInput = {
                "PK": "",
                "EntityRefKey": obj.PK,
                "EntitySource": "SHP",
                "CommentsType": type,
                "Comments": obj[_input + "Comments"]
            }
            obj.UIJobComments.push(_jobInput);
            obj[_input + "Comments"] = ''
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function initValidation() {

            if (QuickBookRejectBranchEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container');
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package');
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing');
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
            }
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo];
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'].GlobalErrorWarningList;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjContainer = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'];
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'].GlobalErrorWarningList;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjPackage = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'];
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListSailing = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing'].GlobalErrorWarningList;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjSailing = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing'];
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListDoc = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'].GlobalErrorWarningList;
            QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjDoc = errorWarningService.Modules.MyTask.Entity[QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'];
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function GeneralValidation($item) {
            var _input = $item;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.IncoTerm, 'E0003', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Origin, 'E0004', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfLoading, 'E0006', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfDischarge, 'E0007', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Destination, 'E0005', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.HBLAWBChargesDisplay, 'E0039', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ExportForwarder_Code, 'E0047', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ImportForwarder_Code, 'E0048', false, undefined);
            // errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.JobComments, 'E0035', false, undefined);
            if (_input.UIJobRoutes.length == 0) {
                errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0033', false, undefined);
            } else {
                errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0033', false, undefined);
            }
            var tempArrayDoc = []
            if (_input.UIShipmentHeader.BookingType == 'CB') {
                if (QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {

                        if (val.DocumentType == 'PKL' || val.DocumentType == 'INP' || val.DocumentType == 'CIV') {
                            tempArrayDoc.push(val);
                        }
                    });

                    if (tempArrayDoc.length > 0) {
                        errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
                    } else {
                        errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                    }


                } else {
                    errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                }
            } else {
                errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
            }
            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function TaskComplete() {
            var _input = {
                "CompleteInstanceNo": QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
            };
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Taske Completed successfully...");
                    QuickBookRejectBranchEditDirectiveCtrl.onComplete(QuickBookRejectBranchEditDirectiveCtrl.taskObj)
                    QuickBookRejectBranchEditDirectiveCtrl.onRefreshStatusCount()
                    QuickBookRejectBranchEditDirectiveCtrl.onRefreshTask()
                } else {
                    toastr.error("Save failed...");
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = false;
                    QuickBookRejectBranchEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking(Q)";
                }
            });
        }

        Init();
    }
})();