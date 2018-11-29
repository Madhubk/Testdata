(function () {
    "use strict";

    angular
        .module("Application")
        .controller("cancelModalController", CancelModalController);

    CancelModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function CancelModalController($uibModalInstance, helperService, param) {
        var CancelModalCtrl = this;

        function Init() {
            CancelModalCtrl.ePage = {
                "Title": "",
                "Prefix": "PreAdvice_Cancel_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitSupplierModal();
        }

        function InitSupplierModal() {
            CancelModalCtrl.ePage.Masters.param = param;
            CancelModalCtrl.ePage.Masters.Ok = Ok;
            CancelModalCtrl.ePage.Masters.Cancel = Cancel;
            CancelModalCtrl.ePage.Masters.SaveOrderList = param.CancelList;
            CancelModalCtrl.ePage.Masters.CancelButtonText = "Save";
            CancelModalCtrl.ePage.Masters.IsDisableSave = false;
        }

        function Ok() {
            CancelModalCtrl.ePage.Masters.CancelButtonText = "Please wait";
            CancelModalCtrl.ePage.Masters.IsDisableSave = true;
            $uibModalInstance.close(CancelModalCtrl.ePage.Masters.SaveOrderList);
        }

        function Cancel() {
            $uibModalInstance.dismiss(CancelModalCtrl.ePage.Masters.SaveOrderList);
        }

        Init();
    }
})();