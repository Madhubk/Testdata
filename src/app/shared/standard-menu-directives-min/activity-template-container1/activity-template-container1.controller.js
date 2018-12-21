(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateContainer1Controller", ActivityTemplateContainer1Controller);

    ActivityTemplateContainer1Controller.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout"];

    function ActivityTemplateContainer1Controller(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout) {
        var ActivityTemplateContainer1Ctrl = this;

        function Init() {
            ActivityTemplateContainer1Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template1_Container",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateContainer1Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj = ActivityTemplateContainer1Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateContainer1Ctrl.taskObj;
            ActivityTemplateContainer1Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplateContainer1Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            // DatePicker
            ActivityTemplateContainer1Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplateContainer1Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateContainer1Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateContainer1Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateContainer1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplateContainer1Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            if (ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
            getTaskConfigData();
        }

        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateContainer1Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateContainer1Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateContainer1Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateContainer1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplateContainer1Ctrl.ePage.Masters.MenuObj = ActivityTemplateContainer1Ctrl.taskObj;
                    ActivityTemplateContainer1Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateContainer1Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateContainer1Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateContainer1Ctrl.ePage.Entities.Header.Data = ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj;
                        initValidation();
                        ActivityTemplateContainer1Ctrl.currentConsol = {
                            [ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: ActivityTemplateContainer1Ctrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo,
                            code: ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        myTaskActivityConfig.Entities.Consol = ActivityTemplateContainer1Ctrl.currentConsol;
                    }
                });
            }
        }

        function SaveEntity() {
            var _input = angular.copy(ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj);
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
                "CompleteInstanceNo": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplateContainer1Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.ProcessName,
                "EntityRefKey": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.WSI_FK,
                "ParentEntityRefCode": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateContainer1Ctrl.ePage.Masters.StandardConfigInput = {
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

            ActivityTemplateContainer1Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function initValidation() {
            ValidationFindall();
        }

        function ValidationFindall() {
            if (ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj) {

                ActivityTemplateContainer1Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateContainer1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                // validation findall call
                if (ActivityTemplateContainer1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: ActivityTemplateContainer1Ctrl.ePage.Masters.ValidationSource[0].Code,
                        // RelatedBasicDetails: [{
                        //     "UIField": "TEST",
                        //     "DbField": "TEST",
                        //     "Value": "TEST"
                        // }],
                        EntityObject: ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader
                    };
                    errorWarningService.GetErrorCodeList(_obj);
                }
            }
        }

        function Complete() {
            if (ActivityTemplateContainer1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                    },
                    GroupCode: ActivityTemplateContainer1Ctrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConsolExtendedInfo
                };
                errorWarningService.ValidateValue(_obj);

                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplateContainer1Ctrl.ePage.Masters.EntityObj.UIConConsolHeader.ConsolNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        ActivityTemplateContainer1Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateContainer1Ctrl.taskObj.PSI_InstanceNo);
                    } else {
                        CompleteWithSave();
                    }
                });
            } else {
                CompleteWithSave();
            }
        }

        function CompleteWithSave() {
            ActivityTemplateContainer1Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplateContainer1Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ActivityTemplateContainer1Ctrl.ePage.Masters.TaskObj
                    };

                    ActivityTemplateContainer1Ctrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ActivityTemplateContainer1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                ActivityTemplateContainer1Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();