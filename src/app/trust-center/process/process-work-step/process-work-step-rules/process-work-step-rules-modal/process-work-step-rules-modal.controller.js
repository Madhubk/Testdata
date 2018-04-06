(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WorkStepRulesActionsModalController", WorkStepRulesActionsModalController);
    WorkStepRulesActionsModalController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation", "param", "$uibModalInstance"];

    function WorkStepRulesActionsModalController($scope, $location, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation, param, $uibModalInstance) {

        var WorkStepRulesActionsModalCtrl = this;
        var _queryString = $location.path().split("/").pop();


        function Init() {
            WorkStepRulesActionsModalCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessWorkStepAccess",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            WorkStepRulesActionsModalCtrl.ePage.Masters.emptyText = "-";

            try {
                WorkStepRulesActionsModalCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (WorkStepRulesActionsModalCtrl.ePage.Masters.QueryString.AppPk) {
                    InitProcessWorkStepRulesModal();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitProcessWorkStepRulesModal() {
            WorkStepRulesActionsModalCtrl.ePage.Masters.ProcessWorkStepRulesModal = {};
            WorkStepRulesActionsModalCtrl.ePage.Masters.param = param;
            WorkStepRulesActionsModalCtrl.ePage.Masters.ProcessWorkStepRulesModal.Cancel = Cancel;
            WorkStepRulesActionsModalCtrl.ePage.Masters.ProcessWorkStepRulesModal.Save = Save;

            if (param.Type == 'rules') {
                InitRules();
            } else if (param.Type == 'action') {
                InitActions();
            }

        }

        /** Rules */
        function InitRules() {
            WorkStepRulesActionsModalCtrl.ePage.Masters.Rules = {};
            WorkStepRulesActionsModalCtrl.ePage.Masters.Rules.FormView = {};

            if (WorkStepRulesActionsModalCtrl.ePage.Masters.param.Item) {
                WorkStepRulesActionsModalCtrl.ePage.Masters.Rules.FormView = WorkStepRulesActionsModalCtrl.ePage.Masters.param.Item;
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        function Save($item, type) {
           if (param.Type == 'rules') {
                SaveRules($item);
            } else if (param.Type == 'action') {
                SaveActions($item);

            }
        }

        function SaveRules($item) {
            WorkStepRulesActionsModalCtrl.ePage.Masters.IsDisableSave = true;
            var _input = angular.copy($item);
            _input.SAP_FK = WorkStepRulesActionsModalCtrl.ePage.Masters.QueryString.AppPk,
                _input.TenantCode = authService.getUserInfo().TenantCode,
                _input.IsModified = true;
            _input.IsDeleted = false;
            _input.WSI_FK = WorkStepRulesActionsModalCtrl.ePage.Masters.param.ParentItem.PK;
            _input.Mode = WorkStepRulesActionsModalCtrl.ePage.Masters.param.Mode;
            _input.MandatorySteps = JSON.stringify($item.MandatorySteps);
            _input.Rules = JSON.stringify($item.Rules);




            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepRules.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                   
                    var _response = response.data.Response[0];
                   
                    _response.MandatorySteps = JSON.parse(_response.MandatorySteps);
                    _response.Rules = JSON.parse(_response.Rules);
                   
                    var _obj = {
                        data: _response,
                        type: WorkStepRulesActionsModalCtrl.ePage.Masters.param.Type,
                        isNewMode: WorkStepRulesActionsModalCtrl.ePage.Masters.param.isNewMode
                        
                    }
                    
                    $uibModalInstance.close(_obj);
                    toastr.success("Saved Successfully ...!");
                }
            });
        }

        /** Actions */
        function InitActions() {
            WorkStepRulesActionsModalCtrl.ePage.Masters.Actions = {};
            WorkStepRulesActionsModalCtrl.ePage.Masters.Actions.FormView = {};

            if (WorkStepRulesActionsModalCtrl.ePage.Masters.param.Item) {
                WorkStepRulesActionsModalCtrl.ePage.Masters.Actions.FormView = WorkStepRulesActionsModalCtrl.ePage.Masters.param.Item;
            } else {
                WorkStepRulesActionsModalCtrl.ePage.Masters.Actions.FormView.ActionNo = WorkStepRulesActionsModalCtrl.ePage.Masters.param.ActionNo;
            }

            ActionTypeList();
            GetProcessList();
            GetCallBackModeList();
        }

        function ActionTypeList() {
            WorkStepRulesActionsModalCtrl.ePage.Masters.Actions.ActionTypeList = [{
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

        function GetCallBackModeList() {
            WorkStepRulesActionsModalCtrl.ePage.Masters.Actions.CallBackModeList = [{
                "Code": "BEFORE_INIT",
                "Name": "BEFORE_INIT"
            }, {
                "Code": "AFTER_INIT",
                "Name": "AFTER_INIT"
            }, {
                "Code": "AFTER_COMPLETE",
                "Name": "AFTER_COMPLETE"
            }, {
                "Code": "BEFORE_COMPLETE",
                "Name": "BEFORE_COMPLETE"
            }];
        }

        function GetProcessList() {
            var _filter = {
                "SAP_FK": WorkStepRulesActionsModalCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    WorkStepRulesActionsModalCtrl.ePage.Masters.Actions.EBPMProcessMasterList = response.data.Response;
                   
                }

            });
        }

        function SaveActions($item) {
            var _input = angular.copy($item)
            _input.SAP_FK = WorkStepRulesActionsModalCtrl.ePage.Masters.QueryString.AppPk,
            _input.TenantCode = authService.getUserInfo().TenantCode,
            _input.IsModified = true;
            _input.IsDeleted = false;
            _input.WSI_FK = WorkStepRulesActionsModalCtrl.ePage.Masters.param.ParentItem.PK;
            _input.WSR_FK = WorkStepRulesActionsModalCtrl.ePage.Masters.param.RuleName.PK;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepActions.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];

                    var _obj = {
                        data: _response,
                        type: WorkStepRulesActionsModalCtrl.ePage.Masters.param.Type,
                        isNewMode: WorkStepRulesActionsModalCtrl.ePage.Masters.param.isNewMode
                    }
                    $uibModalInstance.close(_obj);
                    toastr.success("Saved Successfully...!");
                }
            });
        }



        Init();
    }
})();
