(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteUnloadDirectiveController", CompleteUnloadDirectiveController);

    CompleteUnloadDirectiveController.$inject = ["$scope", "$rootScope", "apiService", "helperService", "distributionConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout", "dynamicLookupConfig", "inwardConfig", "$uibModal", "$window"];

    function CompleteUnloadDirectiveController($scope, $rootScope, apiService, helperService, distributionConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout, dynamicLookupConfig, inwardConfig, $uibModal, $window) {
        var CompleteUnloadCtrl = this;

        function Init() {
            CompleteUnloadCtrl.ePage = {
                "Title": "",
                "Prefix": "Complete_Unload",
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
            CompleteUnloadCtrl.ePage.Masters.TaskObj = CompleteUnloadCtrl.taskObj;
            CompleteUnloadCtrl.ePage.Masters.EntityObj = CompleteUnloadCtrl.entityObj;
            CompleteUnloadCtrl.ePage.Masters.TabObj = CompleteUnloadCtrl.tabObj;

            CompleteUnloadCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CompleteUnloadCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            // errorWarningService.Modules = {};

            if (CompleteUnloadCtrl.ePage.Masters.EntityObj) {
                CompleteUnloadCtrl.ePage.Meta.IsLoading = true;
                CompleteUnloadCtrl.ePage.Entities.Header.Data = CompleteUnloadCtrl.ePage.Masters.TabObj[CompleteUnloadCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                CompleteUnloadCtrl.ePage.Masters.TabList = CompleteUnloadCtrl.ePage.Masters.TabObj;
                CompleteUnloadCtrl.ePage.Meta.IsLoading = false;
                CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                $timeout(function () {
                    if (!CompleteUnloadCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getInwardDetails();
                        inwardConfig.ValidationFindall();
                        CompleteUnloadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                    }
                }, 500);

            } else if (CompleteUnloadCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }
            CompleteUnloadCtrl.ePage.Masters.Save = Save;
            CompleteUnloadCtrl.ePage.Masters.Complete = Complete;
            CompleteUnloadCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            CompleteUnloadCtrl.ePage.Masters.CreateNewInward = CreateNewInward;
            CompleteUnloadCtrl.ePage.Masters.AttachInward = AttachInward;
            CompleteUnloadCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
            CompleteUnloadCtrl.ePage.Masters.SaveInward = SaveInward;
            CompleteUnloadCtrl.ePage.Masters.AddReceiveLines = AddReceiveLines;
            CompleteUnloadCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            CompleteUnloadCtrl.ePage.Masters.CloseReceiveLineModel = CloseReceiveLineModel;
            CompleteUnloadCtrl.ePage.Masters.Delete = Delete;
            CompleteUnloadCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            CompleteUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
            CompleteUnloadCtrl.ePage.Masters.SaveBtnText = "Save";
            // CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            CompleteUnloadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            CompleteUnloadCtrl.ePage.Masters.SaveButtonText = "Save";

            CompleteUnloadCtrl.ePage.Masters.selectedRow = -1;
            StandardMenuConfig();
        }
        // #endregion
        // #region - single record view
        function SingleRecordView(item) {
            var _queryString = {
                PK: item.PK,
                WorkOrderID: item.WorkOrderID
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/gatepassinward/" + _queryString, "_blank");
        }
        // #endregion
        // #region - add, delete receive lines
        function Delete() {
            var value = CompleteUnloadCtrl.ePage.Masters.InwardDetails[CompleteUnloadCtrl.ePage.Masters.selectedRow];
            value.TGP_FK = null;
            value.GatepassNo = null;
            value.IsModified = true;
            apiService.post("eAxisAPI", distributionConfig.Entities.WmsInward.API.Update.Url, value).then(function (response) {
                if (response.data.Response) {
                    CompleteUnloadCtrl.ePage.Masters.InwardDetails.splice(CompleteUnloadCtrl.ePage.Masters.selectedRow, 1);
                    CompleteUnloadCtrl.ePage.Masters.selectedRow = -1;
                    toastr.success("Inward Deleted Successfully");
                }
            });
        }

        function AddReceiveLines() {
            inwardConfig.TabList = [];
            CompleteUnloadCtrl.ePage.Masters.TabList = [];
            CompleteUnloadCtrl.ePage.Meta.IsLoading = true;
            inwardConfig.GetTabDetails(CompleteUnloadCtrl.ePage.Masters.InwardDetails[CompleteUnloadCtrl.ePage.Masters.selectedRow], false).then(function (response) {
                var _currentInward = response[0];
                _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.Client = _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode + "-" + _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
                _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode + "-" + _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName;
                _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode + "-" + _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;
                CompleteUnloadCtrl.ePage.Masters.TabList = _currentInward;

                if (CompleteUnloadCtrl.ePage.Masters.InwardDetails[CompleteUnloadCtrl.ePage.Masters.selectedRow].ORG_Client_FK) {
                    var _filter = {
                        "ORG_FK": CompleteUnloadCtrl.ePage.Masters.InwardDetails[CompleteUnloadCtrl.ePage.Masters.selectedRow].ORG_Client_FK
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                            _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                            _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                            _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                            _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                            _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;

                            CompleteUnloadCtrl.ePage.Masters.TabList = _currentInward;

                            CompleteUnloadCtrl.ePage.Meta.IsLoading = false;
                            OpenReceiveLineModal().result.then(function (response) { }, function () { });
                            CompleteUnloadCtrl.ePage.Masters.selectedRow = -1;
                        }
                    });
                }
            });
        }

        function setSelectedRow(index) {
            CompleteUnloadCtrl.ePage.Masters.selectedRow = index;
        }

        function OpenReceiveLineModal() {
            return CompleteUnloadCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-unload/add-receive-lines.html"
            });
        }

        function CloseReceiveLineModel() {
            CompleteUnloadCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }
        // #endregion
        // #region - save inward
        function SaveInward(type) {
            CompleteUnloadCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CompleteUnloadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            $rootScope.SaveInwardFromTask(function (response) {
                if (response == "error") {
                    CompleteUnloadCtrl.ePage.Masters.SaveButtonText = "Save";
                    CompleteUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                } else {
                    CompleteUnloadCtrl.ePage.Masters.SaveButtonText = "Save";
                    CompleteUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    if (type == "AddingReceiveLine") {
                        CloseReceiveLineModel();
                    } else if (type == "InwardCreation") {
                        toastr.success("Inward Saved Succuessfully");
                        CompleteUnloadCtrl.ePage.Masters.InwardDetails.push(CompleteUnloadCtrl.ePage.Masters.TabList[CompleteUnloadCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.UIWmsInwardHeader);
                        CloseEditActivity();
                    }
                }
            });
        }
        // #endregion
        // #region - Creating Inward
        function CreateNewInward() {
            inwardConfig.TabList = [];
            CompleteUnloadCtrl.ePage.Meta.IsLoading = true;
            helperService.getFullObjectUsingGetById(distributionConfig.Entities.WmsInwardList.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIWmsInwardHeader.ClientCode = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode;
                    response.data.Response.Response.UIWmsInwardHeader.ClientName = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName;
                    response.data.Response.Response.UIWmsInwardHeader.Client = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode + "-" + CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName;
                    response.data.Response.Response.UIWmsInwardHeader.ORG_Client_FK = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Client_FK;
                    response.data.Response.Response.UIWmsInwardHeader.WAR_FK = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_PK;
                    response.data.Response.Response.UIWmsInwardHeader.Warehouse = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode + "-" + CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName;
                    response.data.Response.Response.UIWmsInwardHeader.WarehouseCode = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode;
                    response.data.Response.Response.UIWmsInwardHeader.WarehouseName = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName;
                    response.data.Response.Response.UIWmsInwardHeader.WorkOrderType = "INW";
                    response.data.Response.Response.UIWmsInwardHeader.WorkOrderSubType = "REC";
                    response.data.Response.Response.UIWmsInwardHeader.TGP_FK = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.PK;
                    response.data.Response.Response.UIWmsInwardHeader.GatepassNo = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                    response.data.Response.Response.UIWmsInwardHeader.ArrivalDate = new Date();
                    angular.forEach(CompleteUnloadCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            response.data.Response.Response.UIOrgHeader.OAD_Address1 = value.Address1;
                            response.data.Response.Response.UIOrgHeader.OAD_Address2 = value.Address2;
                            response.data.Response.Response.UIOrgHeader.OAD_State = value.State;
                            response.data.Response.Response.UIOrgHeader.OAD_City = value.City;
                            response.data.Response.Response.UIOrgHeader.OAD_PostCode = value.Postcode;
                            response.data.Response.Response.UIOrgHeader.OAD_Mobile = value.Mobile;
                            response.data.Response.Response.UIOrgHeader.OAD_Email = value.Email;
                        }
                    });

                    var _obj = {
                        entity: response.data.Response.Response.UIWmsInwardHeader,
                        data: response.data.Response.Response,
                        Validations: response.data.Response.Validations
                    };
                    AddTab(_obj, true);
                    CompleteUnloadCtrl.ePage.Masters.CreateInwardText = "Create Inward";
                    CompleteUnloadCtrl.ePage.Masters.IsDisabled = false;
                }
            });
        }

        function AddTab(currentInward, isNew) {
            CompleteUnloadCtrl.ePage.Masters.currentInward = undefined;

            var _isExist = inwardConfig.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentInward.WorkOrderID)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                CompleteUnloadCtrl.ePage.Masters.IsTabClick = true;
                var _currentInward = undefined;
                if (!isNew) {
                    _currentInward = currentInward;
                } else {
                    _currentInward = currentInward;
                }

                inwardConfig.GetTabDetails(_currentInward, isNew).then(function (response) {
                    CompleteUnloadCtrl.ePage.Masters.TabList = response[0];
                    CompleteUnloadCtrl.ePage.Meta.IsLoading = false;
                    OpenModal().result.then(function (response) { }, function () { });
                });
            } else {
                toastr.info('Inward already opened ');
            }
        }

        function OpenModal() {
            return CompleteUnloadCtrl.ePage.Masters.modalInstance1 = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-unload/create-inward.html"
            });
        }
        function CloseEditActivity() {
            CompleteUnloadCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
        }
        // #endregion
        // #region - attach inward
        function AttachInward(item) {
            angular.forEach(item, function (value, key) {
                var _isExist = CompleteUnloadCtrl.ePage.Masters.InwardDetails.some(function (value1, index1) {
                    return value1.PK === value.PK;
                });
                if (!_isExist) {
                    value.TGP_FK = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.PK;
                    value.GatepassNo = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                    value.ArrivalDate = new Date();
                    value.IsModified = true;
                    apiService.post("eAxisAPI", distributionConfig.Entities.WmsInward.API.Update.Url, value).then(function (response) {
                        if (response.data.Response) {
                            CompleteUnloadCtrl.ePage.Masters.InwardDetails.push(response.data.Response);
                            toastr.success("Inward Attached Successfully");
                        }
                    });
                } else {
                    toastr.warning(value.WorkOrderID + " Already Available...!");
                }
            });
        }
        // #endregion
        // #region - get inward details based on gatepass
        function getInwardDetails() {
            var _filter = {
                "GatepassNo": CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsInward.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.WmsInward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CompleteUnloadCtrl.ePage.Masters.InwardDetails = response.data.Response;
                }
            });
        }
        // #endregion
        // #region - get task level configuration  - common
        function getTaskConfigData() {
            var EEM_Code_3;
            if (CompleteUnloadCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = CompleteUnloadCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": CompleteUnloadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    CompleteUnloadCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    CompleteUnloadCtrl.ePage.Masters.MenuListSource = $filter('filter')(CompleteUnloadCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    CompleteUnloadCtrl.ePage.Masters.ValidationSource = $filter('filter')(CompleteUnloadCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (CompleteUnloadCtrl.ePage.Masters.ValidationSource.length > 0) {
                        CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    CompleteUnloadCtrl.ePage.Masters.DocumentValidation = $filter('filter')(CompleteUnloadCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (CompleteUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    CompleteUnloadCtrl.ePage.Masters.MenuObj = CompleteUnloadCtrl.taskObj;
                    CompleteUnloadCtrl.ePage.Masters.MenuObj.TabTitle = CompleteUnloadCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (CompleteUnloadCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: CompleteUnloadCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: CompleteUnloadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (CompleteUnloadCtrl.ePage.Masters.TaskObj) {
                // errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: CompleteUnloadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof CompleteUnloadCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                CompleteUnloadCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(CompleteUnloadCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            CompleteUnloadCtrl.ePage.Masters.docTypeSource = $filter('filter')(CompleteUnloadCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(CompleteUnloadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                "EntityRefKey": CompleteUnloadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": CompleteUnloadCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": CompleteUnloadCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (CompleteUnloadCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(CompleteUnloadCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + CompleteUnloadCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    CompleteUnloadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    CompleteUnloadCtrl.ePage.Meta.IsLoading = false;
                    CompleteUnloadCtrl.ePage.Entities.Header.Data = CompleteUnloadCtrl.ePage.Masters.GatepassDetails;

                    if (!CompleteUnloadCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getInwardDetails();
                        GetDynamicLookupConfig();
                        inwardConfig.ValidationFindall();
                        CompleteUnloadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                        if (CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo)
                            CompleteUnloadCtrl.ePage.Masters.str = CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo.replace(/\//g, '');
                        else
                            CompleteUnloadCtrl.ePage.Masters.str = "New";
                    }
                }
            });
        }
        // #endregion
        // #region - general
        function StandardMenuConfig() {
            CompleteUnloadCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": CompleteUnloadCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": CompleteUnloadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": CompleteUnloadCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": CompleteUnloadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": CompleteUnloadCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": CompleteUnloadCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetDynamicLookupConfig() {
            var _filter = {
                pageName: 'WarehouseInward'
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
            if (CompleteUnloadCtrl.ePage.Masters.ValidationSource.length > 0 || CompleteUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (CompleteUnloadCtrl.ePage.Masters.ValidationSource.length > 0) {
                    if (CompleteUnloadCtrl.ePage.Masters.InwardDetails.length > 0) {
                        CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.InwardNo = true;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: CompleteUnloadCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: CompleteUnloadCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (CompleteUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (CompleteUnloadCtrl.ePage.Masters.docTypeSource.length == 0 || CompleteUnloadCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            CompleteUnloadCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            CompleteUnloadCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: CompleteUnloadCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (CompleteUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(CompleteUnloadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        CompleteUnloadCtrl.ePage.Masters.ShowErrorWarningModal(CompleteUnloadCtrl.taskObj.PSI_InstanceNo);
                        if (CompleteUnloadCtrl.ePage.Masters.IsTaskList) {
                            CompleteUnloadCtrl.getErrorWarningList({
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
            CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            CompleteUnloadCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadEndTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: CompleteUnloadCtrl.ePage.Masters.TaskObj
                    };

                    CompleteUnloadCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                CompleteUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                CompleteUnloadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            CompleteUnloadCtrl.ePage.Entities.Header.Data = filterObjectUpdate(CompleteUnloadCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, CompleteUnloadCtrl.ePage.Entities.Header.Data).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function Save() {
            CompleteUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            CompleteUnloadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            CompleteUnloadCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    CompleteUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    CompleteUnloadCtrl.ePage.Masters.SaveBtnText = "Save";
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
