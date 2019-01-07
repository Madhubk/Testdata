(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplatePickup2Controller", ActivityTemplatePickup2Controller);

    ActivityTemplatePickup2Controller.$inject = ["$rootScope", "helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout", "pickupConfig"];

    function ActivityTemplatePickup2Controller($rootScope, helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout, pickupConfig) {
        var ActivityTemplatePickup2Ctrl = this;

        function Init() {
            ActivityTemplatePickup2Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template_Pickup_Request",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplatePickup2Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplatePickup2Ctrl.ePage.Masters.Config = myTaskActivityConfig;
            ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj = ActivityTemplatePickup2Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplatePickup2Ctrl.taskObj;
            ActivityTemplatePickup2Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplatePickup2Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            ActivityTemplatePickup2Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplatePickup2Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplatePickup2Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplatePickup2Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplatePickup2Ctrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplatePickup2Ctrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplatePickup2Ctrl.ePage.Masters.SaveEntity = SaveEntity;

            if (ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplatePickup2Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplatePickup2Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplatePickup2Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplatePickup2Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplatePickup2Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplatePickup2Ctrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (ActivityTemplatePickup2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplatePickup2Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplatePickup2Ctrl.ePage.Masters.MenuObj = ActivityTemplatePickup2Ctrl.taskObj;
                    ActivityTemplatePickup2Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplatePickup2Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplatePickup2Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data = ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj;

                        if (ActivityTemplatePickup2Ctrl.tabObj) {
                            ActivityTemplatePickup2Ctrl.currentPickup = ActivityTemplatePickup2Ctrl.tabObj;
                            myTaskActivityConfig.Entities.Pickup = ActivityTemplatePickup2Ctrl.currentPickup;
                            getTaskConfigData();
                        } else {
                            pickupConfig.GetTabDetails(ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID) {
                                        ActivityTemplatePickup2Ctrl.currentPickup = value;
                                        myTaskActivityConfig.Entities.Pickup = ActivityTemplatePickup2Ctrl.currentPickup;
                                        getTaskConfigData();
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }

        function SaveEntity(callback) {            
            ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplatePickup2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            if (ActivityTemplatePickup2Ctrl.taskObj.WSI_StepName == "Create Pickup Challan") {
                $rootScope.SaveInwardFromTask(function (response) {
                    if (response == "error") {
                        ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                        ActivityTemplatePickup2Ctrl.ePage.Masters.SaveBtnText = "Save";
                        ActivityTemplatePickup2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                        ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                    } else {
                        saves(callback);
                    }
                });
            } else if (ActivityTemplatePickup2Ctrl.taskObj.WSI_StepName == "Acknowledge Pickup Request") {
                var _Data = myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities,
                    _input = _Data.Header.Data,
                    _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
                pickupConfig.GeneralValidation(myTaskActivityConfig.Entities.Pickup);
                if (ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask) {
                    if (ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity) {
                        ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity[ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID].GlobalErrorWarningList = _errorcount;
                    } else {
                        ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity = {
                            [ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID]: {
                                GlobalErrorWarningList: []
                            }
                        };
                        ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity[ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID].GlobalErrorWarningList = _errorcount;
                    }
                } else {
                    ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask = {};
                    ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity = {
                        [ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID]: {
                            GlobalErrorWarningList: []
                        }
                    };
                    ActivityTemplatePickup2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity[ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID].GlobalErrorWarningList = _errorcount;
                }
                if (_errorcount.length == 0) {
                    saves(callback);
                } else {
                    ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                    ActivityTemplatePickup2Ctrl.ePage.Masters.SaveBtnText = "Save";
                    ActivityTemplatePickup2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                    ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ActivityTemplatePickup2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplatePickup2Ctrl.taskObj.PSI_InstanceNo);
                }
            } else {
                saves(callback);
            }
        }

        function saves(callback) {
            ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplatePickup2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            if (ActivityTemplatePickup2Ctrl.taskObj.WSI_StepName == "Create Pickup Challan") {
                angular.forEach(myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data.UIWmsPickupLine, function (value, key) {
                    value.WorkOrderLineStatus = "PIP";
                });
            }
            var _input = angular.copy(myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data);
            _input = filterObjectUpdate(_input, "IsModified");
            apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + response.data.Response.UIWmsPickup.PK).then(function (response) {
                        if (response.data.Response) {
                            ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj = response.data.Response;
                            ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data = ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj;
                            ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.Client = ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode + ' - ' + ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
                            ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
                            ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode + ' - ' + ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
                            myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data = ActivityTemplatePickup2Ctrl.ePage.Entities.Header.Data;
                            ActivityTemplatePickup2Ctrl.ePage.Masters.Config.IsReload = true;
                            toastr.success("Pickup Saved Successfully...!");
                            if (callback)
                                callback();
                        }
                    });
                } else {
                    toastr.error("Save Failed...!");
                    if (callback)
                        callback();
                }
                ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                ActivityTemplatePickup2Ctrl.ePage.Masters.SaveBtnText = "Save";
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

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplatePickup2Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplatePickup2Ctrl.ePage.Masters.StandardConfigInput = {
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

            ActivityTemplatePickup2Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "PIC",
                    },
                    GroupCode: ActivityTemplatePickup2Ctrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "PIC"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplatePickup2Ctrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplatePickup2Ctrl.taskObj.WSI_StepName == "Create Pickup Challan") {
                    var input = myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data
                    var temp = 0;
                    angular.forEach(input.UIvwWmsPickupLine, function (value, key) {
                        if (value.IL_PrdCode) {
                            temp = temp + 1;
                        }
                    });
                    if (temp == input.UIvwWmsPickupLine.length) {
                        input.IsComplete = true;
                    }
                }
                if (ActivityTemplatePickup2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "WMS",
                            SubModuleCode: "PIC",
                        },
                        GroupCode: ActivityTemplatePickup2Ctrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplatePickup2Ctrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplatePickup2Ctrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "WMS",
                                SubModuleCode: "PIC",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsPickup.WorkOrderID].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplatePickup2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplatePickup2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplatePickup2Ctrl.taskObj.PSI_InstanceNo);
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
            if (typeof ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplatePickup2Ctrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplatePickup2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplatePickup2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplatePickup2Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplatePickup2Ctrl.ePage.Masters.docTypeSource, 'DocType');
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
            ActivityTemplatePickup2Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            if (ActivityTemplatePickup2Ctrl.taskObj.WSI_StepName == "Acknowledge Pickup Request") {
                ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                ActivityTemplatePickup2Ctrl.ePage.Masters.EntityObj.AcknowledgedPerson = authService.getUserInfo().UserId;
            }
            SaveEntity(function () {
                SaveOnly().then(function (response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Task Completed Successfully...!");
                        var _data = {
                            IsCompleted: true,
                            Item: ActivityTemplatePickup2Ctrl.ePage.Masters.TaskObj
                        };

                        ActivityTemplatePickup2Ctrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                    ActivityTemplatePickup2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ActivityTemplatePickup2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                });
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();