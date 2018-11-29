(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplate1Controller", ActivityTemplate1Controller);

    ActivityTemplate1Controller.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout"];

    function ActivityTemplate1Controller(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout) {
        var ActivityTemplate1Ctrl = this;

        function Init() {
            ActivityTemplate1Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template1",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplate1Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplate1Ctrl.ePage.Masters.TaskObj = ActivityTemplate1Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplate1Ctrl.taskObj;
            ActivityTemplate1Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplate1Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplate1Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            ActivityTemplate1Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplate1Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplate1Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplate1Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplate1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplate1Ctrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplate1Ctrl.ePage.Masters.TaskSave = TaskSave;

            if (ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplate1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplate1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplate1Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplate1Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplate1Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplate1Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    if (ActivityTemplate1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplate1Ctrl.ePage.Masters.MenuObj = ActivityTemplate1Ctrl.taskObj;
                    ActivityTemplate1Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplate1Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplate1Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplate1Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplate1Ctrl.ePage.Entities.Header.Data = ActivityTemplate1Ctrl.ePage.Masters.EntityObj;
                        GetPackageList();
                        getTaskConfigData();
                        if (ActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                            ActivityTemplate1Ctrl.ePage.Masters.IsConsolAvailable = true;
                            GetConList(ActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings[0].CON_FK);
                        }
                    }
                });
            }
        }

        function GetConList(CON_FK) {
            apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + CON_FK).then(function (response) {
                if (response.data.Response) {
                    ActivityTemplate1Ctrl.ePage.Entities.Header.ConData = response.data.Response;
                    myTaskActivityConfig.Entities.Consol = ActivityTemplate1Ctrl.ePage.Entities.Header.ConData;
                    ActivityTemplate1Ctrl.ePage.Entities.Header.ConData.UIConConsolHeader.PK = ActivityTemplate1Ctrl.ePage.Entities.Header.ConData.PK;
                    ActivityTemplate1Ctrl.currentConsol = {
                        [response.data.Response.UIConConsolHeader.ConsolNo]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: ActivityTemplate1Ctrl.ePage.Entities.Header.ConData
                                    }
                                }
                            }
                        },
                        label: response.data.Response.UIConConsolHeader.ConsolNo,
                        code: response.data.Response.UIConConsolHeader.ConsolNo,
                        isNew: false
                    };
                    myTaskActivityConfig.Entities.Consol = ActivityTemplate1Ctrl.currentConsol;
                }
            });
        }

        // package list details
        function GetPackageList() {
            var _filter = {
                SHP_FK: ActivityTemplate1Ctrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            var _isExist = ActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                                return value1.PK === value.PK;
                            });

                            if (!_isExist) {
                                ActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                            }
                            ActivityTemplate1Ctrl.currentShipment = {
                                [ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo]: {
                                    ePage: {
                                        Entities: {
                                            Header: {
                                                Data: ActivityTemplate1Ctrl.ePage.Entities.Header.Data
                                            }
                                        }
                                    }
                                },
                                label: ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                                code: ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                                isNew: false
                            };
                        });
                    } else {
                        ActivityTemplate1Ctrl.currentShipment = {
                            [ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: ActivityTemplate1Ctrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            code: ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            isNew: false
                        };
                    }
                    myTaskActivityConfig.Entities.Shipment = ActivityTemplate1Ctrl.currentShipment;
                }
            });
        }

        function SaveEntity() {
            var _input = angular.copy(ActivityTemplate1Ctrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            _input.UIShpExtendedInfo.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
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
                "CompleteInstanceNo": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplate1Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplate1Ctrl.ePage.Masters.StandardConfigInput = {
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

            ActivityTemplate1Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplate1Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                    },
                    GroupCode: ActivityTemplate1Ctrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplate1Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplate1Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplate1Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplate1Ctrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplate1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: ActivityTemplate1Ctrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: ActivityTemplate1Ctrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplate1Ctrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplate1Ctrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplate1Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplate1Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "SHP",
                                SubModuleCode: "SHP",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplate1Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplate1Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplate1Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplate1Ctrl.taskObj.PSI_InstanceNo);
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
            if (typeof ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplate1Ctrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplate1Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplate1Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplate1Ctrl.ePage.Masters.docTypeSource, 'DocType');
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
            ActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Please Wait...";
            ActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            SaveEntity();
            if (ActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                ConSave();
            }
        }
        function CompleteWithSave() {
            ActivityTemplate1Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplate1Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            if (ActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                ConSave();
            }
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ActivityTemplate1Ctrl.ePage.Masters.TaskObj
                    };

                    ActivityTemplate1Ctrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ActivityTemplate1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                ActivityTemplate1Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function ConSave() {
            var _input = angular.copy(ActivityTemplate1Ctrl.currentConsol);
            _input.UIConConsolHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ConsolList.API.Update.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();