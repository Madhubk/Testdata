(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateDelivery2Controller", ActivityTemplateDelivery2Controller);

    ActivityTemplateDelivery2Controller.$inject = ["$rootScope", "helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout", "deliveryConfig"];

    function ActivityTemplateDelivery2Controller($rootScope, helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout, deliveryConfig) {
        var ActivityTemplateDelivery2Ctrl = this;

        function Init() {
            ActivityTemplateDelivery2Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template_Delivery_Request",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateDelivery2Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplateDelivery2Ctrl.ePage.Masters.Config = myTaskActivityConfig;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj = ActivityTemplateDelivery2Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateDelivery2Ctrl.taskObj;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveEntity = SaveEntity;

            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.MenuObj = ActivityTemplateDelivery2Ctrl.taskObj;
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateDelivery2Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data = ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj;

                        if (ActivityTemplateDelivery2Ctrl.tabObj) {
                            ActivityTemplateDelivery2Ctrl.currentDelivery = ActivityTemplateDelivery2Ctrl.tabObj;
                            myTaskActivityConfig.Entities.Delivery = ActivityTemplateDelivery2Ctrl.currentDelivery;
                            getTaskConfigData();
                        } else {
                            deliveryConfig.GetTabDetails(ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDelivery, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID) {
                                        ActivityTemplateDelivery2Ctrl.currentDelivery = value;
                                        myTaskActivityConfig.Entities.Delivery = ActivityTemplateDelivery2Ctrl.currentDelivery;
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
            if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Create Delivery Challan") {
                $rootScope.SaveOutwardFromTask(function () {
                    saves();
                });
            } else {
                saves();
            }
        }

        function saves() {
            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            var _input = angular.copy(ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj);
            _input.UIWmsDelivery.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + response.data.Response.UIWmsDelivery.PK).then(function (response) {
                        if (response.data.Response) {
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj = response.data.Response;
                            ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data = ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj;
                            ActivityTemplateDelivery2Ctrl.currentDelivery = {
                                [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID]: {
                                    ePage: {
                                        Entities: {
                                            Header: {
                                                Data: ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data
                                            }
                                        }
                                    }
                                },
                                label: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID,
                                code: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID,
                                isNew: false
                            };
                            myTaskActivityConfig.Entities.Delivery = ActivityTemplateDelivery2Ctrl.currentDelivery;
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.Config.IsReload = true;
                            toastr.success("Saved Successfully...!");
                        }
                    });
                } else {
                    toastr.error("Save Failed...!");
                }
                ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplateDelivery2Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateDelivery2Ctrl.ePage.Masters.StandardConfigInput = {
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

            ActivityTemplateDelivery2Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL",
                    },
                    GroupCode: ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Create Delivery Challan") {
                    var input = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data
                    var temp = 0;
                    angular.forEach(input.UIvwWmsDeliveryList, function (value, key) {
                        if (value.OUT_PrdCode || value.MTOUT_PrdCode) {
                            temp = temp + 1;
                        }
                    });
                    if (temp == input.UIvwWmsDeliveryList.length) {
                        input.IsComplete = true;
                    }
                }
                if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "WMS",
                            SubModuleCode: "DEL",
                        },
                        GroupCode: ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "WMS",
                                SubModuleCode: "DEL",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplateDelivery2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateDelivery2Ctrl.taskObj.PSI_InstanceNo);
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
            if (typeof ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource, 'DocType');
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
            ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Acknowledge Delivery Request") {
                ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;
                ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsWorkorderReport.DeliveryRequestedDateTime = new Date();
            }
            SaveEntity();
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj
                    };

                    ActivityTemplateDelivery2Ctrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();