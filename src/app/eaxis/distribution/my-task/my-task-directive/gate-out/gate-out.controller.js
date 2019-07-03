(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GateOutDirectiveController", GateOutDirectiveController);

    GateOutDirectiveController.$inject = ["apiService", "helperService", "distributionConfig", "gatepassConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout"];

    function GateOutDirectiveController(apiService, helperService, distributionConfig, gatepassConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout) {
        var GateOutDirectiveCtrl = this;

        function Init() {
            GateOutDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Gate_Out",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            GateOutDirectiveCtrl.ePage.Masters.TaskObj = GateOutDirectiveCtrl.taskObj;
            GateOutDirectiveCtrl.ePage.Masters.EntityObj = GateOutDirectiveCtrl.entityObj;
            GateOutDirectiveCtrl.ePage.Masters.TabObj = GateOutDirectiveCtrl.tabObj;

            GateOutDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // errorWarningService.Modules = {};

            if (GateOutDirectiveCtrl.ePage.Masters.EntityObj) {
                GateOutDirectiveCtrl.ePage.Meta.IsLoading = true;
                GateOutDirectiveCtrl.ePage.Entities.Header.Data = GateOutDirectiveCtrl.ePage.Masters.TabObj[GateOutDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                GateOutDirectiveCtrl.ePage.Masters.TabList = GateOutDirectiveCtrl.ePage.Masters.TabObj;
                GateOutDirectiveCtrl.ePage.Meta.IsLoading = false;
                GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                getTaskConfigData();
            } else if (GateOutDirectiveCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }
            GateOutDirectiveCtrl.ePage.Masters.GateOutText = "Gate Out";
            GateOutDirectiveCtrl.ePage.Masters.Save = Save;
            GateOutDirectiveCtrl.ePage.Masters.Complete = Complete;
            GateOutDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            GateOutDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            GateOutDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            // GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            GateOutDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
            StandardMenuConfig();
        }

        function getTaskConfigData() {
            var EEM_Code_3;
            if (GateOutDirectiveCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = GateOutDirectiveCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": GateOutDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    GateOutDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    GateOutDirectiveCtrl.ePage.Masters.MenuListSource = $filter('filter')(GateOutDirectiveCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    GateOutDirectiveCtrl.ePage.Masters.ValidationSource = $filter('filter')(GateOutDirectiveCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (GateOutDirectiveCtrl.ePage.Masters.ValidationSource.length > 0) {
                        GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    GateOutDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(GateOutDirectiveCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (GateOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    GateOutDirectiveCtrl.ePage.Masters.MenuObj = GateOutDirectiveCtrl.taskObj;
                    GateOutDirectiveCtrl.ePage.Masters.MenuObj.TabTitle = GateOutDirectiveCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (GateOutDirectiveCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [GateOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: GateOutDirectiveCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: GateOutDirectiveCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (GateOutDirectiveCtrl.ePage.Masters.TaskObj) {
                // errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [GateOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: GateOutDirectiveCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof GateOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                GateOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(GateOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            GateOutDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(GateOutDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(GateOutDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": GateOutDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": GateOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": GateOutDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": GateOutDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": GateOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (GateOutDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(GateOutDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + GateOutDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    GateOutDirectiveCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    GateOutDirectiveCtrl.ePage.Meta.IsLoading = false;
                    GateOutDirectiveCtrl.ePage.Entities.Header.Data = GateOutDirectiveCtrl.ePage.Masters.GatepassDetails;
                    getTaskConfigData();
                }
            });
        }

        function StandardMenuConfig() {
            GateOutDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": GateOutDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": GateOutDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": GateOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": GateOutDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": GateOutDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": GateOutDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            if (GateOutDirectiveCtrl.ePage.Masters.ValidationSource.length > 0 || GateOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (GateOutDirectiveCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [GateOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: GateOutDirectiveCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: GateOutDirectiveCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (GateOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (GateOutDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || GateOutDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            GateOutDirectiveCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            GateOutDirectiveCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [GateOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: GateOutDirectiveCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[GateOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (GateOutDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(GateOutDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        GateOutDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(GateOutDirectiveCtrl.taskObj.PSI_InstanceNo);
                        if (GateOutDirectiveCtrl.ePage.Masters.IsTaskList) {
                            GateOutDirectiveCtrl.getErrorWarningList({
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
            GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            GateOutDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            GateOutDirectiveCtrl.ePage.Masters.GateOutText = "Please Wait...";
            GateOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GateoutTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: GateOutDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    GateOutDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                GateOutDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                GateOutDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function Save() {
            GateOutDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            GateOutDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            GateOutDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    GateOutDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    GateOutDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            GateOutDirectiveCtrl.ePage.Entities.Header.Data = filterObjectUpdate(GateOutDirectiveCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, GateOutDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
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
