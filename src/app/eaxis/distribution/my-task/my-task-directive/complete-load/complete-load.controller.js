(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteLoadDirectiveController", CompleteLoadDirectiveController);

    CompleteLoadDirectiveController.$inject = ["$scope", "$rootScope", "apiService", "helperService", "distributionConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout", "dynamicLookupConfig", "outwardConfig", "$uibModal", "$window"];

    function CompleteLoadDirectiveController($scope, $rootScope, apiService, helperService, distributionConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout, dynamicLookupConfig, outwardConfig, $uibModal, $window) {
        var CompleteLoadCtrl = this;

        function Init() {
            CompleteLoadCtrl.ePage = {
                "Title": "",
                "Prefix": "Complete_Load",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            InitFunction();
        }
        // #region - Init function
        function InitFunction() {
            CompleteLoadCtrl.ePage.Masters.TaskObj = CompleteLoadCtrl.taskObj;
            CompleteLoadCtrl.ePage.Masters.EntityObj = CompleteLoadCtrl.entityObj;
            CompleteLoadCtrl.ePage.Masters.TabObj = CompleteLoadCtrl.tabObj;

            CompleteLoadCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CompleteLoadCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            // errorWarningService.Modules = {};

            if (CompleteLoadCtrl.ePage.Masters.EntityObj) {
                CompleteLoadCtrl.ePage.Meta.IsLoading = true;
                CompleteLoadCtrl.ePage.Entities.Header.Data = CompleteLoadCtrl.ePage.Masters.TabObj[CompleteLoadCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                CompleteLoadCtrl.ePage.Masters.TabList = CompleteLoadCtrl.ePage.Masters.TabObj;
                CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                CompleteLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                $timeout(function () {
                    if (!CompleteLoadCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getOutwardDetails();
                        if (CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK)
                            getManifestDetails();
                        else
                            CompleteLoadCtrl.ePage.Masters.ManifestDetails = [];
                        outwardConfig.ValidationFindall();
                        CompleteLoadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                        var AddressType = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "INW" ? "DEL" : "PIC";
                        if (CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "ORD") {
                            var Receiver_ORG_FK = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        } else {
                            var Sender_ORG_FK = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        }

                        CompleteLoadCtrl.ePage.Masters.DefaultManifestFilter = {
                            "AddressType": AddressType,
                            "Sender_ORG_FK": Sender_ORG_FK,
                            "Receiver_ORG_FK": Receiver_ORG_FK,
                            "ManifestStatus": "TBK"
                        };
                    }
                }, 500);

            } else if (CompleteLoadCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }
            CompleteLoadCtrl.ePage.Masters.Save = Save;
            CompleteLoadCtrl.ePage.Masters.Complete = Complete;
            CompleteLoadCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            CompleteLoadCtrl.ePage.Masters.AttachOutward = AttachOutward;
            CompleteLoadCtrl.ePage.Masters.AttachManifest = AttachManifest;
            CompleteLoadCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            CompleteLoadCtrl.ePage.Masters.ManifestSingleRecordView = ManifestSingleRecordView;
            CompleteLoadCtrl.ePage.Masters.DeleteManifest = DeleteManifest;
            CompleteLoadCtrl.ePage.Masters.Delete = Delete;
            CompleteLoadCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            CompleteLoadCtrl.ePage.Masters.setManifestSelectedRow = setManifestSelectedRow;

            CompleteLoadCtrl.ePage.Masters.Load = Load;
            CompleteLoadCtrl.ePage.Masters.SaveLoad = SaveLoad;
            CompleteLoadCtrl.ePage.Masters.CloseLoadModel = CloseLoadModel;
            CompleteLoadCtrl.ePage.Masters.setLoadedItemSelectedRow = setLoadedItemSelectedRow;
            CompleteLoadCtrl.ePage.Masters.AddToLine = AddToLine;

            CompleteLoadCtrl.ePage.Masters.LoadManifest = LoadManifest;
            CompleteLoadCtrl.ePage.Masters.SaveLoadManifest = SaveLoadManifest;
            CompleteLoadCtrl.ePage.Masters.CloseLoadManifestModel = CloseLoadManifestModel;
            CompleteLoadCtrl.ePage.Masters.setLoadedManifestSelectedRow = setLoadedManifestSelectedRow;
            CompleteLoadCtrl.ePage.Masters.AddToLineManifest = AddToLineManifest;

            CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
            CompleteLoadCtrl.ePage.Masters.SaveBtnText = "Save";
            CompleteLoadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            CompleteLoadCtrl.ePage.Masters.SaveButtonText = "Save";
            CompleteLoadCtrl.ePage.Masters.LoadSaveButtonText = "Save";

            CompleteLoadCtrl.ePage.Masters.selectedRow = -1;
            CompleteLoadCtrl.ePage.Masters.selectedManifestRow = -1;
            CompleteLoadCtrl.ePage.Masters.selectedLoadedItemRow = -1;
            CompleteLoadCtrl.ePage.Masters.IsAttached = false;
            StandardMenuConfig();
        }
        // #endregion

        function AddToLineManifest() {
            CompleteLoadCtrl.ePage.Masters.SelectedManifestItem.LoadedDateTime = new Date();
            if (!CompleteLoadCtrl.ePage.Masters.SelectedManifestItem.Quantity)
                CompleteLoadCtrl.ePage.Masters.SelectedManifestItem.Quantity = 1;
            else
                CompleteLoadCtrl.ePage.Masters.SelectedManifestItem.Quantity = CompleteLoadCtrl.ePage.Masters.SelectedManifestItem.Quantity;
        }

        function setLoadedManifestSelectedRow(index, item) {
            CompleteLoadCtrl.ePage.Masters.selectedLoadedManifestRow = index;
            CompleteLoadCtrl.ePage.Masters.SelectedManifestItem = item;
        }

        function SaveLoadManifest() {
            var _count = 0, _count1 = 0;
            CompleteLoadCtrl.ePage.Masters.LoadSaveButtonText = "Please Wait..";
            CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            angular.forEach(CompleteLoadCtrl.ePage.Masters.ConsignManifestItemDetails, function (value, key) {
                if (value.LoadedDateTime) {
                    _count = _count + 1;
                    value.IsModified = true;
                    apiService.post("eAxisAPI", distributionConfig.Entities.TmsManifestItem.API.Update.Url, value).then(function (response) {
                        if (response.data.Response) {
                            console.log("updated");
                            _count1 = _count1 + 1;
                            if (_count == _count1) {
                                CompleteLoadCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                                CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                toastr.success("Saved Successfully");
                            }
                        }
                    });
                }
            });
            if (_count == 0) {
                CompleteLoadCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
            }
        }

        function LoadManifest() {
            CompleteLoadCtrl.ePage.Meta.IsLoading = true;
            if (CompleteLoadCtrl.ePage.Masters.ManifestDetails.TmsManifestConsignment[CompleteLoadCtrl.ePage.Masters.selectedManifestRow].TMC_ServiceType == "ORD") {
                var _filter = {
                    "WorkOrderID": CompleteLoadCtrl.ePage.Masters.ManifestDetails.TmsManifestConsignment[CompleteLoadCtrl.ePage.Masters.selectedManifestRow].TMC_ConsignmentNumber
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": distributionConfig.Entities.WmsPickReleaseLine.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", distributionConfig.Entities.WmsPickReleaseLine.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response.Response) {
                        CompleteLoadCtrl.ePage.Masters.PickReleaseLineDetails = response.data.Response.Response;
                        CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                        OpenLoadModal().result.then(function (response) { }, function () { });
                    }
                });
            } else {
                var _filter = {
                    "TMC_FK": CompleteLoadCtrl.ePage.Masters.ManifestDetails.TmsManifestConsignment[CompleteLoadCtrl.ePage.Masters.selectedManifestRow].TMC_FK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": distributionConfig.Entities.TmsManifestItem.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", distributionConfig.Entities.TmsManifestItem.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CompleteLoadCtrl.ePage.Masters.ConsignManifestItemDetails = response.data.Response;
                        OpenManifestItemModel().result.then(function (response) { }, function () { });
                        CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                    }
                });
            }
        }

        function OpenManifestItemModel() {
            return CompleteLoadCtrl.ePage.Masters.modalInstance1 = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-load/load-consignment.html"
            });
        }

        function CloseLoadManifestModel() {
            CompleteLoadCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
        }

        function AddToLine() {
            if (CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.WPL_FK) {
                CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.WPL_LoadedQty = CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.Units;
                CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.WPL_LoadStartDateTime = new Date();

                var _TempPack = 0, _TempLoadedQty = 0;
                angular.forEach(CompleteLoadCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                    _TempPack = _TempPack + value.Units;
                    _TempLoadedQty = _TempLoadedQty + value.WPL_LoadedQty;
                });
                if (_TempPack == _TempLoadedQty) {
                    angular.forEach(CompleteLoadCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                        value.WPL_LoadEndDateTime = new Date();
                    });
                }
            }
            if (CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.WRL_FK) {
                CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.WRL_LoadedQty = CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.Units;
                CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine.WRL_LoadStartDateTime = new Date();

                var _TempPack = 0, _TempLoadedQty = 0;
                angular.forEach(CompleteLoadCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                    _TempPack = _TempPack + value.Units;
                    _TempLoadedQty = _TempLoadedQty + value.WRL_LoadedQty;
                });
                if (_TempPack == _TempLoadedQty) {
                    angular.forEach(CompleteLoadCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                        value.WRL_LoadEndDateTime = new Date();
                    });
                }
            }
            CompleteLoadCtrl.ePage.Masters.selectedLoadedItemRow = -1;
        }

        function setLoadedItemSelectedRow(index, item) {
            CompleteLoadCtrl.ePage.Masters.selectedLoadedItemRow = index;
            CompleteLoadCtrl.ePage.Masters.SelectedPickReleaseLine = item;
        }

        function SaveLoad() {
            var _count = 0, _count1 = 0;
            CompleteLoadCtrl.ePage.Masters.LoadSaveButtonText = "Please Wait..";
            CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            angular.forEach(CompleteLoadCtrl.ePage.Masters.PickReleaseLineDetails, function (value, key) {
                if (value.WPL_LoadedQty) {
                    _count = _count + 1;
                    apiService.post("eAxisAPI", distributionConfig.Entities.WmsPickReleaseLine.API.UpdateSelectedColumns.Url, value).then(function (response) {
                        if (response.data.Response) {
                            console.log("updated");
                            _count1 = _count1 + 1;
                            if (_count == _count1) {
                                CompleteLoadCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                                CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                toastr.success("Saved Successfully");
                            }
                        }
                    });
                }
            });
            if (_count == 0) {
                CompleteLoadCtrl.ePage.Masters.LoadSaveButtonText = "Save";
                CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
            }
        }

        function Load() {
            CompleteLoadCtrl.ePage.Meta.IsLoading = true;
            var _filter = {
                "WorkOrderID": CompleteLoadCtrl.ePage.Masters.OutwardDetails[CompleteLoadCtrl.ePage.Masters.selectedRow].WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsPickReleaseLine.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", distributionConfig.Entities.WmsPickReleaseLine.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.Response) {
                    CompleteLoadCtrl.ePage.Masters.PickReleaseLineDetails = response.data.Response.Response;
                    CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                    OpenLoadModal().result.then(function (response) { }, function () { });
                }
            });
        }

        $scope.filter1 = function (x) {
            if (!x.WPL_LoadStartDateTime) {
                return true;
            } else {
                return;
            }
        };

        $scope.filter2 = function (x) {
            if (x.WPL_LoadStartDateTime) {
                return true;
            } else {
                return;
            }
        };

        $scope.filter3 = function (x) {
            if (!x.LoadedDateTime) {
                return true;
            } else {
                return;
            }
        };

        $scope.filter4 = function (x) {
            if (x.LoadedDateTime) {
                return true;
            } else {
                return;
            }
        };

        function OpenLoadModal() {
            return CompleteLoadCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-load/load-outward.html"
            });
        }

        function CloseLoadModel() {
            CompleteLoadCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function Delete(item) {
            CompleteLoadCtrl.ePage.Meta.IsLoading = true;
            var value = CompleteLoadCtrl.ePage.Masters.OutwardDetails[CompleteLoadCtrl.ePage.Masters.selectedRow];
            value.TGP_FK = null;
            value.GatepassNo = null;
            value.IsModified = true;
            apiService.post("eAxisAPI", distributionConfig.Entities.WmsOutward.API.Update.Url, value).then(function (response) {
                if (response.data.Response) {
                    CompleteLoadCtrl.ePage.Masters.OutwardDetails.splice(CompleteLoadCtrl.ePage.Masters.selectedRow, 1);
                    CompleteLoadCtrl.ePage.Masters.selectedRow = -1;
                    toastr.success("Outward Deleted Successfully");
                    CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                }
            });
        }

        function getManifestDetails() {
            CompleteLoadCtrl.ePage.Meta.IsLoading = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TmsManifestList.API.GetById.Url + CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                if (response.data.Response) {
                    CompleteLoadCtrl.ePage.Masters.ManifestDetails = response.data.Response;
                    CompleteLoadCtrl.ePage.Masters.IsAttached = true;
                    CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                    CompleteLoadCtrl.ePage.Masters.IsAttachedManifest = true;
                }
            });
        }

        function setSelectedRow(index) {
            CompleteLoadCtrl.ePage.Masters.selectedRow = index;
        }

        function setManifestSelectedRow(index) {
            CompleteLoadCtrl.ePage.Masters.selectedManifestRow = index;
        }

        function DeleteManifest() {
            CompleteLoadCtrl.ePage.Meta.IsLoading = true;
            CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK = null;
            CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.JDAFK = null;
            CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TMM_ManifestNumber = null;
            CompleteLoadCtrl.ePage.Entities.Header.Data.TmsManifestpickupanddelivery = {};
            CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;
            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, CompleteLoadCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    CompleteLoadCtrl.ePage.Masters.ManifestDetails.splice(CompleteLoadCtrl.ePage.Masters.selectedManifestRow, 1);
                    CompleteLoadCtrl.ePage.Masters.selectedManifestRow = -1;
                    toastr.success("Manifest Deleted Successfully");
                    CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                }
            });
        }

        function ManifestSingleRecordView(item) {
            var _queryString = {
                PK: item.TMM_FK,
                ManifestNumber: item.TMM_ManifestNumber,
                ConfigName: "dmsManifestConfig",
                // Header: item
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/outwardmanifest/" + _queryString, "_blank");
        }
        // #region - attach manifest
        function AttachManifest(item) {
            if (item.length == 1) {
                if (CompleteLoadCtrl.ePage.Masters.ManifestDetails.length == 0) {
                    var _isExist = CompleteLoadCtrl.ePage.Masters.ManifestDetails.some(function (value1, index1) {
                        return value1.PK === item[0].PK;
                    });
                    if (!_isExist) {
                        CompleteLoadCtrl.ePage.Meta.IsLoading = true;
                        CompleteLoadCtrl.ePage.Masters.ManifestDetails.push(item[0]);
                        CompleteLoadCtrl.ePage.Masters.IsAttached = true;
                        CompleteLoadCtrl.ePage.Masters.IsAttachedManifest = true;
                        CompleteLoadCtrl.ePage.Entities.Header.Data.TmsManifestpickupanddelivery = item[0];
                        CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK = item[0].EntityRefKey;
                        CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TMM_ManifestNumber=item[0].ManifestNumber;
                        CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.JDAFK = item[0].JDA_FK;
                        CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;
                        apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, CompleteLoadCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                toastr.success("Manifest Attached Successfully");
                                CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    } else {
                        toastr.warning(item[0].EntityRefKey + " Already available");
                    }
                } else {
                    toastr.warning("Only one Manifest should be Attached to this Gatepass");
                }
            } else {
                toastr.warning("Please select one Manifest");
            }
        }
        // #endregion       
        // #region - single record view 
        function SingleRecordView(item) {
            var _queryString = {
                PK: item.PK,
                WorkOrderID: item.WorkOrderID
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/gatepassoutward/" + _queryString, "_blank");
        }
        // #endregion               
        // #region - attach outward
        function AttachOutward(item) {
            angular.forEach(item, function (value, key) {
                var _isExist = CompleteLoadCtrl.ePage.Masters.OutwardDetails.some(function (value1, index1) {
                    return value1.PK === value.PK;
                });
                if (!_isExist) {
                    CompleteLoadCtrl.ePage.Meta.IsLoading = true;
                    value.TGP_FK = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.PK;
                    value.GatepassNo = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                    value.ArrivalDate = new Date();
                    value.IsModified = true;
                    apiService.post("eAxisAPI", distributionConfig.Entities.WmsOutward.API.Update.Url, value).then(function (response) {
                        if (response.data.Response) {
                            CompleteLoadCtrl.ePage.Masters.IsAttached = true;
                            CompleteLoadCtrl.ePage.Masters.IsAttachedOutward = true;
                            CompleteLoadCtrl.ePage.Masters.OutwardDetails.push(response.data.Response);
                            toastr.success("Outward Attached Successfully");
                            CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                        }
                    });
                } else {
                    toastr.warning(value.WorkOrderID + " Already Available...!");
                }
            });
        }
        // #endregion
        // #region - get outward details based on gatepass
        function getOutwardDetails() {
            var _filter = {
                "GatepassNo": CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsOutward.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.WmsOutward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CompleteLoadCtrl.ePage.Masters.OutwardDetails = response.data.Response;
                    if (CompleteLoadCtrl.ePage.Masters.OutwardDetails.length > 0) {
                        CompleteLoadCtrl.ePage.Masters.IsAttached = true;
                        CompleteLoadCtrl.ePage.Masters.IsAttachedOutward = true;
                    }
                }
            });
        }
        // #endregion
        // #region - get task level configuration  - common
        function getTaskConfigData() {
            var EEM_Code_3;
            if (CompleteLoadCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = CompleteLoadCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": CompleteLoadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EEM_Code_3": EEM_Code_3,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CompleteLoadCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    CompleteLoadCtrl.ePage.Masters.MenuListSource = $filter('filter')(CompleteLoadCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    CompleteLoadCtrl.ePage.Masters.ValidationSource = $filter('filter')(CompleteLoadCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (CompleteLoadCtrl.ePage.Masters.ValidationSource.length > 0) {
                        CompleteLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        CompleteLoadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    CompleteLoadCtrl.ePage.Masters.DocumentValidation = $filter('filter')(CompleteLoadCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (CompleteLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    CompleteLoadCtrl.ePage.Masters.MenuObj = CompleteLoadCtrl.taskObj;
                    CompleteLoadCtrl.ePage.Masters.MenuObj.TabTitle = CompleteLoadCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (CompleteLoadCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: CompleteLoadCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: CompleteLoadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                CompleteLoadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (CompleteLoadCtrl.ePage.Masters.TaskObj) {
                // errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: CompleteLoadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof CompleteLoadCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                CompleteLoadCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(CompleteLoadCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            CompleteLoadCtrl.ePage.Masters.docTypeSource = $filter('filter')(CompleteLoadCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(CompleteLoadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                "EntityRefKey": CompleteLoadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": CompleteLoadCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": CompleteLoadCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (CompleteLoadCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(CompleteLoadCtrl.ePage.Masters.docTypeSource, 'DocType');
                        var DocumentListSource = _.groupBy(response.data.Response, 'DocumentType');
                        angular.forEach(TempDocTypeSource, function (value1, key1) {
                            angular.forEach(DocumentListSource, function (value, key) {
                                if (key == key1) {
                                    _arr.push(value);
                                }
                            });
                        });
                        deferred.resolve(_arr);
                    } else {
                        deferred.resolve(_arr);
                    }
                }
            });
            return deferred.promise;
        }
        // #endregion
        // #region - get entity obj details
        function getGatepassDetails() {
            CompleteLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + CompleteLoadCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    CompleteLoadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    CompleteLoadCtrl.ePage.Meta.IsLoading = false;
                    CompleteLoadCtrl.ePage.Entities.Header.Data = CompleteLoadCtrl.ePage.Masters.GatepassDetails;

                    if (!CompleteLoadCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getOutwardDetails();
                        if (CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK)
                            getManifestDetails();
                        else
                            CompleteLoadCtrl.ePage.Masters.ManifestDetails = [];
                        GetDynamicLookupConfig();
                        outwardConfig.ValidationFindall();
                        CompleteLoadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatusIn": "OCP,OAS",
                            "ClientCode": CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                        var AddressType = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "INW" ? "DEL" : "PIC";
                        if (CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "ORD") {
                            var Receiver_ORG_FK = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        } else {
                            var Sender_ORG_FK = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        }

                        CompleteLoadCtrl.ePage.Masters.DefaultManifestFilter = {
                            "AddressType": AddressType,
                            "Sender_ORG_FK": Sender_ORG_FK,
                            "Receiver_ORG_FK": Receiver_ORG_FK,
                            "ManifestStatus": "TBK"
                        };

                        if (CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo)
                            CompleteLoadCtrl.ePage.Masters.str = CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo.replace(/\//g, '');
                        else
                            CompleteLoadCtrl.ePage.Masters.str = "New";
                    }
                }
            });
        }
        // #endregion
        // #region - general
        function StandardMenuConfig() {
            CompleteLoadCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": CompleteLoadCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": CompleteLoadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": CompleteLoadCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": CompleteLoadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": CompleteLoadCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": CompleteLoadCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetDynamicLookupConfig() {
            var _filter = {
                pageName: 'WarehouseOutward'
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
        // #endregion
        // #region - Save and Complete 
        function Complete() {
            if (CompleteLoadCtrl.ePage.Masters.ValidationSource.length > 0 || CompleteLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (CompleteLoadCtrl.ePage.Masters.ValidationSource.length > 0) {

                    if (CompleteLoadCtrl.ePage.Masters.OutwardDetails.length > 0 || CompleteLoadCtrl.ePage.Masters.ManifestDetails.length > 0) {
                        CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrderNo = true;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: CompleteLoadCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: CompleteLoadCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (CompleteLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (CompleteLoadCtrl.ePage.Masters.docTypeSource.length == 0 || CompleteLoadCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            CompleteLoadCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            CompleteLoadCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: CompleteLoadCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (CompleteLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(CompleteLoadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        CompleteLoadCtrl.ePage.Masters.ShowErrorWarningModal(CompleteLoadCtrl.taskObj.PSI_InstanceNo);
                        if (CompleteLoadCtrl.ePage.Masters.IsTaskList) {
                            CompleteLoadCtrl.getErrorWarningList({
                                $item: _errorcount
                            });
                        }
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function CompleteWithSave() {
            CompleteLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            CompleteLoadCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadEndTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: CompleteLoadCtrl.ePage.Masters.TaskObj
                    };

                    CompleteLoadCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                CompleteLoadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                CompleteLoadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            CompleteLoadCtrl.ePage.Entities.Header.Data = filterObjectUpdate(CompleteLoadCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, CompleteLoadCtrl.ePage.Entities.Header.Data).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function Save() {
            CompleteLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            CompleteLoadCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    CompleteLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    CompleteLoadCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
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
        // #endregion

        Init();
    }
})();
