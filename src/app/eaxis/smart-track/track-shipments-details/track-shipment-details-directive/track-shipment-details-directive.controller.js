(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackShipmentDetailsDirectiveController", TrackShipmentDetailsDirectiveController);

    TrackShipmentDetailsDirectiveController.$inject = ["$scope", "$timeout", "$location", "$injector", "helperService", "appConfig", "apiService", "authService", "$uibModal", "errorWarningService"];

    function TrackShipmentDetailsDirectiveController($scope, $timeout, $location, $injector, helperService, appConfig, apiService, authService, $uibModal, errorWarningService) {
        var TrackShipmentDetailsDirectiveCtrl = this;

        function Init() {
            var currentShipment = TrackShipmentDetailsDirectiveCtrl.currentShipment[TrackShipmentDetailsDirectiveCtrl.currentShipment.label].ePage.Entities;
            TrackShipmentDetailsDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Shipments_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks = {}
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.EditActivity = EditActivity;
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.CloseEditActivityModal = CloseEditActivityModal;
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.EmptyText = '-'
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.PackLines = [];
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ContainerList = [];
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ConsolRouting = [];
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ShipmentRouting = [];
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.JobServices = [];
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.JobEntryNum = [];
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Disable = "false";
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.SaveBtnText = "Send For Custom Clearance";
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CompleteBtnText = "Send For CheckList Approval";
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CustomClearance = CustomClearance;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CheckListApproval = CheckListApproval;
            // console.log(TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header);
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Shipment.Entity[TrackShipmentDetailsDirectiveCtrl.currentShipment.code].GlobalErrorWarningList;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Shipment.Entity[TrackShipmentDetailsDirectiveCtrl.currentShipment.code];
            GetMyTaskList()
            GetEventDetails()
            GetOrderDetails()
            GetRelatedShipmentList()
            GetShipRouting();
            GetConsolListing()
            GetPackingList()
            GetServiceList()
            GetReferenceDetails()
            InitShipmentHeader();

            // StandardMenuConfig();

        }

        function GetMyTaskList() {
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.Loading = true
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.WorkItemDetails = []
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                EntityRefKey: TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.PK,
                // KeyReference: TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.WorkItemDetails = response.data.Response;
                    }
                }
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.Loading = false;
            });
        }

        function EditActivityModalInstance($item) {
            var _templateName = "mytaskdefault-edit-modal";
            if (typeof $item.OtherConfig === 'string') {
                var OtherConfig = JSON.parse($item.OtherConfig)
                $item.OtherConfig = OtherConfig
            }
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.EditActivityItem = $item;

            return TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.EditActivityModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: _templateName + " right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.CloseEditActivityModal(false)">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>{{TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.EditActivityItem.WSI_StepName}} - {{TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.EditActivityItem.KeyReference}}</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body pt-10" id="modal-body">
                                        <my-task-dynamic-edit-directive task-obj='TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.EditActivityItem' entity-obj='' tab-obj='' on-complete="TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.CloseEditActivityModal(true)" ></my-task-dynamic-edit-directive>
                                    </div>`
            });
        }

        function EditActivity($item) {
            EditActivityModalInstance($item).result.then(function (response) { }, function () {
                console.log("Cancelled");
            });
        }

        function CloseEditActivityModal(type) {
            if (type) {
                GetMyTaskList()
            }
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.MyTasks.EditActivityModal.dismiss('cancel');
        }

        function GetEventDetails() {
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Events = {}
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Events.RowObj = TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Events.EntityRefKey = TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Events.EntityRefCode = TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Events.EntitySource = "SHP";
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Events.Entity = "Shipment"

        }

        function GetOrderDetails() {
            var _filter = {
                "SHP_FK": TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function GetRelatedShipmentList() {
            var _filter = {
                "RelatedShipment_FK": TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIRelatedShipments = response.data.Response;
                }
            });
        }

        function GetConsolListing() {
            var _filter = {
                "SHP_FK": TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    if (TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.NoConsol = false;
                        TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UICntContainers = response.data.Response[0].UICntContainerList;
                        GetContainerList(response.data.Response);
                        GetConsolDetails(response.data.Response[0]);
                        GetConsolRoutingDetails(response.data.Response[0]);
                    } else {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.NoConsol = true
                    }
                }
            });
        }

        function GetContainerList(data) {
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ContainerList.some(function (value3, index) {
                            return value3.PK === value2.PK;
                        });

                        if (!_isExist) {
                            var _obj = {
                                "ContainerNo": value2.ContainerNo,
                                "CNT": value2.PK,
                                "ContainerCount": value2.ContainerCount,
                                "RC_Type": value2.RC_Type,
                                "SealNo": value2.SealNo
                            };
                            //TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines
                            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ContainerList.push(_obj);
                            // console.log(TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ContainerList);
                        }
                    });
                });
            } else {
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ContainerList = [];
            }
        }

        function GetConsolDetails(obj) {
            apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + obj.CON_FK).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIConsolList = response.data.Response;
                    var _exports = {
                        "Entities": {
                            "Header": {
                                "Data": {},
                                "Meta": {}
                            }
                        }
                    };
                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [response.data.Response.UIConConsolHeader.ConsolNo]: {
                            ePage: _exports
                        },
                        label: response.data.Response.UIConConsolHeader.ConsolNo,
                        code: response.data.Response.UIConConsolHeader.ConsolNo,
                        isNew: false
                    };
                    TrackShipmentDetailsDirectiveCtrl.currentConsol = obj;
                }
            });

        }

        function GetConsolRoutingDetails(obj) {
            var _filter = {
                "FieldName": "EntityRefKey",
                "value": obj.CON_FK
            }

            var _input = {
                "searchInput": [_filter],
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ConsolRouting = response.data.Response;
                }
            });
        }

        function GetShipRouting() {
            var _filter = {
                "FieldName": "EntityRefKey",
                "value": TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.PK
            }

            var _input = {
                "searchInput": [_filter],
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;
                }
            });
        }

        function GetPackingList(list) {

            var _filter = {
                "SHP_FK": TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
                }
            });
        }

        function GetServiceList() {
            var _filter = {
                ParentID: TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.JobServices = response.data.Response;
                }
            });
        }

        function GetReferenceDetails() {

            $timeout(function () {
                if (TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIJobEntryNums.length > 0) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                        if (value.Category !== "CUS") {
                            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.JobEntryNum.push(value);
                        }
                    });
                } else {
                    console.log("Reference List is Empty");
                }
            }, 1000);
        }
        function InitShipmentHeader() {


            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Address = {};
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.OnContactChange = OnContactChange;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;
            TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            // TrackShipmentDetailsDirectiveCtrl.ePage.Masters.modeChange = ModeChange;

            // TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Meta.AddressContactObject = TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList;
        }
        // function AutoCompleteOnSelect($item, type, addressType, addressType1) {
        //     if (type === "address") {
        //         AddressContactList($item, addressType, addressType1);
        //     }
        //     if (addressType == 'CRD') {
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.OAD_RelatedPortCode
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code, 'E0031', false)

        //     }
        //     if (addressType == 'CED') {
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.OAD_RelatedPortCode
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.PK
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.Code
        //         TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code, 'E0032', false)

        //     }
        //     getMDMDefaulvalues()
        // }
        function getMDMDefaulvalues() {
            if (TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code && TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK + '/' + TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                if (TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode) {
                                    var obj = _.filter(TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CfxTypesList.CntType, {
                                        'Key': TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                                    })[0];
                                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                } else {
                                    var obj = _.filter(TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CfxTypesList.CntType, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                }
                                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.selectedMode = obj;
                                TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKGoodsValueCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency
                                TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.RX_NKInsuranceCur = response.data.Response.UIOrgBuyerSupplierMapping.Currency
                            }
                        }
                    }
                });
            }
        }
        function SelectedLookupData($item, type, addressType, addressType1) {
            if (type === "address") {
                AddressContactList($item.data.entity, addressType, addressType1);
            }
            if (addressType == 'CRD') {
                TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = $item.data.entity.OAD_RelatedPortCode
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code, 'E0031', false)

            }
            if (addressType == 'CED') {
                TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = $item.data.entity.OAD_RelatedPortCode
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, TrackShipmentDetailsDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code, 'E0032', false)

            }

            getMDMDefaulvalues()
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                str = $item.Address1 + " " + $item.Address2;;
                return str
            } else if ($item != undefined && type == "Contact") {
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str
            } else {
                return str
            }
        }
        function CheckFutureDate(fieldvalue, comparedFieldValue, code) {
            if (fieldvalue && comparedFieldValue) {
                var fieldvalueDate = new Date(fieldvalue);
                var comparedFieldValueDate = new Date(comparedFieldValue);
                if (code == 'E0042') {
                    if (fieldvalueDate > comparedFieldValueDate) {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, false, 'E0042', false)
                    } else {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0042', false)
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0043', false)

                    }
                } else if (code == 'E0043') {
                    if (fieldvalueDate < comparedFieldValueDate) {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, false, 'E0043', false)
                    } else {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0043', false)
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0042', false)

                    }
                } else if (code == 'E0044') {
                    if (fieldvalueDate >= comparedFieldValueDate) {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, false, 'E0044', false)
                    } else {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0044', false)
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0045', false)

                    }
                } else if (code == 'E0045') {
                    if (fieldvalueDate <= comparedFieldValueDate) {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, false, 'E0045', false)
                    } else {
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0045', false)
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0044', false)

                    }
                }
            } else {
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0042', false)
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0043', false)
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0044', false)
                TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Shipment', TrackShipmentDetailsDirectiveCtrl.currentShipment.code, true, 'E0045', false)

            }
        }
        // function StandardMenuConfig() {
        //     TrackShipmentDetailsDirectiveCtrl.ePage.Masters.StandardMenuInput = {
        //         // Entity
        //         "Entity": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
        //         "EntityRefKey": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
        //         "EntityRefCode": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
        //         "EntitySource": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
        //         "Communication": null,
        //         "Config": undefined,
        //         // Parent Entity
        //         "ParentEntityRefKey": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.PK,
        //         "ParentEntityRefCode": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
        //         "ParentEntitySource": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
        //         // Additional Entity
        //         "AdditionalEntityRefKey": undefined,
        //         "AdditionalEntityRefCode": undefined,
        //         "AdditionalEntitySource": undefined,
        //     };
        // }
        function CustomClearance(Action) {
            GeneralValidation(TrackShipmentDetailsDirectiveCtrl.ePage.Masters.EntityObj, Action).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
                    Save();
                    SaveOnly(Action).then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Task Completed Successfully...!");
                            var _data = {
                                IsCompleted: true,
                                Item: TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj
                            };

                            TrackShipmentDetailsDirectiveCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                        }
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CompleteBtnText = "Send For Custom Clearance";
                    });
                } else {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }
        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": "",
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": ""
                }
            }
            if (Action == 'CustomClearance') {
                _inputObj.DataSlots.Val1 = true;
            }
            if (Action == 'CheckListApproval') {
                _inputObj.DataSlots.Val1 = false;
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        function GeneralValidation($item, Action) {
            var _input = $item;
            var _deferred = $q.defer();
            if (Action == 'CheckListApproval') {
                errorWarningService.OnFieldValueChange("MyTask", TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShpExtendedInfo.CustomsIntegrationRefNo, 'E11057', false, undefined);
                errorWarningService.OnFieldValueChange("MyTask", TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShpExtendedInfo.NoOfCommodity, 'E11060', false, undefined);
                errorWarningService.OnFieldValueChange("MyTask", TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShpExtendedInfo.SupplierInvoiceNo, 'E11061', false, undefined);
            }
            if (Action == 'CustomClearance') {
                errorWarningService.OnFieldValueChange("MyTask", TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShpExtendedInfo.ShippingBillNo, 'E11058', false, undefined);
                errorWarningService.OnFieldValueChange("MyTask", TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShpExtendedInfo.ShippingBillDate, 'E11059', false, undefined);
            }
            _deferred.resolve(errorWarningService);
            return _deferred.promise;
        }
        function CheckListApproval(Action) {
            GeneralValidation(TrackShipmentDetailsDirectiveCtrl.ePage.Masters.EntityObj, Action).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                    Save();
                    SaveOnly(Action).then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Task Completed Successfully...!");
                            var _data = {
                                IsCompleted: true,
                                Item: TrackShipmentDetailsDirectiveCtrl.ePage.Masters.TaskObj
                            };

                            TrackShipmentDetailsDirectiveCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                        }
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        TrackShipmentDetailsDirectiveCtrl.ePage.Masters.CompleteBtnText = "Send For CheckList Approval";
                    });
                } else {
                    TrackShipmentDetailsDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(TrackShipmentDetailsDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        Init();
    }
})();