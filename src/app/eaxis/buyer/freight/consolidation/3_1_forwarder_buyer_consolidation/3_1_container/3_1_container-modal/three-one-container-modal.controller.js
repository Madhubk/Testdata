(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneContainerPopUpModalController", ThreeOneContainerPopUpModalController);

    ThreeOneContainerPopUpModalController.$inject = ["helperService", "apiService", "appConfig", "$uibModalInstance", "param", "toastr", "errorWarningService"];

    function ThreeOneContainerPopUpModalController(helperService, apiService, appConfig, $uibModalInstance, param, toastr, errorWarningService) {
        var ThreeOneContainerPopUpModalCtrl = this;

        function Init() {
            var currentConsol = param.currentConsol[param.currentConsol.label].ePage.Entities;
            ThreeOneContainerPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ContainerModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container = {};
            ThreeOneContainerPopUpModalCtrl.ePage.Masters.refCode = param.currentConsol.label
            ThreeOneContainerPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            ThreeOneContainerPopUpModalCtrl.ePage.Masters.Save = Save;
            ThreeOneContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            ThreeOneContainerPopUpModalCtrl.ePage.Masters.SaveButton = 'Save'

            // ThreeOneContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // ThreeOneContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consol.Entity[param.currentConsol.code + "Container"].GlobalErrorWarningList;
            // ThreeOneContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consol.Entity[param.currentConsol.code + "Container"];
            // ThreeOneContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList = errorWarningService.Modules.Consol.ErrorCodeList
            if (param.Mode !== 'edit') {
                ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView = param.Cnt_Data;
                //console.log(ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.PK);
                ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(param.Cnt_Data);
            } else {
                GetByIdContainer();
            }
        }

        function GetByIdContainer() {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + param.Cnt_Data.PK).then(function (response) {
                if (response.data.Response) {
                    ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(response.data.Response.UICntContainer);
                    ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView = response.data.Response.UICntContainer;
                    ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(response.data.Response);
                    ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView = response.data.Response;
                }
            });
        }

        function Cancel() {
            if (param.Mode == 'edit') {
                var _export1 = {
                    "data": ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy,
                    "index": param.index
                };
                $uibModalInstance.close(_export1)

            } else {
                $uibModalInstance.dismiss('close')
            }
        }

        function Save() {
            // ThreeOneContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Consol', param.currentConsol.code + "Container", ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.RC_Type, 'E0007', false)
            // var error = ThreeOneContainerPopUpModalCtrl.ePage.Masters.ErrorWarningConfig.SubmitErrorLengthCheck('Consol', param.currentConsol.code + "Container")
            // if (error) {
            // Container Check
            var _Data = param.currentConsol[param.currentConsol.label].ePage.Entities,
                _input = _Data.Header.Data;
            if (ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo != null) {
                var dynamicFindAllInput = {
                    "ContainerNo": ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(dynamicFindAllInput),
                    "FilterID": appConfig.Entities.BuyerCntContainer.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        var cntcheck = false;
                        if (response.data.Response.length > 0) {
                            response.data.Response.map(function (val, key) {
                                if (param.Mode == 'new') {
                                    cntcheck = true;
                                } else if (param.Mode == 'edit') {
                                    if (val.PK == param.Cnt_Data.PK) {
                                        cntcheck = false;
                                    } else cntcheck = false;
                                }
                            });
                        }
                        if (ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo != null && ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerMode != null && ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.RC_Type != null) {
                            var validator = new ContainerValidator();
                            var validator1 = validator.isValid(ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView.ContainerNo);
                            if (!validator1) {
                                toastr.warning("Invalid Container #")
                                // ContainerFormCtrl.ePage.Masters.OnChangeValues(null, "E5564", false, undefined);
                            } else {
                                if (cntcheck == false) {
                                    ThreeOneContainerPopUpModalCtrl.ePage.Masters.SaveButton = 'Please wait..'
                                    ThreeOneContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = true
                                    if (param.Mode == 'new') {
                                        var url = ThreeOneContainerPopUpModalCtrl.ePage.Entities.Container.API.Insert.Url
                                        var _input = ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView
                                        _input.CON_FK = ThreeOneContainerPopUpModalCtrl.ePage.Entities.Header.Data.PK;

                                    } else {
                                        url = appConfig.Entities.BuyerCntContainer.API.Update.Url

                                        _input = ThreeOneContainerPopUpModalCtrl.ePage.Masters.Container.FormView
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
                                            ThreeOneContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false
                                            $uibModalInstance.close(_export)
                                        }
                                    });
                                } else {
                                    toastr.error("Duplicate Container Number");
                                }
                            }
                        } else {
                            toastr.error("Container Type, Container Mode Cannot be null...!");
                        }

                    }
                });
            } else
                toastr.error("Container number Cannot be null..!");
            // }
        }
        Init();
    }
})();