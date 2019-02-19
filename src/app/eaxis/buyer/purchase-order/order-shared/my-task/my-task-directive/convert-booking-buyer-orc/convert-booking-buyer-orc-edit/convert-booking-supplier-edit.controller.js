(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingSupplierEditDirectiveController", ConvertBookingSupplierEditDirectiveController);

    ConvertBookingSupplierEditDirectiveController.$inject = ["$scope", "$uibModal", "$window", "$q", "$injector", "helperService", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "errorWarningService", "confirmation"];

    function ConvertBookingSupplierEditDirectiveController($scope, $uibModal, $window, $q, $injector, helperService, apiService, authService, appConfig, APP_CONSTANT, toastr, errorWarningService, confirmation) {
        var ConvertBookingSupplierEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage = {
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
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingApprovalDisabled = false;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingVerifiedDisabled = false;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingApproval = "Send For Booking Approval";
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingVerified = "Verify Booking";

            SupplierInit();
            GetRelatedLookupList()
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SupplierInit() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.TaskObj = ConvertBookingSupplierEditDirectiveCtrl.taskObj;

            // if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.ConvertBookingDirect) {
            // GetGridConfig();
            // ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.isConverted = true;
            // }
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConvertBooking = ConvertBooking;

            OrderGrid();
        }

        function OrderGrid() {
            var _filter = {
                "PK": ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerOrder.API.findall.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.status = true;
                    });
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                    // if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.ConvertBookingDirect) {
                    // ConvertBooking(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder)
                    // }
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                } else {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
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
            if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.modeChange = ModeChange;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking"
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = false;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.isConverted = true;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.submitBooking = SubmitBooking;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.Loaded = false
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
                // error warning modal
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
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
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response.Response;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingType = 'CB'
                    OrderGetById();
                    initValidation();
                    OrderFindAll();
                    StandardMenuConfig()

                    var obj = {
                        [ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                            ePage: ConvertBookingSupplierEditDirectiveCtrl.ePage
                        },
                        label: ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        code: ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                    };
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.TabObj = obj;
                }
            });
        }

        function StandardMenuConfig() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails = [];
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ContainerHeader = {
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
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.RoutingHeader = {

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
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

        function OrderFindAll() {
            var Pks = '';
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (val, key) {
                Pks += val.POH_FK + ','
            });
            var obj = {
                "FieldName": "POH_PKS",
                "value": Pks.slice(0, -1)
            };

            var _input = {
                "searchInput": [obj],
                "FilterID": appConfig.Entities.BuyerOrder.API.findall.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function OrderGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].POH_FK).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder = response.data.Response;
                    var obj = _.filter(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                        'Key': ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.ContainerMode
                    })[0];
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.selectedMode = obj
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.TransportMode;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.ContainerMode;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.IncoTerm;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.CargoReadyDate = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.CargoReadyDate;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.GoodsAvailableAt;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.GoodsDeliveredTo;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.PortOfLoading;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.PortOfDischarge;

                    OrgInit();
                    // getAttachedOrders()
                    getServices();
                    // getDocuments();
                }
            });
        }

        function cfxTypeList() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList = {}
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
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList[value] = response.data.Response[value];
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
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.PackType = response.data.Response;
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
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType = response.data.Response
                    // var obj = _.filter(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                    //     'Key': ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    // })[0];
                    // ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        function ModeChange(obj) {
            if (obj) {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm()
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
        }

        function OrgInit() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;
            var defaultOrg = Getfullorg(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].Supplier);
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
                return ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OAD_Address_FK;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OAD_Code;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.CompanyName;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address1 = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address1;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address2;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.PostCode;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.City;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.State;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Country;
                    var tempSupObj = _.filter(res, {
                        'PK': ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OAD_Address_FK
                    })[0];
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = tempSupObj;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddress = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address1 + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Address2 + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.City + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.State + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.PostCode + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Phone + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Fax;
                } else {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OCT_FK;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.ContactName;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Phone;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Mobile;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Email;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Fax;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.PhoneExtension;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.HomePhone;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OtherPhone;
                    var tempSupConObj = _.filter(res, {
                        'PK': ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.OCT_FK
                    })[0];
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContact = tempSupConObj;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = tempSupConObj.Title + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Email + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.CRA.Phone;
                } else {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    var tempBuyObj = _.filter(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIOrder_Buyer.ORG_Buyer_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj)
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.Loaded = true
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders()
                getMDMDefaulvalues()
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OAD_Address_FK;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OAD_Code;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.CompanyName;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address1;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address2;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.PostCode;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.City;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.State;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Country;
                        var tempBuyObj = _.filter(res, {
                            'PK': ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OAD_Address_FK
                        })[0];
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = tempBuyObj;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address1 + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Address2 + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.City + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.State + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.PostCode + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Phone + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Fax;
                    } else {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OCT_FK;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.ContactName;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Phone;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Mobile;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Email;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Fax;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.PhoneExtension;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.HomePhone;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OtherPhone;
                        var tempBuyConObj = _.filter(res, {
                            'PK': ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.OCT_FK
                        })[0];
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContact = tempBuyConObj;
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = tempBuyConObj.Title + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Email + "\n" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.defaultOrder.UIAddressContactList.SCP.Phone;
                    } else {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.buyerName = "";
            }
        }

        function getMDMDefaulvalues() {
            if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                            // if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                            //     var obj = _.filter(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                            //         'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                            //     })[0];
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                            //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                            // }
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;
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
                return ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
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
                return ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getServices() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }

            apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                    if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                        for (var i in ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                'ServiceCode': ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var i in ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                        }
                    }
                }
            });


        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function AutoCompleteOnSelect($item, model, code, IsArray) {
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, $item, code, IsArray);
        }


        // function AddContainer() {
        //     ContainerValidation()
        //     if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer.length == 0) {
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj.SHP_BookingOnlyLink = ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj.FreightMode = 'OUT';
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj.IsDeleted = false;
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainerUICntContainer.push(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj);
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj = {};
        //     }
        // }

        // function ContainerValidation() {

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj.ContainerCount, 'E0008', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj.RC_Type, 'E0009', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.CntObj.RH_NKContainerCommodityCode, 'E0010', false);
        // }

        // function DeleteContainer(item, index) {
        //     var _index = ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.splice(index, 1);
        //     } else {
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer[index].IsDeleted = true
        //     }
        // }

        // function PackageAdd() {
        //     PackageValidation()
        //     if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage == 0) {
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.SHP_FK = ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.FreightMode = 'OUT';
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.IsDeleted = false
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj);
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj = {};
        //     }
        // }

        // function PackageValidation() {

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.PackageCount, 'E0011', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.F3_NKPackType, 'E0012', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeight, 'E0013', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeightUQ, 'E0014', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolume, 'E0015', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolumeUQ, 'E0016', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.Length, 'E0017', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.Width, 'E0018', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.Height, 'E0019', false);

        //     errorWarningService.OnFieldValueChange('MyTask', ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.PackObj.UnitOfDimension, 'E0020', false);

        // }

        // function DeletePackage(item, index) {
        //     var _index = ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
        //     } else {
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines[index].IsDeleted = true
        //     }
        // }

        // function getDocuments() {
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.Documents = {};
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.Autherization = authService.getUserInfo().AuthToken;
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.fileDetails = [];
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.fileSize = 10;
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;

        //     var _additionalValue = {
        //         "Entity": "Shipment",
        //         "Path": ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo
        //     };

        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.AdditionalValue = JSON.stringify(_additionalValue);
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.GetUploadedFiles = GetUploadedFiles;
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.GetSelectedFiles = GetSelectedFiles;
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.docdownloadDoc = DocdownloadDoc;
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.removeDocument = RemoveDocument;
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails = [];

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

        //             ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = _list;
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
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.push(_obj);
        //     });

        // }

        // function GetUploadedFiles(Files, docType) {
        //     Files.map(function (value1, key1) {
        //         ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value2, key2) {
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
        //             EntityRefKey: ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //             EntityRefCode: ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //             DocumentName: _object,
        //             DocumentType: row.DocumentType
        //         };
        //     }
        //     _input.Status = "Success"

        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.push(_input)
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
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.splice(index, 1)
        //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.splice(index, 1)
        //     // apiService.postEaxis('JobDocument/Upsert/c0b3b8d9-2248-44cd-a425-99c85c6c36d8', [item]).then(function (response) {
        //     //     getJobDocuments()
        //     // });
        // }

        function getOpenOrders() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions = {
                "IsShpCreated": "false",
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "Buyer": ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                "Supplier": ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            };
            GetGridConfig();
            getDataAsynPage(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions)
        }

        function GetGridConfig() {
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.column = [

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
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.column,
                data: ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {

            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.gridOptions.data = []
            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsLoading = true
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data = response.data.Response
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (val, key) {
                        var _index = _.findIndex(ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data, function (o) {
                            return o.PK == val.PK;
                        });

                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data.splice(_index, 1)

                    });
                    if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data.length === 0) {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data = [];
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsLoading = false
                GetGridConfig()
            });


        }

        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data,
                "order": ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data,
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
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data.push(row)
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
            } else {
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.data.push(row)
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
            }
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            if (obj.OrderType == 'POR') {
                $window.open("#/EA/single-record-view/order-view?q=" + _queryString, "_blank");
            } else if (obj.OrderType == 'DOR') {
                $window.open("#/EA/single-record-view/delivery-order-view?q=" + _queryString, "_blank");
            }
        }



        function initValidation() {

            if (ConvertBookingSupplierEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container');
                errorWarningService.AddModuleToList("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo];
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer = errorWarningService.Modules.MyTask.Entity[ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'].GlobalErrorWarningList;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjContainer = errorWarningService.Modules.MyTask.Entity[ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'];
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage = errorWarningService.Modules.MyTask.Entity[ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'].GlobalErrorWarningList;
                ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjPackage = errorWarningService.Modules.MyTask.Entity[ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'];
            }

        }

        function GeneralValidation($item) {
            var _input = $item;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.IncoTerm, 'E0003', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Origin, 'E0004', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfLoading, 'E0006', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfDischarge, 'E0007', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Destination, 'E0005', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.HBLAWBChargesDisplay, 'E0039', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ExportForwarder_Code, 'E0047', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ImportForwarder_Code, 'E0048', false, undefined);
            var tempArrayDoc = []
            if (_input.UIShipmentHeader.BookingType == 'CB') {
                if (ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {

                        if (val.DocumentType == 'PKL' || val.DocumentType == 'INP' || val.DocumentType == 'CIV') {
                            tempArrayDoc.push(val);
                        }
                    });

                    if (tempArrayDoc.length > 0) {
                        errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
                    } else {
                        errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                    }


                } else {
                    errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                }
            } else {
                errorWarningService.OnFieldValueChange("MyTask", ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
            }

            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function SubmitBooking() {
            GeneralValidation(ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.IsDisableSave = true;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK = ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo["Is" + ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingType + 'ApprovalRequired'] = false
                    // for (var i = 0; i < ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder.length; i++) {
                    //     var obj = {
                    //         "PK": ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].POH_FK
                    //     }
                    //     ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.push(obj);
                    // }
                    var _array = [];
                    for (var i in ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList) {
                        if (i !== "CfxTypeList") {
                            _array.push(ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[i]);
                        }
                    }
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress = [];
                    _array.map(function (value, key) {
                        ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress.push(value);
                    });
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBooking = "Please wait.."
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = true
                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsBooking = true;
                    apiService.post("eAxisAPI", appConfig.Entities.Booking.API.Insert.Url, ConvertBookingSupplierEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                        if (response.data.Response) {
                            // toastr.success(response.data.Response.UIShipmentHeader.ShipmentNo + " Created")
                            ConvertBookingMapping(response.data.Response.UIShipmentHeader.ShipmentNo)

                        } else {
                            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking"
                            ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = false
                        }
                    });

                } else {

                    ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(ConvertBookingSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });

        }

        function ConvertBookingMapping(ShipmentNo) {
            var _inputArray = [];
            for (var j = 0; j < ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder.length; j++) {
                var _input = {
                    "PK": "",
                    "SPA_FK": ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder[j].PK,
                    "SPH_FK": ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder[j].SPH_FK,
                    "POH_FK": ConvertBookingSupplierEditDirectiveCtrl.ePage.Masters.SelectedOrder[j].POH_FK,
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
                            ConvertBookingSupplierEditDirectiveCtrl.onComplete(ConvertBookingSupplierEditDirectiveCtrl.taskObj)
                            ConvertBookingSupplierEditDirectiveCtrl.onRefreshStatusCount()
                            ConvertBookingSupplierEditDirectiveCtrl.onRefreshTask()
                        }, function () {
                            console.log("Cancelled");
                        });

                } else {
                    toastr.error("Failed...");
                }
            });
        }

        Init();
    }
})();