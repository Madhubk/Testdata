(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingBranchEditDirectiveController", ConvertBookingBranchEditDirectiveController);

    ConvertBookingBranchEditDirectiveController.$inject = ["$scope", "$uibModal", "$window", "$q", "$injector", "helperService", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "errorWarningService", "confirmation"];

    function ConvertBookingBranchEditDirectiveController($scope, $uibModal, $window, $q, $injector, helperService, apiService, authService, appConfig, APP_CONSTANT, toastr, errorWarningService, confirmation) {
        var ConvertBookingBranchEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ConvertBookingBranchEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "CTB_Mail_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            // DatePicker
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            SFUMailInit();
            GetRelatedLookupList()
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SFUMailInit() {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.TaskObj = ConvertBookingBranchEditDirectiveCtrl.taskObj;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConvertBooking = ConvertBooking;

            FollowUpOrderGrid();
        }

        function FollowUpOrderGrid() {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentPreAdvice.API.GetOrdersByGroupPK.Url + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.status = true;
                    });
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                    if (ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.TaskObj.ConvertBookingDirect) {
                        ConvertBooking(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder)
                    }
                } else {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
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

        function ConvertBooking(data) {
            if (ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.modeChange = ModeChange;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBookingApprovalDisabled = false;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBookingVerifiedDisabled = false;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = false;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBookingApproval = "Send For Booking Approval";
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBookingVerified = "Submit Booking";
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.isConverted = true;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.submitBooking = SubmitBooking;
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.addVessel = AddVessel;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.Loaded = false
                // //Container
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj = {};
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.addContainer = AddContainer;
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.deleteContainer = DeleteContainer;
                // //Packlines
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj = {};
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.JobLocation = [];
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.PkgCntMapping = [];
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.JobDangerousGoods = [];
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.packageAdd = PackageAdd;
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.deletePackage = DeletePackage;
                // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.deleteVessel = DeleteVessel;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
                // error warning modal
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
                initBooking();
                GetGridConfig()
                cfxTypeList();
                cfxContainerType()
                getPackType();

            } else {
                toastr.warning("Please Select min One Order..");
            }
        }

        function initBooking() {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + "null").then(function (response) {
                if (response.data.Response) {

                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response.Response;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingType = 'CB'
                    console.log(ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data);
                    OrderGetById();
                    initValidation();
                    OrderFindAll();
                    // getPackLines();
                    StandardMenuConfig()
                    var obj = {
                        [ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                            ePage: ConvertBookingBranchEditDirectiveCtrl.ePage
                        },
                        label: ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        code: ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                    };
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.TabObj = obj
                }
            });
        }

        function StandardMenuConfig() {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails = []
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ContainerHeader = {
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
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.RoutingHeader = {

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
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

        // function getPackLines() {

        //     var _inputObj = {
        //         "SHP_FK": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK
        //     };
        //     var _input = {
        //         "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_inputObj)
        //     };
        //     apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
        //             console.log(ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines);
        //         }
        //     });
        // }

        function OrderFindAll() {
            var Pks = '';
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (val, key) {
                Pks += val.POH_FK + ','
            });
            var obj = {
                "FieldName": "POH_PKS",
                "value": Pks.slice(0, -1)
            };

            var _input = {
                "searchInput": [obj],
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function OrderGetById() {

            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].POH_FK).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder = response.data.Response;
                    var obj = _.filter(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                        'Key': ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.ContainerMode
                    })[0];
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.selectedMode = obj
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.TransportMode;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.ContainerMode;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.IncoTerm;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.CargoReadyDate = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.CargoReadyDate;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.GoodsAvailableAt;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.GoodsDeliveredTo;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.PortOfLoading;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.PortOfDischarge;

                    OrgInit();
                    // getAttachedOrders()
                    getServices();
                    // getDocuments();
                }
            });
        }

        function cfxTypeList() {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList = {}
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
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList[value] = response.data.Response[value];
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
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.PackType = response.data.Response;
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
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType = response.data.Response
                    // var obj = _.filter(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                    //     'Key': ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    // })[0];
                    // ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        function ModeChange(obj) {
            if (obj) {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm()
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
        }

        function OrgInit() {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;
            var defaultOrg = Getfullorg(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].Supplier);
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
                "OrgCode": viewValue
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                return ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OAD_Address_FK;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OAD_Code;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.CompanyName;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address1 = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address1;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address2;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.PostCode;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.City;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.State;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Country;
                    var tempSupObj = _.filter(res, {
                        'PK': ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OAD_Address_FK
                    })[0];
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = tempSupObj;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddress = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address1 + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address2 + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.City + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.State + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.PostCode + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Phone + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Fax;
                } else {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OCT_FK;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.ContactName;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Phone;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Mobile;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Email;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Fax;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.PhoneExtension;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.HomePhone;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OtherPhone;
                    var tempSupConObj = _.filter(res, {
                        'PK': ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OCT_FK
                    })[0];
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsignorContact = tempSupConObj;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = tempSupConObj.Title + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Email + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Phone;
                } else {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    var tempBuyObj = _.filter(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIPorOrderHeader.ORG_Buyer_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj)
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.Loaded = true
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders()
                getMDMDefaulvalues()
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OAD_Address_FK;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OAD_Code;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.CompanyName;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address1;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address2;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.PostCode;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.City;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.State;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Country;
                        var tempBuyObj = _.filter(res, {
                            'PK': ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OAD_Address_FK
                        })[0];
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = tempBuyObj;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address1 + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address2 + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.City + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.State + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.PostCode + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Phone + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Fax;
                    } else {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OCT_FK;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.ContactName;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Phone;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Mobile;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Email;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Fax;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.PhoneExtension;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.HomePhone;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OtherPhone;
                        var tempBuyConObj = _.filter(res, {
                            'PK': ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OCT_FK
                        })[0];
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContact = tempBuyConObj;
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = tempBuyConObj.Title + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Email + "\n" + ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Phone;
                    } else {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.buyerName = "";
            }
        }

        function getMDMDefaulvalues() {
            if (ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                            // if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                            //     var obj = _.filter(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                            //         'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                            //     })[0];
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                            //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                            // }
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;
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
                return ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
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
                return ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getServices() {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }

            apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                    if (ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                        for (var i in ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                'ServiceCode': ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var i in ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                        }
                    }
                }
            });


        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function AutoCompleteOnSelect($item, model, code, IsArray) {
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, $item, code, IsArray);
        }


        // function AddContainer() {
        //     ContainerValidation()
        //     if (ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer.length == 0) {
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj.SHP_BookingOnlyLink = ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj.IsDeleted = false
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.push(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj);
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj = {};
        //     }
        // }

        // function ContainerValidation() {

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj.ContainerCount, 'E0008', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj.RC_Type, 'E0009', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.CntObj.RH_NKContainerCommodityCode, 'E0010', false);
        // }

        // function DeleteContainer(item, index) {
        //     var _index = ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.splice(index, 1);
        //     } else {
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer[index].IsDeleted = true
        //     }
        // }

        // function PackageAdd() {
        //     PackageValidation()
        //     if (ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage == 0) {
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.SHP_FK = ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.FreightMode = 'OUT';
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.IsDeleted = false
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj);
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj = {};
        //     }
        // }

        // function PackageValidation() {

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.PackageCount, 'E0011', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.F3_NKPackType, 'E0012', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeight, 'E0013', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeightUQ, 'E0014', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolume, 'E0015', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolumeUQ, 'E0016', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.Length, 'E0017', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.Width, 'E0018', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.Height, 'E0019', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.PackObj.UnitOfDimension, 'E0020', false);

        // }

        // function DeletePackage(item, index) {
        //     var _index = ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
        //     } else {
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines[index].IsDeleted = true
        //     }
        // }

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
        //                     "ParentObj": ConvertBookingBranchEditDirectiveCtrl.ePage
        //                 };
        //                 return exports;
        //             }
        //         }
        //     }).result.then(
        //         function (response) { },
        //         function (response) { }
        //     );
        // }

        // function DeleteVessel(item, index) {
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UISailingList.splice(index, 1);
        // }

        // function getDocuments() {
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.Documents = {};
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.Autherization = authService.getUserInfo().AuthToken;
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.fileDetails = [];
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.fileSize = 10;
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;

        //     var _additionalValue = {
        //         "Entity": "Shipment",
        //         "Path": ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo
        //     };

        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.AdditionalValue = JSON.stringify(_additionalValue);
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.GetUploadedFiles = GetUploadedFiles;
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.GetSelectedFiles = GetSelectedFiles;
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.docdownloadDoc = DocdownloadDoc;
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.removeDocument = RemoveDocument;
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails = [];

        //     GetDocType();
        //     // getJobDocuments()
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

        //             ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = _list;
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
        //             UploadedDateTime: new Date()
        //         };
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.push(_obj);
        //     });

        // }

        // function GetUploadedFiles(Files, docType) {
        //     Files.map(function (value1, key1) {
        //         ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value2, key2) {
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
        //             EntityRefKey: ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //             EntityRefCode: ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //             DocumentName: _object,
        //             DocumentType: row.DocumentType
        //         };
        //     }
        //     _input.Status = "Success"

        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.push(_input)
        //     row.IsNew = false;
        //     // apiService.postEaxis('JobDocument/Upsert/c0b3b8d9-2248-44cd-a425-99c85c6c36d8', [_input]).then(function (response) {
        //     //     if (response.data.Response) {
        //     //         var _response = response.data.Response[0];
        //     //         for (var x in _response) {
        //     //             row[x] = _response[x];
        //     //         }
        //     //         row.IsNew = false;
        //     //         appService.messageBox("Saved Successfully...!");
        //     //     } else {
        //     //         alert("Failed to Save...!");
        //     //     }
        //     // });
        // }

        // function DocdownloadDoc(doc) {
        //     apiService.getEaxis('JobDocument/DownloadFile/' + doc.PK + '/c0b3b8d9-2248-44cd-a425-99c85c6c36d8').then(function (response) {
        //         if (response.data.Response) {
        //             if (response.data.Response !== "No Records Found!") {
        //                 appService.downloadDocument(response.data.Response);
        //             }
        //         } else { }
        //     });
        // }

        // function RemoveDocument(item, index) {
        //     // item.Status = "Deleted"
        //     // item.IsActive = true;
        //     // item.IsModified = true;
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.splice(index, 1)
        //     ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.splice(index, 1)
        //     // apiService.postEaxis('JobDocument/Upsert/c0b3b8d9-2248-44cd-a425-99c85c6c36d8', [item]).then(function (response) {
        //     //     getJobDocuments()
        //     // });
        // }

        function getOpenOrders() {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.paginationOptions = {
                "IsShpCreated": "false",
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "Buyer": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                "Supplier": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            };
            GetGridConfig();
            getDataAsynPage(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.paginationOptions)
        }

        function GetGridConfig() {
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.column = [

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
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.column,
                data: ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {

            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.gridOptions.data = []
            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.IsLoading = true
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data = response.data.Response
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (val, key) {
                        var _index = _.findIndex(ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data, function (o) {
                            return o.PK == val.PK;
                        });

                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data.splice(_index, 1)

                    });
                    if (ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data.length === 0) {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data = [];
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.IsLoading = false
                GetGridConfig()
            });


        }

        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data,
                "order": ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data,
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

            modalInstance.result.then(function () {

            }, function () {

            });

        }

        function DeAttachOrder(row, index) {
            if (row.SHP_FK != null || row.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data.push(row)
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
            } else {
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.data.push(row)
                ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
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



        function initValidation() {

            if (ConvertBookingBranchEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container');
                errorWarningService.AddModuleToList("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package');
                errorWarningService.AddModuleToList("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo];
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer = errorWarningService.Modules.MyTask.Entity[ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'].GlobalErrorWarningList;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjContainer = errorWarningService.Modules.MyTask.Entity[ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'];
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage = errorWarningService.Modules.MyTask.Entity[ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'].GlobalErrorWarningList;
                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjPackage = errorWarningService.Modules.MyTask.Entity[ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'];
            }

        }

        function GeneralValidation($item, IsApproval) {
            var _input = $item;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.IncoTerm, 'E0003', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Origin, 'E0004', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfLoading, 'E0006', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfDischarge, 'E0007', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Destination, 'E0005', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.HBLAWBChargesDisplay, 'E0039', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ExportForwarder_Code, 'E0047', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ImportForwarder_Code, 'E0048', false, undefined);
            // errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.JobComments, 'E0035', false, undefined);
            // if (_input.UIJobRoutes.length == 0) {
            //     errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0033', false, undefined);
            // } else {
            //     errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0033', false, undefined);
            // }
            var tempArrayDoc = []
            if (_input.UIShipmentHeader.BookingType == 'CB') {
                if (ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {

                        if (val.DocumentType == 'PKL' || val.DocumentType == 'INP' || val.DocumentType == 'CIV') {
                            tempArrayDoc.push(val);
                        }
                    });

                    if (tempArrayDoc.length > 0) {
                        errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
                    } else {
                        errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                    }


                } else {
                    errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                }
            } else {
                errorWarningService.OnFieldValueChange("MyTask", ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
            }
            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function SubmitBooking(IsApproval, type, flag) {
            GeneralValidation(ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data, IsApproval).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    // (ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.InternalComments) ? JobInsertInput('IWN', 'Internal', ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data) : false;
                    // (ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.JobComments) ? JobInsertInput('GEN', 'Job', ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data) : false;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = true;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type] = "Please wait";
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = true
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK = ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.PK;

                    var _array = [];
                    for (var i in ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList) {
                        if (i !== "CfxTypeList") {
                            _array.push(ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[i]);
                        }
                    }
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress = [];
                    _array.map(function (value, key) {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress.push(value);
                    });
                    if (type == 'Approval') {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsBooking = true
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo["Is" + ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingType + flag] = true
                    } else {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsBooking = true
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo["Is" + ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingType + flag] = false
                    }

                    // ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsBooking = true;
                    // ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.IsQBApprovalRequired = IsApproval;
                    apiService.post("eAxisAPI", appConfig.Entities.Booking.API.Insert.Url, ConvertBookingBranchEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                        if (response.data.Response) {
                            // toastr.success(response.data.Response.UIShipmentHeader.ShipmentNo + " Created")
                            ConvertBookingMapping(type, response.data.Response.UIShipmentHeader.ShipmentNo);

                        } else {
                            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = false;
                            ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = false
                            if (type == 'Approval') {
                                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type] = 'Send For Booking Approval'
                            } else {
                                ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type] = 'Confirm Booking'
                            }
                            toastr.error("Failed...");
                        }
                    });
                } else {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(ConvertBookingBranchEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function ConvertBookingMapping(type, ShipmentNo) {
            var _inputArray = [];
            for (var j = 0; j < ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder.length; j++) {
                var _input = {
                    "PK": "",
                    "SPA_FK": ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder[j].PK,
                    "SPH_FK": ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder[j].SPH_FK,
                    "POH_FK": ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SelectedOrder[j].POH_FK,
                };
                _inputArray.push(_input);
            }

            apiService.post("eAxisAPI", appConfig.Entities.ConvertToBookingMapping.API.Insert.Url, _inputArray).then(function (response) {
                if (response.data.Response) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        closeButtonVisible: false,
                        actionButtonText: 'Ok',
                        headerText: 'Booking Created Successfully..',
                        bodyText: ShipmentNo
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            ConvertBookingBranchEditDirectiveCtrl.onComplete(ConvertBookingBranchEditDirectiveCtrl.taskObj)
                            ConvertBookingBranchEditDirectiveCtrl.onRefreshStatusCount()
                            ConvertBookingBranchEditDirectiveCtrl.onRefreshTask()
                        }, function () {
                            console.log("Cancelled");
                        });
                } else {
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = false;
                    ConvertBookingBranchEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = false;
                    if (type == 'Approval') {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type] = 'Send For Booking Approval'
                    } else {
                        ConvertBookingBranchEditDirectiveCtrl.ePage.Masters["SaveBooking" + type] = 'Verify Booking'
                    }
                    toastr.error("Mapping Failed...");
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

        Init();
    }
})();