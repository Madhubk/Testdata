(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AllocateDockDirectiveController", AllocateDockDirectiveController);

    AllocateDockDirectiveController.$inject = ["apiService", "helperService", "distributionConfig", "gatepassConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout"];

    function AllocateDockDirectiveController(apiService, helperService, distributionConfig, gatepassConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout) {
        var AllocateDockCtrl = this;

        function Init() {
            AllocateDockCtrl.ePage = {
                "Title": "",
                "Prefix": "Dock_In",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            AllocateDockCtrl.ePage.Masters.TaskObj = AllocateDockCtrl.taskObj;
            AllocateDockCtrl.ePage.Masters.EntityObj = AllocateDockCtrl.entityObj;
            AllocateDockCtrl.ePage.Masters.TabObj = AllocateDockCtrl.tabObj;

            AllocateDockCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // errorWarningService.Modules = {};

            if (AllocateDockCtrl.ePage.Masters.EntityObj) {
                AllocateDockCtrl.ePage.Meta.IsLoading = true;
                AllocateDockCtrl.ePage.Entities.Header.Data = AllocateDockCtrl.ePage.Masters.TabObj[AllocateDockCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                AllocateDockCtrl.ePage.Masters.TabList = AllocateDockCtrl.ePage.Masters.TabObj;
                AllocateDockCtrl.ePage.Meta.IsLoading = false;
                AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                getTaskConfigData();
                getDockNoList();
            } else if (AllocateDockCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }
            AllocateDockCtrl.ePage.Masters.DockInText = "Dock In";
            AllocateDockCtrl.ePage.Masters.Save = Save;
            AllocateDockCtrl.ePage.Masters.Complete = Complete;
            AllocateDockCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            AllocateDockCtrl.ePage.Masters.IsDisableSaveBtn = false;
            AllocateDockCtrl.ePage.Masters.SaveBtnText = "Save";
            // AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            AllocateDockCtrl.ePage.Masters.CompleteBtnText = "Complete";
            StandardMenuConfig();
        }

        function getDockNoList() {
            var _purpose;
            if (AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "INW")
                _purpose = "ULD";
            else if (AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "ORD")
                _purpose = "LOD";

            var _filter = {
                "WAR_FK": AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_PK,
                "Purpose": _purpose
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsDockConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.WmsDockConfig.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AllocateDockCtrl.ePage.Masters.DockNoList = response.data.Response;
                }
            });
        }

        function getTaskConfigData() {
            var EEM_Code_3;
            if (AllocateDockCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = AllocateDockCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": AllocateDockCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    AllocateDockCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    AllocateDockCtrl.ePage.Masters.MenuListSource = $filter('filter')(AllocateDockCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    AllocateDockCtrl.ePage.Masters.ValidationSource = $filter('filter')(AllocateDockCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (AllocateDockCtrl.ePage.Masters.ValidationSource.length > 0) {
                        AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    AllocateDockCtrl.ePage.Masters.DocumentValidation = $filter('filter')(AllocateDockCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (AllocateDockCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    AllocateDockCtrl.ePage.Masters.MenuObj = AllocateDockCtrl.taskObj;
                    AllocateDockCtrl.ePage.Masters.MenuObj.TabTitle = AllocateDockCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (AllocateDockCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: AllocateDockCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: AllocateDockCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (AllocateDockCtrl.ePage.Masters.TaskObj) {
                // errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: AllocateDockCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof AllocateDockCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                AllocateDockCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(AllocateDockCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            AllocateDockCtrl.ePage.Masters.docTypeSource = $filter('filter')(AllocateDockCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(AllocateDockCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": AllocateDockCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": AllocateDockCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": AllocateDockCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": AllocateDockCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": AllocateDockCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (AllocateDockCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(AllocateDockCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + AllocateDockCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    AllocateDockCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    AllocateDockCtrl.ePage.Meta.IsLoading = false;
                    AllocateDockCtrl.ePage.Entities.Header.Data = AllocateDockCtrl.ePage.Masters.GatepassDetails;
                    getTaskConfigData();
                    getDockNoList();
                }
            });
        }

        function StandardMenuConfig() {
            AllocateDockCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": AllocateDockCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": AllocateDockCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": AllocateDockCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": AllocateDockCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": AllocateDockCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": AllocateDockCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            if (AllocateDockCtrl.ePage.Masters.ValidationSource.length > 0 || AllocateDockCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (AllocateDockCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: AllocateDockCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: AllocateDockCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (AllocateDockCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (AllocateDockCtrl.ePage.Masters.docTypeSource.length == 0 || AllocateDockCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            AllocateDockCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            AllocateDockCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: AllocateDockCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (AllocateDockCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(AllocateDockCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        AllocateDockCtrl.ePage.Masters.ShowErrorWarningModal(AllocateDockCtrl.taskObj.PSI_InstanceNo);
                        if (AllocateDockCtrl.ePage.Masters.IsTaskList) {
                            AllocateDockCtrl.getErrorWarningList({
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

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function CompleteWithSave() {
            AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            AllocateDockCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            AllocateDockCtrl.ePage.Masters.DockInText = "Please Wait...";
            AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.DockinTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: AllocateDockCtrl.ePage.Masters.TaskObj
                    };

                    AllocateDockCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                AllocateDockCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                AllocateDockCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function Save() {
            AllocateDockCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            AllocateDockCtrl.ePage.Masters.IsDisableSaveBtn = true;
            AllocateDockCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    AllocateDockCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    AllocateDockCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            AllocateDockCtrl.ePage.Entities.Header.Data = filterObjectUpdate(AllocateDockCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, AllocateDockCtrl.ePage.Entities.Header.Data).then(function (response) {
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
