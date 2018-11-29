(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerModalPopUpController", ContainerModalPopUpController);

    ContainerModalPopUpController.$inject = ["helperService", "apiService", "appConfig", "$uibModalInstance", "param", "toastr", "errorWarningService"];

    function ContainerModalPopUpController(helperService, apiService, appConfig, $uibModalInstance, param, toastr, errorWarningService) {
        var ContainerModalPopUpCtrl = this;

        function Init() {
            var currentObject = param.currentObject[param.currentObject.label].ePage.Entities;
            ContainerModalPopUpCtrl.ePage = {
                "Title": "",
                "Prefix": "ContainerModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObject
            };
            ContainerModalPopUpCtrl.ePage.Masters.Container = {};
            ContainerModalPopUpCtrl.ePage.Masters.refCode = param.currentObject.label
            ContainerModalPopUpCtrl.ePage.Masters.Cancel = Cancel;
            // ContainerModalPopUpCtrl.ePage.Masters.Save = Save;
            ContainerModalPopUpCtrl.ePage.Masters.SaveButtonDisable = false;
            ContainerModalPopUpCtrl.ePage.Masters.SaveButton = 'Save'

            // ContainerModalPopUpCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // ContainerModalPopUpCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consol.Entity[param.currentConsol.code + "Container"].GlobalErrorWarningList;
            // ContainerModalPopUpCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consol.Entity[param.currentConsol.code + "Container"];
            // ContainerModalPopUpCtrl.ePage.Masters.ErrorWarningConfig.ErrorCodeList = errorWarningService.Modules.Consol.ErrorCodeList
            if (param.Mode !== 'edit') {
                ContainerModalPopUpCtrl.ePage.Masters.Container.FormView = param.Cnt_Data;
                ContainerModalPopUpCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(param.Cnt_Data);
            } else {
                GetByIdContainer();
            }
        }

        function GetByIdContainer() {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainer.API.GetById.Url + param.Cnt_Data.PK).then(function (response) {
                if (response.data.Response) {
                    // ContainerModalPopUpCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(response.data.Response.UICntContainer);
                    // ContainerModalPopUpCtrl.ePage.Masters.Container.FormView = response.data.Response.UICntContainer;
                    ContainerModalPopUpCtrl.ePage.Masters.Container.FormViewCopy = angular.copy(response.data.Response);
                    ContainerModalPopUpCtrl.ePage.Masters.Container.FormView = response.data.Response;
                }
            });
        }

        function Cancel() {
            var _export1 = {
                "data": ContainerModalPopUpCtrl.ePage.Masters.Container.FormViewCopy,
                "index": param.index
            };
            $uibModalInstance.close(_export1)

        }

        // function Save() {
        //     // ContainerModalPopUpCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('Consol', param.currentConsol.code + "Container", ContainerModalPopUpCtrl.ePage.Masters.Container.FormView.RC_Type, 'E0007', false)
        //     // var error = ContainerModalPopUpCtrl.ePage.Masters.ErrorWarningConfig.SubmitErrorLengthCheck('Consol', param.currentConsol.code + "Container")
        //     // if (error) {
        //     var _isEmpty = angular.equals({}, ContainerModalPopUpCtrl.ePage.Masters.Container.FormView);

        //     if (!_isEmpty) {
        //         ContainerModalPopUpCtrl.ePage.Masters.SaveButton = 'Please wait..'
        //         ContainerModalPopUpCtrl.ePage.Masters.SaveButtonDisable = true
        //         if (param.Mode == 'new') {
        //             var url = ContainerModalPopUpCtrl.ePage.Entities.Container.API.Insert.Url
        //             var _input = [ContainerModalPopUpCtrl.ePage.Masters.Container.FormView]
        //             _input[0].CON_FK = ContainerModalPopUpCtrl.ePage.Entities.Header.Data.PK;

        //         } else {
        //             url = appConfig.Entities.CntContainer.API.Update.Url
        //             _input = ContainerModalPopUpCtrl.ePage.Masters.Container.FormView
        //             _input.IsModified = true;
        //         }
        //         apiService.post("eAxisAPI", url, _input).then(function (response) {
        //             if (response.data.Response) {
        //                 if (param.Mode == 'new') {
        //                     var _result = response.data.Response[0];
        //                 } else {
        //                     _result = response.data.Response;
        //                 }
        //                 var _export = {
        //                     "data": _result,
        //                     "index": param.index
        //                 };
        //                 ContainerModalPopUpCtrl.ePage.Masters.SaveButtonDisable = false
        //                 $uibModalInstance.close(_export)
        //             }
        //         });
        //     } else {
        //         toastr.warning("Cannot Insert Empty Data...!");
        //     }
        //     // }
        // }
        Init();
    }
})();
