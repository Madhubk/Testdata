(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartUnloadDirectiveController", StartUnloadDirectiveController);

    StartUnloadDirectiveController.$inject = ["$scope", "$rootScope", "apiService", "helperService", "distributionConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout", "dynamicLookupConfig", "inwardConfig", "$uibModal"];

    function StartUnloadDirectiveController($scope, $rootScope, apiService, helperService, distributionConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout, dynamicLookupConfig, inwardConfig, $uibModal) {
        var StartUnloadCtrl = this;

        function Init() {
            StartUnloadCtrl.ePage = {
                "Title": "",
                "Prefix": "Start_Unload",
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
            StartUnloadCtrl.ePage.Masters.TaskObj = StartUnloadCtrl.taskObj;
            StartUnloadCtrl.ePage.Masters.EntityObj = StartUnloadCtrl.entityObj;
            StartUnloadCtrl.ePage.Masters.TabObj = StartUnloadCtrl.tabObj;

            StartUnloadCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            StartUnloadCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            errorWarningService.Modules = {};

            if (StartUnloadCtrl.ePage.Masters.EntityObj) {
                StartUnloadCtrl.ePage.Meta.IsLoading = true;
                StartUnloadCtrl.ePage.Entities.Header.Data = StartUnloadCtrl.ePage.Masters.TabObj[StartUnloadCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                StartUnloadCtrl.ePage.Masters.TabList = StartUnloadCtrl.ePage.Masters.TabObj;
                StartUnloadCtrl.ePage.Meta.IsLoading = false;
                StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                $timeout(function () {
                    if (!StartUnloadCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getInwardDetails();
                        inwardConfig.ValidationFindall();
                        StartUnloadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                    }
                }, 500);

            } else if (StartUnloadCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }
            StartUnloadCtrl.ePage.Masters.Save = Save;
            StartUnloadCtrl.ePage.Masters.Complete = Complete;
            StartUnloadCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            StartUnloadCtrl.ePage.Masters.CreateNewInward = CreateNewInward;
            StartUnloadCtrl.ePage.Masters.AttachInward = AttachInward;
            StartUnloadCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
            StartUnloadCtrl.ePage.Masters.SaveInward = SaveInward;
            StartUnloadCtrl.ePage.Masters.AddReceiveLines = AddReceiveLines;
            StartUnloadCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            StartUnloadCtrl.ePage.Masters.CloseReceiveLineModel = CloseReceiveLineModel;
            StartUnloadCtrl.ePage.Masters.Delete = Delete;

            StartUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
            StartUnloadCtrl.ePage.Masters.SaveBtnText = "Save";
            // StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            StartUnloadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            StartUnloadCtrl.ePage.Masters.SaveButtonText = "Save";

            StartUnloadCtrl.ePage.Masters.selectedRow = -1;
            StandardMenuConfig();
        }
        // #endregion
        // #region - add, delete receive lines
        function Delete() {
            var value = StartUnloadCtrl.ePage.Masters.InwardDetails[StartUnloadCtrl.ePage.Masters.selectedRow];
            value.TGP_FK = null;
            value.GatepassNo = null;
            value.IsModified = true;
            apiService.post("eAxisAPI", distributionConfig.Entities.WmsInward.API.Update.Url, value).then(function (response) {
                if (response.data.Response) {
                    StartUnloadCtrl.ePage.Masters.InwardDetails.splice(StartUnloadCtrl.ePage.Masters.selectedRow, 1);
                    StartUnloadCtrl.ePage.Masters.selectedRow = -1;
                    toastr.success("Inward Deleted Successfully");
                }
            });
        }

        function AddReceiveLines() {
            inwardConfig.TabList = [];
            StartUnloadCtrl.ePage.Masters.TabList = [];
            StartUnloadCtrl.ePage.Meta.IsLoading = true;
            inwardConfig.GetTabDetails(StartUnloadCtrl.ePage.Masters.InwardDetails[StartUnloadCtrl.ePage.Masters.selectedRow], false).then(function (response) {
                var _currentInward = response[0];
                _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.Client = _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode + "-" + _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
                _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode + "-" + _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName;
                _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode + "-" + _currentInward[_currentInward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;

                if (StartUnloadCtrl.ePage.Masters.InwardDetails[StartUnloadCtrl.ePage.Masters.selectedRow].ORG_Client_FK) {
                    var _filter = {
                        "ORG_FK": StartUnloadCtrl.ePage.Masters.InwardDetails[StartUnloadCtrl.ePage.Masters.selectedRow].ORG_Client_FK
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

                            StartUnloadCtrl.ePage.Masters.TabList = _currentInward;

                            StartUnloadCtrl.ePage.Meta.IsLoading = false;
                            OpenReceiveLineModal().result.then(function (response) { }, function () { });
                            StartUnloadCtrl.ePage.Masters.selectedRow = -1;
                        }
                    });
                }
            });
        }

        function setSelectedRow(index) {
            StartUnloadCtrl.ePage.Masters.selectedRow = index;
        }

        function OpenReceiveLineModal() {
            return StartUnloadCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-unload/add-receive-lines.html"
            });
        }

        function CloseReceiveLineModel() {
            StartUnloadCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }
        // #endregion
        // #region - save inward
        function SaveInward(type) {
            StartUnloadCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            StartUnloadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            $rootScope.SaveInwardFromTask(function (response) {
                if (response == "error") {
                    StartUnloadCtrl.ePage.Masters.SaveButtonText = "Save";
                    StartUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                } else {
                    StartUnloadCtrl.ePage.Masters.SaveButtonText = "Save";
                    StartUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    if (type == "AddingReceiveLine") {
                        CloseReceiveLineModel();
                    } else if (type == "InwardCreation") {
                        toastr.success("Inward Saved Succuessfully");
                        StartUnloadCtrl.ePage.Masters.InwardDetails.push(StartUnloadCtrl.ePage.Masters.TabList[StartUnloadCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.UIWmsInwardHeader);
                        CloseEditActivity();
                    }
                }
            });
        }
        // #endregion
        // #region - Creating Inward
        function CreateNewInward() {
            inwardConfig.TabList = [];
            StartUnloadCtrl.ePage.Meta.IsLoading = true;
            helperService.getFullObjectUsingGetById(distributionConfig.Entities.WmsInwardList.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIWmsInwardHeader.ClientCode = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode;
                    response.data.Response.Response.UIWmsInwardHeader.ClientName = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName;
                    response.data.Response.Response.UIWmsInwardHeader.Client = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode + "-" + StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName;
                    response.data.Response.Response.UIWmsInwardHeader.ORG_Client_FK = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Client_FK;
                    response.data.Response.Response.UIWmsInwardHeader.WAR_FK = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_PK;
                    response.data.Response.Response.UIWmsInwardHeader.Warehouse = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode + "-" + StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName;
                    response.data.Response.Response.UIWmsInwardHeader.WarehouseCode = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode;
                    response.data.Response.Response.UIWmsInwardHeader.WarehouseName = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName;
                    response.data.Response.Response.UIWmsInwardHeader.WorkOrderType = "INW";
                    response.data.Response.Response.UIWmsInwardHeader.WorkOrderSubType = "REC";
                    response.data.Response.Response.UIWmsInwardHeader.TGP_FK = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.PK;
                    response.data.Response.Response.UIWmsInwardHeader.GatepassNo = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                    response.data.Response.Response.UIWmsInwardHeader.ArrivalDate = new Date();
                    angular.forEach(StartUnloadCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
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
                    StartUnloadCtrl.ePage.Masters.CreateInwardText = "Create Inward";
                    StartUnloadCtrl.ePage.Masters.IsDisabled = false;
                }
            });
        }

        function AddTab(currentInward, isNew) {
            StartUnloadCtrl.ePage.Masters.currentInward = undefined;

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
                StartUnloadCtrl.ePage.Masters.IsTabClick = true;
                var _currentInward = undefined;
                if (!isNew) {
                    _currentInward = currentInward;
                } else {
                    _currentInward = currentInward;
                }

                inwardConfig.GetTabDetails(_currentInward, isNew).then(function (response) {
                    StartUnloadCtrl.ePage.Masters.TabList = response[0];
                    StartUnloadCtrl.ePage.Meta.IsLoading = false;
                    OpenModal().result.then(function (response) { }, function () { });
                });
            } else {
                toastr.info('Inward already opened ');
            }
        }

        function OpenModal() {
            return StartUnloadCtrl.ePage.Masters.modalInstance1 = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "create-inward-modal right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-unload/create-inward.html"
            });
        }
        function CloseEditActivity() {
            StartUnloadCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
        }
        // #endregion
        // #region - attach inward
        function AttachInward(item) {
            angular.forEach(item, function (value, key) {
                var _isExist = StartUnloadCtrl.ePage.Masters.InwardDetails.some(function (value1, index1) {
                    return value1.PK === value.PK;
                });
                if (!_isExist) {
                    value.TGP_FK = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.PK;
                    value.GatepassNo = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                    value.ArrivalDate = new Date();
                    value.IsModified = true;
                    apiService.post("eAxisAPI", distributionConfig.Entities.WmsInward.API.Update.Url, value).then(function (response) {
                        if (response.data.Response) {
                            StartUnloadCtrl.ePage.Masters.InwardDetails.push(response.data.Response);
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
                "GatepassNo": StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsInward.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.WmsInward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    StartUnloadCtrl.ePage.Masters.InwardDetails = response.data.Response;
                }
            });
        }
        // #endregion
        // #region - get task level configuration  - common
        function getTaskConfigData() {
            var EEM_Code_3;
            if (StartUnloadCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = StartUnloadCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": StartUnloadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    StartUnloadCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    StartUnloadCtrl.ePage.Masters.MenuListSource = $filter('filter')(StartUnloadCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    StartUnloadCtrl.ePage.Masters.ValidationSource = $filter('filter')(StartUnloadCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (StartUnloadCtrl.ePage.Masters.ValidationSource.length > 0) {
                        StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    StartUnloadCtrl.ePage.Masters.DocumentValidation = $filter('filter')(StartUnloadCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (StartUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    StartUnloadCtrl.ePage.Masters.MenuObj = StartUnloadCtrl.taskObj;
                    StartUnloadCtrl.ePage.Masters.MenuObj.TabTitle = StartUnloadCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (StartUnloadCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: StartUnloadCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: StartUnloadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (StartUnloadCtrl.ePage.Masters.TaskObj) {
                errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: StartUnloadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof StartUnloadCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                StartUnloadCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(StartUnloadCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            StartUnloadCtrl.ePage.Masters.docTypeSource = $filter('filter')(StartUnloadCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(StartUnloadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                "EntityRefKey": StartUnloadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": StartUnloadCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": StartUnloadCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (StartUnloadCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(StartUnloadCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + StartUnloadCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    StartUnloadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    StartUnloadCtrl.ePage.Meta.IsLoading = false;
                    StartUnloadCtrl.ePage.Entities.Header.Data = StartUnloadCtrl.ePage.Masters.GatepassDetails;

                    if (!StartUnloadCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getInwardDetails();
                        GetDynamicLookupConfig();
                        inwardConfig.ValidationFindall();
                        StartUnloadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                        if (StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo)
                            StartUnloadCtrl.ePage.Masters.str = StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo.replace(/\//g, '');
                        else
                            StartUnloadCtrl.ePage.Masters.str = "New";
                    }
                }
            });
        }
        // #endregion
        // #region - general
        function StandardMenuConfig() {
            StartUnloadCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": StartUnloadCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": StartUnloadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": StartUnloadCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": StartUnloadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": StartUnloadCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": StartUnloadCtrl.ePage.Masters.TaskObj.EntitySource,
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
            if (StartUnloadCtrl.ePage.Masters.ValidationSource.length > 0 || StartUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (StartUnloadCtrl.ePage.Masters.ValidationSource.length > 0) {
                    if (StartUnloadCtrl.ePage.Masters.InwardDetails.length > 0) {
                        StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.InwardNo = true;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: StartUnloadCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: StartUnloadCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (StartUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (StartUnloadCtrl.ePage.Masters.docTypeSource.length == 0 || StartUnloadCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            StartUnloadCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            StartUnloadCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: StartUnloadCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (StartUnloadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(StartUnloadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        StartUnloadCtrl.ePage.Masters.ShowErrorWarningModal(StartUnloadCtrl.taskObj.PSI_InstanceNo);
                        if (StartUnloadCtrl.ePage.Masters.IsTaskList) {
                            StartUnloadCtrl.getErrorWarningList({
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
            StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            StartUnloadCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadStartTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: StartUnloadCtrl.ePage.Masters.TaskObj
                    };

                    StartUnloadCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                StartUnloadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                StartUnloadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            StartUnloadCtrl.ePage.Entities.Header.Data = filterObjectUpdate(StartUnloadCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, StartUnloadCtrl.ePage.Entities.Header.Data).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function Save() {
            StartUnloadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            StartUnloadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            StartUnloadCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    StartUnloadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    StartUnloadCtrl.ePage.Masters.SaveBtnText = "Save";
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
