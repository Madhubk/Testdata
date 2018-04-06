(function () {
    "use strict";

    angular
        .module("Application")
        .controller("containerPopUpModalController", ContainerPopUpModalController);

    ContainerPopUpModalController.$inject = ["helperService", "apiService", "appConfig", "consolidationConfig", "$uibModalInstance", "param", "toastr"];

    function ContainerPopUpModalController(helperService, apiService, appConfig, consolidationConfig, $uibModalInstance, param, toastr) {
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
           

            ContainerPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            ContainerPopUpModalCtrl.ePage.Masters.Save = Save;
            ContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            ContainerPopUpModalCtrl.ePage.Masters.SaveButton = 'Save'

            if (param.Mode !== 'edit') {
                ContainerPopUpModalCtrl.ePage.Masters.Container.FormView = param.Cnt_Data;
                ContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(param.Cnt_Data);
            } else {
                GetByIdContainer();
            }
        }

        function GetByIdContainer() {
            apiService.get("eAxisAPI", ContainerPopUpModalCtrl.ePage.Entities.Container.API.GetById.Url + param.Cnt_Data.PK).then(function (response) {
                if (response.data.Response) {
                    ContainerPopUpModalCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(response.data.Response.UICntContainer);
                    ContainerPopUpModalCtrl.ePage.Masters.Container.FormView = response.data.Response.UICntContainer;
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
            var _isEmpty = angular.equals({}, ContainerPopUpModalCtrl.ePage.Masters.Container.FormView);

            if (!_isEmpty) {
                ContainerPopUpModalCtrl.ePage.Masters.SaveButton = 'Please wait..'
                ContainerPopUpModalCtrl.ePage.Masters.SaveButtonDisable = true
                if (param.Mode == 'new') {
                    var url = ContainerPopUpModalCtrl.ePage.Entities.Container.API.Insert.Url
                    var _input = [ContainerPopUpModalCtrl.ePage.Masters.Container.FormView]
                    _input[0].CON_FK = ContainerPopUpModalCtrl.ePage.Entities.Header.Data.PK;

                } else {
                    url = ContainerPopUpModalCtrl.ePage.Entities.Container.API.Update.Url
                    _input = ContainerPopUpModalCtrl.ePage.Masters.Container.FormView
                    _input.IsModified = true;
                }

                apiService.post("eAxisAPI", url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (param.Mode == 'new') {
                            var _result = response.data.Response[0];
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
            } else {
                toastr.warning("Cannot Insert Empty Data...!");
            }


        }
        Init();
    }
})();