(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateConsol1Controller", ActivityTemplateConsol1Controller);

    ActivityTemplateConsol1Controller.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout"];

    function ActivityTemplateConsol1Controller(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout) {
        var ActivityTemplateConsol1Ctrl = this;

        function Init() {
            ActivityTemplateConsol1Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template1_Consol",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateConsol1Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplateConsol1Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj = ActivityTemplateConsol1Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateConsol1Ctrl.taskObj;
            ActivityTemplateConsol1Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplateConsol1Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            // DatePicker
            ActivityTemplateConsol1Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplateConsol1Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateConsol1Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateConsol1Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateConsol1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplateConsol1Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            ActivityTemplateConsol1Ctrl.ePage.Masters.TaskSave = TaskSave;
            ActivityTemplateConsol1Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplateConsol1Ctrl.ePage.Masters.SaveBtnText = "Save";
            if (ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }

        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateConsol1Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateConsol1Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateConsol1Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateConsol1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplateConsol1Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateConsol1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    if (ActivityTemplateConsol1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplateConsol1Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplateConsol1Ctrl.ePage.Masters.MenuObj = ActivityTemplateConsol1Ctrl.taskObj;
                    ActivityTemplateConsol1Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateConsol1Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateConsol1Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateConsol1Ctrl.ePage.Entities.Header.Data = ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj;
                        getTaskConfigData();
                        ActivityTemplateConsol1Ctrl.currentConsol = {
                            [ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: ActivityTemplateConsol1Ctrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo,
                            code: ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        myTaskActivityConfig.Entities.Consol = ActivityTemplateConsol1Ctrl.currentConsol;
                    }
                });
            }
        }

        function SaveEntity() {
            var _input = angular.copy(ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj);
            _input.UIConConsolHeader.IsModified = true;
            _input.UIConsolExtendedInfo.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ConsolList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function StandardMenuConfig() {
            ActivityTemplateConsol1Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.WSI_FK,
                "ParentEntityRefCode": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateConsol1Ctrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                // IsDisableGenerate: true,
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

            ActivityTemplateConsol1Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "CON",
                        SubModuleCode: "CON",
                    },
                    GroupCode: ActivityTemplateConsol1Ctrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "CON",
                        SubModuleCode: "CON"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplateConsol1Ctrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplateConsol1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "CON",
                            SubModuleCode: "CON",
                        },
                        GroupCode: ActivityTemplateConsol1Ctrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplateConsol1Ctrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplateConsol1Ctrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "CON",
                                SubModuleCode: "CON",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplateConsol1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplateConsol1Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplateConsol1Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateConsol1Ctrl.taskObj.PSI_InstanceNo);
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplateConsol1Ctrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplateConsol1Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplateConsol1Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplateConsol1Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplateConsol1Ctrl.ePage.Masters.docTypeSource, 'DocType');
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
        function TaskSave() {
            ActivityTemplateConsol1Ctrl.ePage.Masters.SaveBtnText = "Please Wait...";
            ActivityTemplateConsol1Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            SaveEntity();
           
        }

        function CompleteWithSave() {
            ActivityTemplateConsol1Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplateConsol1Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
           
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ActivityTemplateConsol1Ctrl.ePage.Masters.TaskObj
                    };

                    ActivityTemplateConsol1Ctrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ActivityTemplateConsol1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                ActivityTemplateConsol1Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();