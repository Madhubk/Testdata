(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartLoadDirectiveController", StartLoadDirectiveController);

    StartLoadDirectiveController.$inject = ["$scope", "$rootScope", "apiService", "helperService", "distributionConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout", "dynamicLookupConfig", "outwardConfig", "$uibModal", "$window"];

    function StartLoadDirectiveController($scope, $rootScope, apiService, helperService, distributionConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout, dynamicLookupConfig, outwardConfig, $uibModal, $window) {
        var StartLoadCtrl = this;

        function Init() {
            StartLoadCtrl.ePage = {
                "Title": "",
                "Prefix": "Start_load",
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
            StartLoadCtrl.ePage.Masters.TaskObj = StartLoadCtrl.taskObj;
            StartLoadCtrl.ePage.Masters.EntityObj = StartLoadCtrl.entityObj;
            StartLoadCtrl.ePage.Masters.TabObj = StartLoadCtrl.tabObj;

            StartLoadCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            StartLoadCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            errorWarningService.Modules = {};

            if (StartLoadCtrl.ePage.Masters.EntityObj) {
                StartLoadCtrl.ePage.Meta.IsLoading = true;
                StartLoadCtrl.ePage.Entities.Header.Data = StartLoadCtrl.ePage.Masters.TabObj[StartLoadCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                StartLoadCtrl.ePage.Masters.TabList = StartLoadCtrl.ePage.Masters.TabObj;
                StartLoadCtrl.ePage.Meta.IsLoading = false;
                StartLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                $timeout(function () {
                    if (!StartLoadCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getOutwardDetails();
                        outwardConfig.ValidationFindall();
                        StartLoadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                    }
                }, 500);

            } else if (StartLoadCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }
            StartLoadCtrl.ePage.Masters.Save = Save;
            StartLoadCtrl.ePage.Masters.Complete = Complete;
            StartLoadCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            // StartLoadCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            StartLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
            StartLoadCtrl.ePage.Masters.SaveBtnText = "Save";
            StartLoadCtrl.ePage.Masters.StartLoadText = "Start Load";
            StartLoadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            StartLoadCtrl.ePage.Masters.SaveButtonText = "Save";

            StartLoadCtrl.ePage.Masters.selectedRow = -1;
            StandardMenuConfig();
        }
        // #endregion       
        // #region - get Outward details based on gatepass
        function getOutwardDetails() {
            var _filter = {
                "GatepassNo": StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsOutward.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.WmsOutward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    StartLoadCtrl.ePage.Masters.OutwardDetails = response.data.Response;
                }
            });
        }
        // #endregion
        // #region - get task level configuration  - common
        function getTaskConfigData() {
            var EEM_Code_3;
            if (StartLoadCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = StartLoadCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": StartLoadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    StartLoadCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    StartLoadCtrl.ePage.Masters.MenuListSource = $filter('filter')(StartLoadCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    StartLoadCtrl.ePage.Masters.ValidationSource = $filter('filter')(StartLoadCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (StartLoadCtrl.ePage.Masters.ValidationSource.length > 0) {
                        StartLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        StartLoadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    StartLoadCtrl.ePage.Masters.DocumentValidation = $filter('filter')(StartLoadCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (StartLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    StartLoadCtrl.ePage.Masters.MenuObj = StartLoadCtrl.taskObj;
                    StartLoadCtrl.ePage.Masters.MenuObj.TabTitle = StartLoadCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (StartLoadCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: StartLoadCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: StartLoadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                StartLoadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (StartLoadCtrl.ePage.Masters.TaskObj) {
                errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: StartLoadCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof StartLoadCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                StartLoadCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(StartLoadCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            StartLoadCtrl.ePage.Masters.docTypeSource = $filter('filter')(StartLoadCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(StartLoadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                "EntityRefKey": StartLoadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": StartLoadCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": StartLoadCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (StartLoadCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(StartLoadCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            StartLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + StartLoadCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    StartLoadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    StartLoadCtrl.ePage.Meta.IsLoading = false;
                    StartLoadCtrl.ePage.Entities.Header.Data = StartLoadCtrl.ePage.Masters.GatepassDetails;

                    getTaskConfigData();
                    if (!StartLoadCtrl.ePage.Masters.IsTaskList) {
                        getOutwardDetails();
                        GetDynamicLookupConfig();
                        outwardConfig.ValidationFindall();
                        StartLoadCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                        if (StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo)
                            StartLoadCtrl.ePage.Masters.str = StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo.replace(/\//g, '');
                        else
                            StartLoadCtrl.ePage.Masters.str = "New";
                    }
                }
            });
        }
        // #endregion
        // #region - general
        function StandardMenuConfig() {
            StartLoadCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": StartLoadCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": StartLoadCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": StartLoadCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": StartLoadCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": StartLoadCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": StartLoadCtrl.ePage.Masters.TaskObj.EntitySource,
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
            if (StartLoadCtrl.ePage.Masters.ValidationSource.length > 0 || StartLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (StartLoadCtrl.ePage.Masters.ValidationSource.length > 0) {

                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: StartLoadCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: StartLoadCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (StartLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (StartLoadCtrl.ePage.Masters.docTypeSource.length == 0 || StartLoadCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            StartLoadCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            StartLoadCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: StartLoadCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (StartLoadCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(StartLoadCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        StartLoadCtrl.ePage.Masters.ShowErrorWarningModal(StartLoadCtrl.taskObj.PSI_InstanceNo);
                        if (StartLoadCtrl.ePage.Masters.IsTaskList) {
                            StartLoadCtrl.getErrorWarningList({
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
            StartLoadCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            StartLoadCtrl.ePage.Masters.StartLoadText = "Please Wait...";
            StartLoadCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadStartTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: StartLoadCtrl.ePage.Masters.TaskObj
                    };

                    StartLoadCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                StartLoadCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                StartLoadCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            StartLoadCtrl.ePage.Entities.Header.Data = filterObjectUpdate(StartLoadCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, StartLoadCtrl.ePage.Entities.Header.Data).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function Save() {
            StartLoadCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            StartLoadCtrl.ePage.Masters.IsDisableSaveBtn = true;
            StartLoadCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    StartLoadCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    StartLoadCtrl.ePage.Masters.SaveBtnText = "Save";
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
