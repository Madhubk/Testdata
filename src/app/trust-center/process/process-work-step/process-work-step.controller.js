(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessWorkStepController", ProcessWorkStepController);

    ProcessWorkStepController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "$uibModal", "dynamicLookupConfig", "trustCenterConfig"];

    function ProcessWorkStepController($scope, $location, authService, apiService, helperService, toastr, confirmation, jsonEditModal, $uibModal, dynamicLookupConfig, trustCenterConfig) {
        /* jshint validthis: true */
        var ProcessWorkStepCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessWorkStepCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessWorkStep",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessWorkStepCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                ProcessWorkStepCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitProcessWorkStep();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // #region Breadcrumb
        function InitBreadcrumb() {
            ProcessWorkStepCtrl.ePage.Masters.Breadcrumb = {};
            ProcessWorkStepCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (ProcessWorkStepCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + ProcessWorkStepCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            ProcessWorkStepCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "process",
                Description: "Process",
                Link: "TC/process",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppName,
                },
                IsActive: false
            }, {
                Code: "processworkstep",
                Description: "Process Work Step" + _breadcrumbTitle,
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }
        // #endregion

        // #region StepInfo
        function InitProcessWorkStep() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.EditStep = EditStep;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.CloseStep = CloseStep;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OpenJsonModal = OpenJsonModal;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OnAccessClick = OnAccessClick;

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OnProcessWorkStepClick = OnProcessWorkStepClick;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.AddNewStep = AddNewStep;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepListClick = ProcessWorkStepListClick;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Save = Save;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RemoveRecord = Delete;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.InitStepNoHoverIn = InitStepNoHoverIn;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.InitStepNoHoverOut = InitStepNoHoverOut;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SelectedIconColor = SelectedIconColor;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.GetProcessWorkStepList = GetProcessWorkStepList;

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.AddRoleBasedForm = AddRoleBasedForm;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DeleteRoleBasedForm = DeleteRoleBasedForm;

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OnDisableFooterChange = OnDisableFooterChange;

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SaveBtnText = "Save";
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.IsDisableSaveBtn = false;

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RulesList = ["BEFORE_INIT", "AFTER_INIT", "BEFORE_COMPLETE", "AFTER_COMPLETE"];

            GetProcessWorkStepList();
            GetTypeList();
            InitParties();
            InitRelatedInput();
            InitKPIExpression();
            InitProcessTypelist();
            InitProcessTopics();
            InitDelayReason();
            InitSnoozeReason();
            InitHoldReason();
            InitChecklist();
            InitValidation();
            GetRelatedLookupList();
        }

        function GetTypeList() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.TypeList = [{
                Code: "ACTIVITY",
                Name: "ACTIVITY"
            }, {
                Code: "DECISION",
                Name: "DECISION"
            }, {
                Code: "END",
                Name: "END"
            }];
        }

        function OpenJsonModal(objName, subObject) {
            var _json;
            (!subObject) ? _json = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps[objName]: _json = objName[subObject];

            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": (!subObject) ? ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps[objName] : ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps[subObject][objName]
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                (!subObject) ? ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps[objName] = result: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps[subObject][objName] = result;
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }

        function GetProcessWorkStepList() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList = undefined;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = undefined;
            var _filter = {
                "PSM_FK": ProcessWorkStepCtrl.ePage.Masters.QueryString.Item.PK,
                "SortColumn": "WSI_StepNo",
                "SortType": "ASC",
                "PageSize": "100",
                "PageNumber": "1",
                "SAP_FK": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMWorkStepInfo.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepInfo.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList = angular.copy(response.data.Response);
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepListCopy = angular.copy(response.data.Response);

                    if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.length > 0) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.map(function (val, key) {
                            val["Mode"] = [{
                                "BEFORE_INIT": "BEFORE_INIT",
                                "AFTER_INIT": "AFTER_INIT",
                                "BEFORE_COMPLETE": "BEFORE_COMPLETE",
                                "AFTER_COMPLETE": "AFTER_COMPLETE"
                            }];

                            if (val.OtherConfig && typeof val.OtherConfig == "string") {
                                val.OtherConfig = JSON.parse(val.OtherConfig);
                            }

                            if (val.KPIExpression) {
                                if (val.KPIExpression.indexOf("[") !== -1) {
                                    val.KPIExpression = JSON.parse(val.KPIExpression);
                                    val.KPIExpression = JSON.stringify(val.KPIExpression, undefined, 2);
                                }
                            }
                            if (val.RelatedInput) {
                                if (val.RelatedInput.indexOf("[") !== -1) {
                                    val.RelatedInput = JSON.parse(val.RelatedInput);
                                    val.RelatedInput = JSON.stringify(val.RelatedInput, undefined, 2);
                                }
                            }

                            SetGenerateScriptInput(val)
                        });

                        ProcessWorkStepListClick(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList[0]);
                    }
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList = [];
                }
            });
        }

        function OnAccessClick($item) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "process-work-step-access-edit right",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-work-step/process-work-step-access/process-work-step-access.html",
                controller: 'ProcessWorkStepAccessModalController as ProcessWorkStepAccessModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function AddNewStep(stepType) {
            var _stepNo = 1;
            var _stepNoList = [];
            var _kpiExpression = [{
                "SQL": "SELECT GETDATE() + 2",
                "Parameters": []
            }];
            var _preSteps = {
                "Email": [{
                    "TemplateName": "InitTask",
                    "Subject": "You have new task : @StepName",
                    "Parameters": []
                }]
            };

            var _nextSteps = {
                "Email": [{
                    "TemplateName": "CompleteTask",
                    "Subject": "Task @StepName has been completed",
                    "Parameters": []
                }]
            };

            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList) {
                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.length > 0) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.map(function (value, key) {
                        _stepNoList.push(value.StepNo);
                    });

                    if (_stepNoList.length == 0) {
                        _stepNoList.push(1);
                    }
                    Array.prototype.max = function () {
                        return Math.max.apply(null, this);
                    };

                    _stepNo = _stepNoList.max() + 1;
                } else {
                    _stepNo = 1;
                }
            }

            var _obj = {
                "StepNo": _stepNo,
                "StepCode": ProcessWorkStepCtrl.ePage.Masters.QueryString.Item.ProcessCode + "_" + _stepNo,
                "StepType": stepType,
                "KPIExpression": JSON.stringify(_kpiExpression),
                "PreSteps": JSON.stringify(_preSteps),
                "NextSteps": JSON.stringify(_nextSteps),
            };

            if (stepType == "END") {
                _obj.StepCode = stepType;
                _obj.StepName = stepType;
                _obj.Description = stepType;
                _obj.CompletedStepName = stepType;
            }

            Save(_obj);
        }

        function EditStepModalPopup() {
            return ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.modalInstance = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "process-work-step right",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-work-step/process-work-step-modal.html"
            });
        }

        function EditStep($item) {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = angular.copy($item);

            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps) {
                if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig = {};
                }
                if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.Directives) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.Directives = {};
                }

                if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.MyTaskFooter) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.MyTaskFooter = {};
                }
            }

            PreparePartyMappingInput();

            EditStepModalPopup().result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CloseStep() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.modalInstance.dismiss('cancel');
        }

        function ProcessWorkStepListClick($item) {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = $item;
            GetProcessTypelist();
            GetProcessTopicslist();
            GetDelayReasonlist();
            GetSnoozeReasonlist();
            GetHoldReasonlist();
            GetChecklistlist();
            GetValidationlist();
        }

        function OnProcessWorkStepClick($item, mode) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "process-work-step-rules right",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-work-step/process-work-step-rules/process-work-step-rules.html",
                controller: 'ProcessWorkStepRulesController as ProcessWorkStepRulesCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Item": $item,
                            "Mode": mode
                        };
                        return exports;
                    }
                }
            }).result.then(function (response) {
                GetProcessWorkStepList();
            }, function () {
                console.log("Cancelled");
            });
        }

        function Save($item) {
            var _isEmpty = angular.equals({}, $item);

            if (!_isEmpty) {
                if ($item.StepNo) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SaveBtnText = "Please Wait...";
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.IsDisableSaveBtn = true;

                    var _input = angular.copy($item);
                    _input.IsModified = true;
                    _input.PSM_FK = ProcessWorkStepCtrl.ePage.Masters.QueryString.Item.PK;

                    if (_input.OtherConfig) {
                        if (_input.OtherConfig.Directives) {
                            if (!_input.OtherConfig.Directives.ListPage || _input.OtherConfig.Directives.ListPage == null || _input.OtherConfig.Directives.ListPage == "null" || _input.OtherConfig.Directives.ListPage == "" || _input.OtherConfig.Directives.ListPage == " ") {
                                _input.OtherConfig.Directives.ListPage = undefined;
                            }
                            if (!_input.OtherConfig.Directives.ActivityPage || _input.OtherConfig.Directives.ActivityPage == null || _input.OtherConfig.Directives.ActivityPage == "null" || _input.OtherConfig.Directives.ActivityPage == "" || _input.OtherConfig.Directives.ActivityPage == " ") {
                                _input.OtherConfig.Directives.ActivityPage = undefined;
                            }
                        }

                        if (typeof _input.OtherConfig == "object") {
                            _input.OtherConfig = JSON.stringify(_input.OtherConfig);
                        }
                    }

                    apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepInfo.API.Upsert.Url, [_input]).then(function (response) {
                        if (response.data.Response) {
                            var _response = response.data.Response[0];
                            if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList) {
                                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList = [];
                            }
                            if ($item.PK) {
                                var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.map(function (value, key) {
                                    return value.PK;
                                }).indexOf(_response.PK);

                                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList[_index] = _response;
                                if (_response.OtherConfig && typeof _response.OtherConfig == "string") {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList[_index].OtherConfig = JSON.parse(_response.OtherConfig);
                                }


                                if (_index !== -1) {

                                    SetGenerateScriptInput(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList[0])
                                }
                            } else {
                                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.push(_response);
                                EditStep(_response);
                            }

                            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = _response;

                            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression) {
                                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression.indexOf("[") !== -1) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression = JSON.parse(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression);
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression = JSON.stringify(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression, undefined, 2);
                                }
                            }

                            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput) {
                                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput.indexOf("[") !== -1) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput = JSON.parse(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput);
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput = JSON.stringify(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput, undefined, 2);
                                }
                            }
                        } else {
                            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = undefined;
                        }

                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SaveBtnText = "Save";
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.IsDisableSaveBtn = false;
                    });
                } else {
                    toastr.warning("Please Enter Step No.");
                }
            }
        }

        function Delete($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    RemoveRecord($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveRecord($item, $index) {
            if ($item.PK) {
                $item.IsModified = true;
                $item.IsDeleted = true;
                var _input = [$item];

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepInfo.API.Upsert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.splice($index, 1);
                    }
                });
            } else {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.splice($index, 1);
            }
        }

        function InitStepNoHoverIn($item) {
            $("#ProcessWorkStepNo" + $item.InitStepNo).addClass('highlight');
        }

        function InitStepNoHoverOut($item) {
            $("#ProcessWorkStepNo" + $item.InitStepNo).removeClass('highlight');
        }

        function SelectedIconColor($item, type) {
            if ($item) {
                if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig = {};
                }

                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig[type] = $item;
            }
        }

        function SetGenerateScriptInput($item) {

            if ($item) {
                $item.GenerateScriptInput = {
                    ObjectName: "EBPM_WorkStepInfo",
                    ObjectId: $item.PK
                };
                $item.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function OnDisableFooterChange($event) {
            var _target = $event.target;
            var _isChecked = _target.checked;

            if (_isChecked) {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.MyTaskFooter = {
                    IsDisableFooter: true
                };
            }
        }

        function AddRoleBasedForm() {
            var _obj = {
                Role: "",
                FormName: ""
            };

            if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig) {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig = {};
            }
            if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.RoleBasedForm) {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.RoleBasedForm = [];
            }

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.RoleBasedForm.push(_obj);
        }

        function DeleteRoleBasedForm($item, $index) {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig.RoleBasedForm.splice($index, 1);
        }
        // #endregion

        // #region Related Input
        function InitRelatedInput() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RelatedInput = {};

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RelatedInput.OnEditRelatedInput = OnEditRelatedInput;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RelatedInput.CloseEditRelatedInputModal = CloseEditRelatedInputModal;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RelatedInput.PrepareRelatedInput = PrepareRelatedInput;
        }

        function PrepareRelatedInput() {
            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInputGroup) {
                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInputGroup.length > 0) {
                    var _Group = angular.copy(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInputGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput = _Group;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput = "[]";
                }
            } else {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput = "[]";
            }

            CloseEditRelatedInputModal();
        }

        function EditRelatedInputModalInstance() {
            return ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.EditRelatedInputModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-related-input-modal right",
                scope: $scope,
                template: `<div ng-include src="'editProcessRelatedInput'"></div>`
            });
        }

        function CloseEditRelatedInputModal() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.EditRelatedInputModal.dismiss('cancel');

            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput) {
                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput.indexOf("[") !== -1) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput = JSON.parse(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput);
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput = JSON.stringify(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput, undefined, 2);
                }
            }
        }

        function OnEditRelatedInput() {
            if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInputGroup) {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInputGroup = [];
            }

            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput) {
                if (typeof ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput == "string") {
                    if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput.indexOf("[") !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInputGroup = JSON.parse(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInput);
                    } else {
                        toastr.warning("Invalid Format");
                    }
                }
            } else {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.RelatedInputGroup = [];
            }

            EditRelatedInputModalInstance().result.then(function (response) {}, function () {
                CloseEditRelatedInputModal();
            });
        }
        // #endregion

        // #region KPI Expression
        function InitKPIExpression() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.KPIExpression = {};

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.KPIExpression.OnEditKPIExpression = OnEditKPIExpression;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.KPIExpression.CloseEditKPIExpressionModal = CloseEditKPIExpressionModal;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.KPIExpression.PrepareKPIExpression = PrepareKPIExpression;
        }

        function PrepareKPIExpression() {
            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpressionGroup) {
                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpressionGroup.length > 0) {
                    var _Group = angular.copy(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpressionGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression = _Group;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression = "[]";
                }
            } else {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression = "[]";
            }

            CloseEditKPIExpressionModal();
        }

        function EditKPIExpressionModalInstance() {
            return ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.EditKPIExpressionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-related-input-modal right",
                scope: $scope,
                template: `<div ng-include src="'editProcessKPIExpression'"></div>`
            });
        }

        function CloseEditKPIExpressionModal() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.EditKPIExpressionModal.dismiss('cancel');

            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression) {
                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression.indexOf("[") !== -1) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression = JSON.parse(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression);
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression = JSON.stringify(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression, undefined, 2);
                }
            }
        }

        function OnEditKPIExpression() {
            if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpressionGroup) {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpressionGroup = [];
            }

            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression) {
                if (typeof ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression == "string") {
                    if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression.indexOf("[") !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpressionGroup = JSON.parse(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpression);
                    } else {
                        toastr.warning("Invalid Format");
                    }
                }
            } else {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.KPIExpressionGroup = [];
            }

            EditKPIExpressionModalInstance().result.then(function (response) {}, function () {
                CloseEditKPIExpressionModal();
            });
        }
        // #endregion

        // #region Process Type List
        function InitProcessTypelist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SelectedData = ProcessTypeListSelectedData;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OnProcessTypelistSave = OnProcessTypelistSave;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.Delete = DeleteProcessTypeConfirmation;
        }

        function GetProcessTypelist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.ListSource = undefined;
            var _filter = {
                Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,
                MappingCode: "PRC_TYP",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.ListSource = response.data.Response;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.ListSource = [];
                }
            });
        }

        function ProcessTypeListSelectedData($item) {
            OnProcessTypelistSave($item)
        }

        function OnProcessTypelistSave($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,

                            Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                            Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                            MappingCode: "PRC_TYP",
                            SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                            IsModified: true,
                            IsActive: true
                        }

                        apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.ListSource = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.ListSource.concat(response.data.Response);
                                }
                            }
                        });
                    });
                }
            }
        }

        function DeleteProcessTypeConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteProcessTypelist($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteProcessTypelist($item) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);
                    if (_index !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTypelist.ListSource.splice(_index, 1);
                    }
                }
            });
        }
        // #endregion

        // #region Process Tags
        function InitProcessTopics() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.DefaultFilter = {
                "MappingCode": "PROCESS_TOPIC"
            };
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.OnProcessTopicsSave = OnProcessTopicsSave;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.SelectedData = ProcessTopicsSelectedData;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.Delete = DeleteProcessTopicsConfirmation;
        }

        function GetProcessTopicslist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.ListSource = undefined;
            var _filter = {
                Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,
                MappingCode: "PROCESS_TOPIC",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.ListSource = response.data.Response;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.ListSource = [];
                }
            });
        }

        function ProcessTopicsSelectedData($item) {
            OnProcessTopicsSave($item)
        }

        function OnProcessTopicsSave($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,
                            Name_1: value.Name,

                            Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                            Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                            MappingCode: "PROCESS_TOPIC",
                            SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                            IsModified: true,
                            IsActive: true
                        }

                        apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.ListSource = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.ListSource.concat(response.data.Response);
                                }
                            }
                        });
                    });
                }
            }
        }

        function DeleteProcessTopicsConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteProcessTopiclist($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteProcessTopiclist($item) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);
                    if (_index !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessTopics.ListSource.splice(_index, 1);
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "ProcessTypelist_3121",
                SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }
        // #endregion

        // #region Delay Reason
        function InitDelayReason() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.DefaultFilter = {
                "MappingCode": "DELAY_REASON"
            }
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.OnDelayReasonSave = OnDelayReasonSave;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.SelectedData = DelayReasonSelectedData;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.Delete = DeleteDelayReasonConfirmation;
        }

        function GetDelayReasonlist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.ListSource = undefined;
            var _filter = {
                Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,
                MappingCode: "DELAY_REASON",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.ListSource = response.data.Response;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.ListSource = [];
                }
            });
        }

        function DelayReasonSelectedData($item) {
            OnDelayReasonSave($item)
        }

        function OnDelayReasonSave($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,
                            Name_1: value.Name,

                            Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                            Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                            MappingCode: "DELAY_REASON",
                            SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                            IsModified: true,
                            IsActive: true
                        }

                        apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.ListSource = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.ListSource.concat(response.data.Response);
                                }
                            }
                        });
                    });
                }
            }
        }

        function DeleteDelayReasonConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDelayReason($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDelayReason($item) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);
                    if (_index !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.DelayReason.ListSource.splice(_index, 1);
                    }
                }
            });
        }
        // #endregion

        // #region Snooze Reason
        function InitSnoozeReason() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.DefaultFilter = {
                "MappingCode": "SNOOZE_REASON"
            }
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.OnSnoozeReasonSave = OnSnoozeReasonSave;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.SelectedData = SnoozeReasonSelectedData;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.Delete = DeleteSnoozeReasonConfirmation;
        }

        function GetSnoozeReasonlist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.ListSource = undefined;
            var _filter = {
                Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,
                MappingCode: "SNOOZE_REASON",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.ListSource = response.data.Response;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.ListSource = [];
                }
            });
        }

        function SnoozeReasonSelectedData($item) {
            OnSnoozeReasonSave($item)
        }

        function OnSnoozeReasonSave($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,
                            Name_1: value.Name,

                            Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                            Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                            MappingCode: "SNOOZE_REASON",
                            SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                            IsModified: true,
                            IsActive: true
                        }

                        apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.ListSource = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.ListSource.concat(response.data.Response);
                                }
                            }
                        });
                    });
                }
            }
        }

        function DeleteSnoozeReasonConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteSnoozeReason($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteSnoozeReason($item) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);
                    if (_index !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SnoozeReason.ListSource.splice(_index, 1);
                    }
                }
            });
        }
        // #endregion

        // #region Hold Reason
        function InitHoldReason() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.DefaultFilter = {
                "MappingCode": "HOLD_REASON"
            }
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.OnHoldReasonSave = OnHoldReasonSave;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.SelectedData = HoldReasonSelectedData;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.Delete = DeleteHoldReasonConfirmation;
        }

        function GetHoldReasonlist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.ListSource = undefined;
            var _filter = {
                Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,
                MappingCode: "HOLD_REASON",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.ListSource = response.data.Response;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.ListSource = [];
                }
            });
        }

        function HoldReasonSelectedData($item) {
            OnHoldReasonSave($item)
        }

        function OnHoldReasonSave($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,
                            Name_1: value.Name,

                            Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                            Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                            MappingCode: "HOLD_REASON",
                            SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                            IsModified: true,
                            IsActive: true
                        }

                        apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.ListSource = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.ListSource.concat(response.data.Response);
                                }
                            }
                        });
                    });
                }
            }
        }

        function DeleteHoldReasonConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteHoldReason($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteHoldReason($item) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);
                    if (_index !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.HoldReason.ListSource.splice(_index, 1);
                    }
                }
            });
        }
        // #endregion

        // #region Checklist
        function InitChecklist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.DefaultFilter = {
                "MappingCode": "CHECKLIST"
            }
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.OnChecklistSave = OnChecklistSave;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.SelectedData = ChecklistSelectedData;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.UpdateChecklist = UpdateChecklist;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.Delete = DeleteChecklistConfirmation;
        }

        function GetChecklistlist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.ListSource = undefined;
            var _filter = {
                Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,
                MappingCode: "CHECKLIST",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.ListSource = response.data.Response;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.ListSource = [];
                }
            });
        }

        function ChecklistSelectedData($item) {
            OnChecklistSave($item)
        }

        function OnChecklistSave($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,
                            Name_1: value.Name,

                            Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                            Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                            MappingCode: "CHECKLIST",
                            SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                            IsModified: true,
                            IsActive: true
                        };

                        apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.ListSource = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.ListSource.concat(response.data.Response);
                                }
                            }
                        });
                    });
                }
            }
        }

        function UpdateChecklist($event, $item) {
            var _target = $event.target;
            var _isChecked = _target.checked;

            var _input = $item;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {}
                }
            });
        }

        function DeleteChecklistConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteChecklist($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteChecklist($item) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);
                    if (_index !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Checklist.ListSource.splice(_index, 1);
                    }
                }
            });
        }
        // #endregion

        // #region Parties
        function InitParties() {
            ProcessWorkStepCtrl.ePage.Masters.Parties = {};
        }

        function PreparePartyMappingInput() {
            ProcessWorkStepCtrl.ePage.Masters.Parties.MappingInput = {
                MappingCode: "GRUP_STYP_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_STYP_APP_TNT",

                AccessTo: "PROCS",
                Access_FK: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                AccessCode: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                SAP_Code: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppCode,
                PartyMappingAPI: "GroupProcessType",
                PartyRoleMappingAPI: "GroupRoleProcess"
            }
        }
        // #endregion

        // #region Validation
        function InitValidation() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.DefaultFilter = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.OnValidationSave = OnValidationSave;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.SelectedData = ValidationSelectedData;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.Delete = DeleteValidationConfirmation;
        }

        function GetValidationlist() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.ListSource = undefined;
            var _filter = {
                Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,
                MappingCode: "VALIDATION",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.ListSource = response.data.Response;
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.ListSource = [];
                }
            });
        }

        function ValidationSelectedData($item) {
            OnValidationSave($item)
        }

        function OnValidationSave($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        var _input = {
                            Fk_1: value.PK,
                            Code_1: value.Code,
                            Name_1: value.Message,

                            Fk_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.PK,
                            Code_2: ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.StepCode,

                            MappingCode: "VALIDATION",
                            SAP_FK: ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                            IsModified: true,
                            IsActive: true
                        }

                        apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.ListSource = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.ListSource.concat(response.data.Response);
                                }
                            }
                        });
                    });
                }
            }
        }

        function DeleteValidationConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteValidation($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteValidation($item) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);
                    if (_index !== -1) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Validation.ListSource.splice(_index, 1);
                    }
                }
            });
        }
        // #endregion

        Init();
    }
})();
