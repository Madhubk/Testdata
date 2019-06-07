(function () {
    "use strict";

    angular.module("Application")
        .controller("InvoiceController", InvoiceController);

    InvoiceController.$inject = ["$uibModalInstance", "helperService", "param"];

    function InvoiceController($uibModalInstance, helperService, param) {
        var InvoiceCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            InvoiceCtrl.ePage = {
                "Title": "",
                "Prefix": "Invoice",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": angular.copy(currentOrganization)
            };

            InvoiceCtrl.ePage.Masters.param = angular.copy(param);

            InvoiceCtrl.ePage.Masters.CloseButtonText = "Close";
            InvoiceCtrl.ePage.Masters.SaveButtonText = "Save";

            /* Function */
            InvoiceCtrl.ePage.Masters.Close = Close;
            InvoiceCtrl.ePage.Masters.Validation = Validation;
        }

        function Close() {
            $uibModalInstance.close();
        }

        function Validation() {

        }

        Init();
    }
})();