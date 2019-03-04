(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessWorkStepRulesController", ProcessWorkStepRulesController);

    ProcessWorkStepRulesController.$inject = ["$scope", "$location", "$timeout", "authService", "apiService", "helperService", "toastr", "confirmation", "$uibModal", "$uibModalInstance", "param", "trustCenterConfig", "jsonEditModal"];

    function ProcessWorkStepRulesController($scope, $location, $timeout, authService, apiService, helperService, toastr, confirmation, $uibModal, $uibModalInstance, param, trustCenterConfig, jsonEditModal) {
        /* jshint validthis: true */
        var ProcessWorkStepRulesCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessWorkStepRulesCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessWorkStepRules",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessWorkStepRulesCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                ProcessWorkStepRulesCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ProcessWorkStepRulesCtrl.ePage.Masters.QueryString.AppPk) {
                    InitWorkStepRules();
                    InitWorkStepActions();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function CloseModal() {
            $uibModalInstance.dismiss('cancel');
        }

        // ============================= Rules Start =============================        
        function InitWorkStepRules() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Param = param;

            ProcessWorkStepRulesCtrl.ePage.Masters.Rules = {};
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.AddNewRule = AddNewRule;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.OnRuleChange = OnRuleChange;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.SaveRules = SaveRulesValidation;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.DeleteRules = DeleteRulesConfirmation;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.CloseModal = CloseModal;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.OnRuleTypeChange = OnRuleTypeChange;

            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesSaveBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesSaveBtnText = "Save";
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesDeleteBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesDeleteBtnText = "Delete";
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableAddRuleBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.AddRuleBtnText = "Add Rules";

            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveTab = "General";

            GetRuleTypeList();
            GetRules();
            GetRulesActionType();
            GetMode();
            GetInstanceRules();
            GetInstanceMandatorySteps();
        }

        function GetRuleTypeList() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RuleTypeList = [{
                Code: "Expression1",
                Desc: "Expression 1"
            }, {
                Code: "Expression2",
                Desc: "Expression 2"
            }];
        }

        function OnRuleTypeChange() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.Rules = [];
        }

        function GetRules() {
            var _filter = {
                "Mode": ProcessWorkStepRulesCtrl.ePage.Masters.Param.Mode,
                "WSI_FK": ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.PK,
                "SAP_FK": ProcessWorkStepRulesCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMWorkStepRules.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepRules.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (val, key) {
                            val.MandatorySteps = JSON.parse(val.MandatorySteps);
                            val.Rules = JSON.parse(val.Rules);
                        });
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource = response.data.Response;

                        OnRuleChange(ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource[0]);
                    } else {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource = [];
                    }
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource = [];
                }
            });
        }

        function GetRulesActionType() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActionTypeList = [{
                "Code": "REGULAR",
                "Name": "REGULAR"
            }, {
                "Code": "EXTERNAL",
                "Name": "EXTERNAL"
            }, {
                "Code": "CHILD",
                "Name": "CHILD"
            }];
        }

        function GetMode() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ModeList = [{
                "Code": "BEFORE_INIT",
                "Name": "BEFORE_INIT"
            }, {
                "Code": "AFTER_INIT",
                "Name": "AFTER_INIT"
            }, {
                "Code": "BEFORE_COMPLETE",
                "Name": "BEFORE_COMPLETE"
            }, {
                "Code": "AFTER_COMPLETE",
                "Name": "AFTER_COMPLETE"
            }];
        }

        function GetInstanceRules() {
            ProcessWorkStepRulesCtrl.ePage.Masters.InstanceRulesList = [];
            for (let index = 1; index <= 10; index++) {
                var _obj = {
                    "FieldName": "Val" + index,
                    "InputName": "Variable " + index,
                    "Value": "",
                    "DataType": "String"
                }
                ProcessWorkStepRulesCtrl.ePage.Masters.InstanceRulesList.push(_obj);
            }
        }

        function GetInstanceMandatorySteps() {
            ProcessWorkStepRulesCtrl.ePage.Masters.InstanceMandatoryStepsList = [{
                "FieldName": "WKI_PSI_InstanceNo",
                "InputName": "Current Instance No",
                "Value": "@InstanceNo",
                "DataType": "Long"
            }, {
                "FieldName": "WKI_WSI_StepNo",
                "InputName": "Step No",
                "Value": "",
                "DataType": "Decimal?"
            }];
        }

        function AddNewRule() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableAddRuleBtn = true;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.AddRuleBtnText = "Please Wait...";
            var _ruleNumber = 1;
            var _ruleNoList = [];
            if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource) {
                if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource.length == 0) {
                    _ruleNumber = 1;
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource.map(function (value, key) {
                        _ruleNoList.push(value.RuleNo);
                    });

                    if (_ruleNoList.length == 0) {
                        _ruleNoList.push(1);
                    }
                    Array.prototype.max = function () {
                        return Math.max.apply(null, this);
                    };

                    _ruleNumber = _ruleNoList.max() + 1;
                }
            }

            var _obj = {
                "WSI_FK": ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.PK,
                "WSI_StepNo": ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.StepNo,
                "SAP_FK": ProcessWorkStepRulesCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
                "ActionType": "REGULAR",
                "RuleNo": _ruleNumber,
                "MandatorySteps": JSON.stringify([]),
                "Rules": JSON.stringify([]),
                "Mode": ProcessWorkStepRulesCtrl.ePage.Masters.Param.Mode,
                "IsActive": true,
                "RuleName": "Rule " + _ruleNumber,
                "Remarks": "",
                "WorkStepActions": []
            };

            var _input = [_obj];
            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepRules.API.Upsert.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    _response.MandatorySteps = JSON.parse(_response.MandatorySteps);
                    _response.Rules = JSON.parse(_response.Rules);
                    _response.WorkStepActions = [];

                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource.push(_response);
                    OnRuleChange(_response);
                }

                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableAddRuleBtn = false;
                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.AddRuleBtnText = "Add Rules";
            });
        }

        function OnRuleChange($item) {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule = undefined;

            $timeout(function () {
                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule = $item;
                if (!ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.RuleType) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.RuleType = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RuleTypeList[0].Code;
                }

                if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.GenerateScriptInput = {
                        ObjectName: "EBPM_WorkStepRules",
                        ObjectId: ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.PK
                    };
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.GenerateScriptConfig = {
                        IsEnableTable: false,
                        IsEnablePK: false,
                        IsEnableTenant: false
                    };
                }
                GetActionList();
            });

        }

        function SaveRulesValidation() {
            if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.MandatorySteps.length == 0 && ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.Rules.length == 0) {
                SaveRules();
            } else if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.MandatorySteps.length > 0 || ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.Rules.length > 0) {
                if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.Remarks != undefined && ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.Remarks != null && ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.Remarks != "") {
                    SaveRules();
                } else {
                    toastr.warning("Add Remarks...!");
                }
            }
        }

        function SaveRules() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesSaveBtn = true;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesSaveBtnText = "Please Wait...";

            var _input = angular.copy(ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule);
            _input.SAP_FK = ProcessWorkStepRulesCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.IsModified = true;
            _input.MandatorySteps = JSON.stringify(_input.MandatorySteps);
            _input.Rules = JSON.stringify(_input.Rules);
            _input.WSI_StepNo = ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.StepNo;
            _input.WSI_FK = ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepRules.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(response.data.Response[0].PK);

                    if (_index !== -1) {
                        var _response = response.data.Response[0];
                        _response.MandatorySteps = JSON.parse(_response.MandatorySteps);
                        _response.Rules = JSON.parse(_response.Rules);

                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource[_index] = _response;
                        OnRuleChange(_response);
                    }
                } else {
                    toastr.error("Failed...!");
                }

                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesSaveBtn = false;
                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesSaveBtnText = "Save";
            });
        }

        function DeleteRulesConfirmation($index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteRules($index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteRules() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesDeleteBtn = true;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesDeleteBtnText = "Please Wait";
            var _input = angular.copy(ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule);

            _input.IsModified = true;
            _input.IsDeleted = true;
            _input.MandatorySteps = JSON.stringify(_input.MandatorySteps);
            _input.Rules = JSON.stringify(_input.Rules);
            _input.WorkStepActions = JSON.stringify(_input.WorkStepActions);

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepRules.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_input.PK);

                    if (_index !== -1) {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource.splice(_index, 1);
                    }

                    if (
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource.length > 0) {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource[0];
                    } else {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule = undefined;
                    }
                } else {
                    toastr.error("Failed...!");
                }

                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesDeleteBtn = false;
                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesDeleteBtnText = "Delete";
            });
        }
        // ============================= Rules End =============================

        // ============================= Action Start =============================
        function InitWorkStepActions() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions = {};
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView = {};

            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.AddAction = AddAction;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.EditAction = EditAction;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.OpenJsonModal = OpenJsonModal;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.DeleteAction = DeleteActionConfirmation;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.SaveAction = SaveAction;

            ProcessWorkStepRulesCtrl.ePage.Masters.IsDisableActionSaveBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.ActionSaveBtnText = "Save";
            ProcessWorkStepRulesCtrl.ePage.Masters.IsDisableActionDeleteBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.ActionDeleteBtnText = "Delete";

            GetResultTypeList();
            GetActionTypeList();
            GetCallBackModeList();
            GetProcessList();

            InitNotification();
            InitTaskConfig();
        }

        function GetActionList() {
            var _filter = {
                "SAP_FK": ProcessWorkStepRulesCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
                "WSI_FK": ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.PK,
                "WSR_FK": ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMWorkStepActions.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepActions.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions = response.data.Response;

                    EditAction(ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions[0]);
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions = [];
                    toastr.error("Failed...!");
                }
            });
        }

        function GetResultTypeList() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ResultTypeList = [{
                "Code": "TRUE_ACTION",
                "Name": "TRUE_ACTION"
            }, {
                "Code": "FALSE_ACTION",
                "Name": "FALSE_ACTION"
            }, {
                "Code": "DEFAULT_ACTION",
                "Name": "DEFAULT_ACTION"
            }];
        }

        function GetActionTypeList() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActionTypeList = [{
                "Code": "REGULAR",
                "Name": "REGULAR"
            }, {
                "Code": "EXTERNAL",
                "Name": "EXTERNAL"
            }, {
                "Code": "CHILD",
                "Name": "CHILD"
            }];
        }

        function GetCallBackModeList() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.CallBackModeListAfter = [{
                "Code": "AFTER_INIT",
                "Name": "AFTER_INIT"
            }, {
                "Code": "AFTER_COMPLETE",
                "Name": "AFTER_COMPLETE"
            }];

            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.CallBackModeListBefore = [{
                "Code": "BEFORE_INIT",
                "Name": "BEFORE_INIT"
            }, {
                "Code": "BEFORE_COMPLETE",
                "Name": "BEFORE_COMPLETE"
            }];
        }

        function GetProcessList() {
            var _filter = {
                "SAP_FK": ProcessWorkStepRulesCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.EBPMProcessMasterList = response.data.Response;
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.EBPMProcessMasterList = [];
                }
            });
        }

        function AddAction() {
            var _actionNo = 1;
            var _actionNoList = [];

            if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions) {
                if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.length > 0) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.map(function (value, key) {
                        _actionNoList.push(value.ActionNo);
                    });

                    if (_actionNoList.length == 0) {
                        _actionNoList.push(1);
                    }
                    Array.prototype.max = function () {
                        return Math.max.apply(null, this);
                    };

                    _actionNo = _actionNoList.max() + 1;
                } else {
                    _actionNo = 1;
                }
            } else {
                ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions = [];
            }

            var _obj = {
                ActionNo: _actionNo,
                ActionName: "Action " + _actionNo,
                ActionType: "REGULAR",
                ResultType: "DEFAULT_ACTION",
                InitStepNo: 0,
                ChildReturnBackStepNo: 0
            };

            SaveAction(_obj);
        }

        function EditAction($item, $index) {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = $item;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView = ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction;

            if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView) {
                if (!ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig = "[]";
                }
                if (!ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig = "[]";
                }

                if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig) {
                    if (typeof ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig == "string") {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationGroup = JSON.parse(ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig);
                    }
                }

                if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig) {
                    if (typeof ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig == "string") {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup = JSON.parse(ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig);
                    }
                }
            }

            if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction) {
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.GenerateScriptInput = {
                    ObjectName: "EBPM_WorkStepActions",
                    ObjectId: ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction.PK
                };
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function DeleteActionConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteAction();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteAction() {
            ProcessWorkStepRulesCtrl.ePage.Masters.IsDisableActionDeleteBtn = true;
            ProcessWorkStepRulesCtrl.ePage.Masters.ActionDeleteBtnText = "Please Wait...";

            var $item = angular.copy(ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction);

            if ($item.PK) {
                var $index = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.map(function (value, key) {
                    return value.PK;
                }).indexOf($item.PK);

                $item.IsModified = true;
                $item.IsDeleted = true;
                var _input = [$item];

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepActions.API.Upsert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.splice($index, 1);

                        if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.length == 0) {
                            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = undefined;
                        } else {
                            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions[0];
                        }
                    }
                    ProcessWorkStepRulesCtrl.ePage.Masters.IsDisableActionDeleteBtn = false;
                    ProcessWorkStepRulesCtrl.ePage.Masters.ActionDeleteBtnText = "Delete";
                });
            } else {
                var _index = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.map(function (value, key) {
                    return value.ActionNo;
                }).indexOf($item.ActionNo);

                if (!$item.PK) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.splice(_index, 1);
                }

                if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.length == 0) {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = undefined;
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions[0];
                }

                ProcessWorkStepRulesCtrl.ePage.Masters.IsDisableActionDeleteBtn = false;
                ProcessWorkStepRulesCtrl.ePage.Masters.ActionDeleteBtnText = "Delete";
            }
        }

        function SaveAction($item) {
            ProcessWorkStepRulesCtrl.ePage.Masters.IsDisableActionSaveBtn = true;
            ProcessWorkStepRulesCtrl.ePage.Masters.ActionSaveBtnText = "Please Wait...";

            var _input = $item;
            _input.SAP_FK = ProcessWorkStepRulesCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.IsModified = true;
            _input.IsDeleted = false;
            _input.WSI_FK = ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.PK;
            _input.WSI_StepNo = ProcessWorkStepRulesCtrl.ePage.Masters.Param.Item.StepNo;
            _input.WSR_FK = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepActions.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    if (!$item.PK) {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.push(_response);
                    } else {
                        var _index = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.map(function (value, key) {
                            return value.PK;
                        }).indexOf($item.PK);

                        if (_index !== -1) {
                            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions[_index] = _response;
                        }
                    }

                    EditAction(_response);
                } else {
                    toastr.error("Failed...!")
                }

                ProcessWorkStepRulesCtrl.ePage.Masters.IsDisableActionSaveBtn = false;
                ProcessWorkStepRulesCtrl.ePage.Masters.ActionSaveBtnText = "Save";
            });
        }

        function OpenJsonModal(objName) {
            var _json = ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView[objName]
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView[objName] = result;
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
        // ============================= Action End =============================

        // Notification
        function InitNotification() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.Notification = {};

            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.Notification.OnEditNotification = OnEditNotification;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.Notification.CloseNotificationModal = CloseNotificationModal;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.Notification.PrepareNotification = PrepareNotification;
        }

        function EditNotificationModalInstance() {
            return ProcessWorkStepRulesCtrl.ePage.Masters.Actions.EditNotificationModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-notification-modal right",
                scope: $scope,
                template: `<div ng-include src="'ProcessWorkStepEditNotification'"></div>`
            });
        }

        function CloseNotificationModal() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.EditNotificationModal.dismiss('cancel');
        }

        function OnEditNotification() {
            if (!ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationGroup) {
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationGroup = [];
            }

            EditNotificationModalInstance().result.then(function (response) {}, function () {
                CloseNotificationModal();
            });
        }

        function PrepareNotification() {
            if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationGroup) {
                if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationGroup.length > 0) {
                    var _Group = angular.copy(ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value1, key1) {
                            if (value1.Attachment.length > 0) {
                                value1.Attachment.map(function (value2, key2) {
                                    delete value2.FieldNo;
                                    delete value2.FieldName;
                                });
                            }
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig = _Group;
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig = "[]";
                }
            } else {
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.NotificationConfig = "[]";
            }

            CloseNotificationModal();
        }

        // Task Config
        function InitTaskConfig() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.TaskConfig = {};

            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.TaskConfig.OnEditTaskConfig = OnEditTaskConfig;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.TaskConfig.CloseTaskConfigModal = CloseTaskConfigModal;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.TaskConfig.PrepareTaskConfig = PrepareTaskConfig;
        }

        function EditTaskConfigModalInstance() {
            return ProcessWorkStepRulesCtrl.ePage.Masters.Actions.EditTaskConfigModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-task-config-modal right",
                scope: $scope,
                template: `<div ng-include src="'ProcessWorkStepEditTaskConfig'"></div>`
            });
        }

        function CloseTaskConfigModal() {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.EditTaskConfigModal.dismiss('cancel');
        }

        function OnEditTaskConfig() {
            if (!ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup || ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup.length == 0) {
                var _obj = {
                    // "ProcessType": "Process",
                    // "ProcessName": ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.Process,
                    // "Action": "Init",
                    "DataSlots": {},
                    "DataSlotKey": "Val1",
                    "DataSlotValue": "",
                    "DataSlotsDisplay": undefined,
                    "QueryResults": [{
                        "SQL": "",
                        "Parameters": []
                    }]
                };

                if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.ActionType == 'REGULAR') {
                    _obj.ProcessType = "Task";
                    _obj.ProcessName = "";
                    _obj.Action = "Complete";
                } else {
                    _obj.ProcessType = "Process";
                    _obj.ProcessName = ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.Process;
                    _obj.Action = "Init";
                }

                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup = [];
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup.push(_obj);
            } else {
                if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.ActionType == 'REGULAR') {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup[0].ProcessType = "Task";
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup[0].ProcessName = undefined;
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup[0].Action = "Complete";
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup[0].ProcessType = "Process";
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup[0].ProcessName = ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.Process;
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup[0].Action = "Init";
                }
            }

            if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.ActionType == 'REGULAR') {
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.TaskDirConfig = {
                    ActionList: ["Complete", "Activate"],
                    ProcessTypeList: ["Task"]
                };
            } else {
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.TaskDirConfig = {
                    ActionList: ["Init"],
                    ProcessTypeList: ["Process"]
                };
            }

            if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.ActionType == 'REGULAR') {
                EditTaskConfigModalInstance().result.then(function (response) {}, function () {
                    CloseTaskConfigModal();
                });
            } else {
                if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.Process) {
                    EditTaskConfigModalInstance().result.then(function (response) {}, function () {
                        CloseTaskConfigModal();
                    });
                } else {
                    toastr.warning("Select any Process...!");
                }
            }
        }

        function PrepareTaskConfig() {
            if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup) {
                if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup.length > 0) {
                    var _Group = angular.copy(ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfigGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value1, key1) {
                            if (value1.DataSlotKey || value1.DataSlotKey == "" || value1.DataSlotKey == " ") {
                                delete value1.DataSlotKey;
                            }
                            if (value1.DataSlotValue || value1.DataSlotValue == "" || value1.DataSlotValue == " ") {
                                delete value1.DataSlotValue;
                            }
                            if (value1.QueryResults.length > 0) {
                                value1.QueryResults.map(function (value2, key2) {
                                    delete value2.FieldNo;
                                    delete value2.FieldName;
                                });
                            }
                        });
                    }

                    if (ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.ActionType == 'REGULAR') {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.Process = _Group[0].ProcessName;
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig = _Group;
                } else {
                    ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig = "[]";
                }
            } else {
                ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView.TaskConfig = "[]";
            }

            CloseTaskConfigModal();
        }

        Init();
    }
})();