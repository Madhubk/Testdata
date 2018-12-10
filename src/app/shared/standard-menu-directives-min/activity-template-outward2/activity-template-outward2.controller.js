(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateOutward2Controller", ActivityTemplateOutward2Controller);

    ActivityTemplateOutward2Controller.$inject = ["$rootScope", "helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout", "outwardConfig"];

    function ActivityTemplateOutward2Controller($rootScope, helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout, outwardConfig) {
        var ActivityTemplateOutward2Ctrl = this;

        function Init() {
            ActivityTemplateOutward2Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template_Outward",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateOutward2Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj = ActivityTemplateOutward2Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateOutward2Ctrl.taskObj;
            ActivityTemplateOutward2Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplateOutward2Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplateOutward2Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveEntity = SaveEntity;

            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateOutward2Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplateOutward2Ctrl.ePage.Masters.MenuObj = ActivityTemplateOutward2Ctrl.taskObj;
                    ActivityTemplateOutward2Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateOutward2Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateOutward2Ctrl.ePage.Entities.Header.Data = ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj;

                        if (ActivityTemplateOutward2Ctrl.tabObj) {
                            ActivityTemplateOutward2Ctrl.currentOutward = ActivityTemplateOutward2Ctrl.tabObj;
                            myTaskActivityConfig.Entities.Outward = ActivityTemplateOutward2Ctrl.currentOutward;
                            getTaskConfigData();
                        } else {
                            outwardConfig.GetTabDetails(ActivityTemplateOutward2Ctrl.ePage.Entities.Header.Data.UIWmsOutwardHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ActivityTemplateOutward2Ctrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID) {
                                        ActivityTemplateOutward2Ctrl.currentOutward = value;
                                        myTaskActivityConfig.Entities.Outward = ActivityTemplateOutward2Ctrl.currentOutward;
                                        getTaskConfigData();
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }

        function SaveEntity() {
            if (ActivityTemplateOutward2Ctrl.taskObj.ProcessName == "WMS_DeliveryMaterial") {
                apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, myTaskActivityConfig.Entities.DeliveryData).then(function (response) {
                    $rootScope.SaveOutwardFromTask(function () {
                        // saves();
                        // toastr.success("Saved Successfully");
                    });
                });
            } else {
                saves();
            }
        }

        function saves() {
            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            var _input = angular.copy(ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj);
            _input.UIWmsOutwardHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
                ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplateOutward2Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": "ORD",
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateOutward2Ctrl.ePage.Masters.StandardConfigInput = {
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

            ActivityTemplateOutward2Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL",
                    },
                    GroupCode: ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "WMS",
                            SubModuleCode: "DEL",
                        },
                        GroupCode: ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "WMS",
                                SubModuleCode: "DEL",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplateOutward2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateOutward2Ctrl.taskObj.PSI_InstanceNo);
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
            if (typeof ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                "EntityRefKey": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": "ORD"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource, 'DocType');
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
            ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj
                    };

                    ActivityTemplateOutward2Ctrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();