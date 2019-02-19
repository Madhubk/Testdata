(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DocModalController", DocModalController);

    DocModalController.$inject = ["$injector", "$uibModalInstance", "helperService", "param"];

    function DocModalController($injector, $uibModalInstance, helperService, param) {
        var DocModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            // var currentBatch = param.currentBatch[param.currentBatch.label].ePage.Entities;
            DocModalCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Upload_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitPOUploadModal();
        }

        function InitPOUploadModal() {
            DocModalCtrl.ePage.Masters.Param = param;
            DocModalCtrl.ePage.Masters.Cancel = Cancel;
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();