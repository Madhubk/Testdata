(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessWorkStepRulesController", ProcessWorkStepRulesController);

    ProcessWorkStepRulesController.$inject = ["$location", "$timeout", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation", "$uibModalInstance", "param"];

    function ProcessWorkStepRulesController($location, $timeout, authService, apiService, helperService, appConfig, toastr, confirmation, $uibModalInstance, param) {
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

            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesSaveBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesSaveBtnText = "Save";
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableRulesDeleteBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.RulesDeleteBtnText = "Delete";
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.IsDisableAddRuleBtn = false;
            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.AddRuleBtnText = "Add Rules";

            ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveTab = "General";

            GetRules();
            GetRulesActionType();
            GetMode();
            GetInstanceRules();
            GetInstanceMandatorySteps();
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
                "FilterID": appConfig.Entities.EBPMWorkStepRules.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepRules.API.FindAll.Url, _input).then(function (response) {
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
            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepRules.API.Upsert.Url, _input).then(function (response) {
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

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepRules.API.Upsert.Url, [_input]).then(function (response) {
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

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepRules.API.Upsert.Url, [_input]).then(function (response) {
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

                    console.log(ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ListSource);
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
                "FilterID": appConfig.Entities.EBPMWorkStepActions.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepActions.API.FindAll.Url, _input).then(function (response) {
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
                "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
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
                ResultType: "DEFAULT_ACTION",
                InitStepNo: 0,
                ChildReturnBackStepNo: 0
            };

            SaveAction(_obj);
        }

        function EditAction($item, $index) {
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = $item;
            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.FormView = ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction;
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

                apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepActions.API.Upsert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.splice($index, 1);

                        if (ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions.length == 0) {
                            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = undefined;
                        } else {
                            ProcessWorkStepRulesCtrl.ePage.Masters.Actions.ActiveAction = ProcessWorkStepRulesCtrl.ePage.Masters.Rules.ActiveRule.WorkStepActions[0];
                        }
                    }
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

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepActions.API.Upsert.Url, [_input]).then(function (response) {
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
        // ============================= Action End =============================

        Init();
    }
})();
