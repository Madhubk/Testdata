(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DockOutDirectiveController", DockOutDirectiveController);

    DockOutDirectiveController.$inject = ["apiService", "helperService", "distributionConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout"];

    function DockOutDirectiveController(apiService, helperService, distributionConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout) {
        var DockOutDirectiveCtrl = this;

        function Init() {
            DockOutDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dock_Out",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            DockOutDirectiveCtrl.ePage.Masters.TaskObj = DockOutDirectiveCtrl.taskObj;
            DockOutDirectiveCtrl.ePage.Masters.EntityObj = DockOutDirectiveCtrl.entityObj;
            DockOutDirectiveCtrl.ePage.Masters.TabObj = DockOutDirectiveCtrl.tabObj;

            DockOutDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            errorWarningService.Modules = {};

            if (DockOutDirectiveCtrl.ePage.Masters.EntityObj) {
                DockOutDirectiveCtrl.ePage.Meta.IsLoading = true;
                DockOutDirectiveCtrl.ePage.Entities.Header.Data = DockOutDirectiveCtrl.ePage.Masters.TabObj[DockOutDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                DockOutDirectiveCtrl.ePage.Masters.TabList = DockOutDirectiveCtrl.ePage.Masters.TabObj;
                DockOutDirectiveCtrl.ePage.Meta.IsLoading = false;
                DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                getTaskConfigData();
            } else if (DockOutDirectiveCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }            
            DockOutDirectiveCtrl.ePage.Masters.Save = Save;
            DockOutDirectiveCtrl.ePage.Masters.Complete = Complete;
            DockOutDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            DockOutDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DockOutDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            // DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DockOutDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
            StandardMenuConfig();
        }

        function getTaskConfigData() {
            var EEM_Code_3;
            if (DockOutDirectiveCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = DockOutDirectiveCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": DockOutDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    DockOutDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    DockOutDirectiveCtrl.ePage.Masters.MenuListSource = $filter('filter')(DockOutDirectiveCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    DockOutDirectiveCtrl.ePage.Masters.ValidationSource = $filter('filter')(DockOutDirectiveCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (DockOutDirectiveCtrl.ePage.Masters.ValidationSource.length > 0) {
                        DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    DockOutDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(DockOutDirectiveCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (DockOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    DockOutDirectiveCtrl.ePage.Masters.MenuObj = DockOutDirectiveCtrl.taskObj;
                    DockOutDirectiveCtrl.ePage.Masters.MenuObj.TabTitle = DockOutDirectiveCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (DockOutDirectiveCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [DockOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: DockOutDirectiveCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: DockOutDirectiveCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (DockOutDirectiveCtrl.ePage.Masters.TaskObj) {
                errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [DockOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: DockOutDirectiveCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof DockOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                DockOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(DockOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            DockOutDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(DockOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(DockOutDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": DockOutDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": DockOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": DockOutDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": DockOutDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": DockOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (DockOutDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(DockOutDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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

        function getGatepassDetails() {
            DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + DockOutDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DockOutDirectiveCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    DockOutDirectiveCtrl.ePage.Meta.IsLoading = false;
                    DockOutDirectiveCtrl.ePage.Entities.Header.Data = DockOutDirectiveCtrl.ePage.Masters.GatepassDetails;
                    getTaskConfigData();
                }
            });
        }

        function StandardMenuConfig() {
            DockOutDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DockOutDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DockOutDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DockOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DockOutDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DockOutDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DockOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            if (DockOutDirectiveCtrl.ePage.Masters.ValidationSource.length > 0 || DockOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (DockOutDirectiveCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [DockOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: DockOutDirectiveCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: DockOutDirectiveCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (DockOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (DockOutDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || DockOutDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            DockOutDirectiveCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            DockOutDirectiveCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [DockOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: DockOutDirectiveCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[DockOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (DockOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(DockOutDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        DockOutDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(DockOutDirectiveCtrl.taskObj.PSI_InstanceNo);
                        DockOutDirectiveCtrl.getErrorWarningList({
                            $item: _errorcount
                        });
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function CompleteWithSave() {
            DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DockOutDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";            
            DockOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.DockoutTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: DockOutDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    DockOutDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                DockOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                DockOutDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function Save() {
            DockOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            DockOutDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DockOutDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    DockOutDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    DockOutDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            DockOutDirectiveCtrl.ePage.Entities.Header.Data = filterObjectUpdate(DockOutDirectiveCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, DockOutDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
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

        Init();
    }
})();
