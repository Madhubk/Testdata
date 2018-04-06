(function () {
    "use strict";

    angular
        .module("Application")
        .controller("cancelPopUpModalController", CancelPopUpModalController);

    CancelPopUpModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function CancelPopUpModalController($uibModalInstance, helperService,  param) {
        var CancelPopUpModalCtrl = this;

        function Init() {
            CancelPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_Cancel_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            
            InitCancelModal();            
        }

        function InitCancelModal() {
            CancelPopUpModalCtrl.ePage.Masters.param = param;
            CancelPopUpModalCtrl.ePage.Masters.Ok = Ok;
            CancelPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            CancelPopUpModalCtrl.ePage.Masters.DetachOrderList = param.CancelList;
            CancelPopUpModalCtrl.ePage.Masters.CancelButtonText = "Save";
            CancelPopUpModalCtrl.ePage.Masters.IsDisableSave =false;
        }
        function Ok() {
            CancelPopUpModalCtrl.ePage.Masters.CancelButtonText = "Please wait";
            CancelPopUpModalCtrl.ePage.Masters.IsDisableSave = true;
            $uibModalInstance.close(CancelPopUpModalCtrl.ePage.Masters.DetachOrderList);
        }

        function Cancel() {
            $uibModalInstance.dismiss(CancelPopUpModalCtrl.ePage.Masters.DetachOrderList);
        }

        Init();
    }
})();
