(function () {
    "use strict";

    angular
        .module("Application")
        .controller("containerPopUpModalController", ContainerPopUpModalController);

    ContainerPopUpModalController.$inject = ["$timeout", "helperService", "apiService", "appConfig", "$uibModalInstance", "param", "toastr", "errorWarningService"];

    function ContainerPopUpModalController($timeout, helperService, apiService, appConfig, $uibModalInstance, param, toastr, errorWarningService) {
        var ContainerPopUpModalCtrl = this;

        function Init() {
            var currentConsol = param.currentConsol[param.currentConsol.label].ePage.Entities;
            ContainerPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ContainerModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ContainerPopUpModalCtrl.ePage.Masters.Container = {};
            ContainerPopUpModalCtrl.ePage.Masters.refCode = param.currentConsol.label
            ContainerPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            ContainerPopUpModalCtrl.ePage.Masters.Save = Save;
            ContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            ContainerPopUpModalCtrl.ePage.Masters.SaveButton = 'Save'

            // ContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // ContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consol.Entity[param.currentConsol.code + "Container"].GlobalErrorWarningList;
            // ContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consol.Entity[param.currentConsol.code + "Container"];
            // ContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList = errorWarningService.Modules.Consol.ErrorCodeList
            if (param.Mode !== 'edit') {
                ContainerPopUpModalCtrl.ePage.Masters.Container.FormView = param.Cnt_Data;
                //console.log(ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.PK);
                ContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(param.Cnt_Data);
            } else {
                GetByIdContainer();
            }
        }

        function GetByIdContainer() {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainer.API.GetById.Url + param.Cnt_Data.PK).then(function (response) {
                if (response.data.Response) {
                    ContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(response.data.Response.UICntContainer);
                    ContainerPopUpModalCtrl.ePage.Masters.Container.FormView = response.data.Response.UICntContainer;
                    ContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(response.data.Response);
                    ContainerPopUpModalCtrl.ePage.Masters.Container.FormView = response.data.Response;
                }
            });
        }
        function Cancel() {
            if (param.Mode == 'edit') {
                var _export1 = {
                    "data": ContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy,
                    "index": param.index
                };
                $uibModalInstance.close(_export1)

            } else {
                $uibModalInstance.dismiss('close')
            }
        }

        function Save() {
            // ContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Consol', param.currentConsol.code + "Container", ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.RC_Type, 'E0007', false)
            // var error = ContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.SubmitErrorLengthCheck('Consol', param.currentConsol.code + "Container")
            // if (error) {
            // Container Check
            var _Data = param.currentConsol[param.currentConsol.label].ePage.Entities,
                _input = _Data.Header.Data;
            if (ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo!=null)
            {
                var dynamicFindAllInput = {
                "ContainerNo": ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(dynamicFindAllInput),
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var cntcheck = false;
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (val, key) {
                            if (param.Mode == 'new') {
                                cntcheck = true;
                            }
                            else if (param.Mode == 'edit'){
                                if (val.PK == param.Cnt_Data.PK) {
                                    cntcheck = false;
                                }
                                else cntcheck = false;
                            }
                        });
                    }
                    if (ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo != null && ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerMode != null && ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.RC_Type != null) {
                        var validator = new ContainerValidator();
                        var validator1 = validator.isValid(ContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo);
                        if (!validator1) {
                            toastr.warning("Invalid Container #")
                            // ContainerFormCtrl.ePage.Masters.OnChangeValues(null, "E5564", false, undefined);
                        } else {
                            if (cntcheck == false) {
                                ContainerPopUpModalCtrl.ePage.Masters.SaveButton = 'Please wait..'
                                ContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = true
                                if (param.Mode == 'new') {
                                    var url = ContainerPopUpModalCtrl.ePage.Entities.Container.API.Insert.Url
                                    var _input = ContainerPopUpModalCtrl.ePage.Masters.Container.FormView
                                    _input.CON_FK = ContainerPopUpModalCtrl.ePage.Entities.Header.Data.PK;

                                } else {
                                    url = appConfig.Entities.CntContainer.API.Update.Url

                                    _input = ContainerPopUpModalCtrl.ePage.Masters.Container.FormView
                                    _input.IsModified = true;
                                }
                                apiService.post("eAxisAPI", url, _input).then(function (response) {
                                    if (response.data.Response) {
                                        if (param.Mode == 'new') {
                                            var _result = response.data.Response;
                                        } else {
                                            _result = response.data.Response;
                                        }
                                        var _export = {
                                            "data": _result,
                                            "index": param.index
                                        };
                                        ContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false
                                        $uibModalInstance.close(_export)
                                    }
                                });
                            }
                            else {
                                toastr.error("Duplicate Container Number");
                            }
                        }
                    }
                    else {
                        toastr.error("Container Type, Container Mode Cannot be null...!");
                    }

                }
            });
        }
        else 
        toastr.error("Container number Cannot be null..!");
            // }
        }
        Init();
    }
})();
