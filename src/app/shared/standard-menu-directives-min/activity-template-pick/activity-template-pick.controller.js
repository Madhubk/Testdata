(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplatePickController", ActivityTemplatePickController);

    ActivityTemplatePickController.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout"];

    function ActivityTemplatePickController(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout) {
        var ActivityTemplatePickCtrl = this;

        function Init() {
            ActivityTemplatePickCtrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template1_Pick",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplatePickCtrl.ePage.Masters.emptyText = "-";
            ActivityTemplatePickCtrl.ePage.Masters.TaskObj = ActivityTemplatePickCtrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplatePickCtrl.taskObj;
            ActivityTemplatePickCtrl.ePage.Masters.Complete = Complete;
            ActivityTemplatePickCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplatePickCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            ActivityTemplatePickCtrl.ePage.Masters.DatePicker = {};
            ActivityTemplatePickCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplatePickCtrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplatePickCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplatePickCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplatePickCtrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplatePickCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplatePickCtrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplatePickCtrl.ePage.Masters.SaveEntity = SaveEntity;

            if (ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplatePickCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplatePickCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplatePickCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplatePickCtrl.ePage.Masters.TaskConfigData;
                    ActivityTemplatePickCtrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplatePickCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplatePickCtrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplatePickCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    if (ActivityTemplatePickCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplatePickCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplatePickCtrl.ePage.Masters.MenuObj = ActivityTemplatePickCtrl.taskObj;
                    ActivityTemplatePickCtrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplatePickCtrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplatePickCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsPickList.API.GetById.Url + ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplatePickCtrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplatePickCtrl.ePage.Entities.Header.Data = ActivityTemplatePickCtrl.ePage.Masters.EntityObj;
                        ActivityTemplatePickCtrl.currentPick = {
                            [ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: ActivityTemplatePickCtrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo,
                            code: ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo,
                            isNew: false
                        };
                        myTaskActivityConfig.Entities.Pick = ActivityTemplatePickCtrl.currentPick;
                        getTaskConfigData();
                    }
                });
            }
        }

        function SaveEntity() {
            ActivityTemplatePickCtrl.ePage.Masters.SaveBtnText = "Please Wait...";
            ActivityTemplatePickCtrl.ePage.Masters.IsDisableSaveBtn = true;
            var _input = angular.copy(ActivityTemplatePickCtrl.ePage.Masters.EntityObj);
            _input.UIWmsPickHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.WmsPickList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
                ActivityTemplatePickCtrl.ePage.Masters.SaveBtnText = "Save";
                ActivityTemplatePickCtrl.ePage.Masters.IsDisableSaveBtn = false;
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplatePickCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplatePickCtrl.ePage.Masters.StandardConfigInput = {
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

            ActivityTemplatePickCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplatePickCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "WPK",
                    },
                    GroupCode: ActivityTemplatePickCtrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplatePickCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplatePickCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "WPK"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplatePickCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplatePickCtrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplatePickCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "WMS",
                            SubModuleCode: "WPK",
                        },
                        GroupCode: ActivityTemplatePickCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: ActivityTemplatePickCtrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplatePickCtrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplatePickCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplatePickCtrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplatePickCtrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "WMS",
                                SubModuleCode: "WPK",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplatePickCtrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplatePickCtrl.ePage.Masters.EntityObj.UIWmsPickHeader.PickNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplatePickCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplatePickCtrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplatePickCtrl.taskObj.PSI_InstanceNo);
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
            if (typeof ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplatePickCtrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplatePickCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplatePickCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplatePickCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplatePickCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplatePickCtrl.ePage.Masters.docTypeSource, 'DocType');
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

        function CompleteWithSave() {
            ActivityTemplatePickCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplatePickCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ActivityTemplatePickCtrl.ePage.Masters.TaskObj
                    };

                    ActivityTemplatePickCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ActivityTemplatePickCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                ActivityTemplatePickCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();