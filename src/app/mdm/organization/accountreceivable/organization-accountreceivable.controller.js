(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountReceivableController", AccountReceivableController);

    AccountReceivableController.$inject = ["helperService", "$uibModal", "$scope"];

    function AccountReceivableController(helperService, $uibModal, $scope) {
        var AccountReceivableCtrl = this;

        function Init() {

            var currentOrganization = AccountReceivableCtrl.currentOrganization[AccountReceivableCtrl.currentOrganization.code].ePage.Entities;

            AccountReceivableCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_AccountReceivable",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            AccountReceivableCtrl.ePage.Masters.EditableMode = EditableMode;
        }

        //#region EditableMode
        function EditableMode(type) {
            if (type == "configuration") {
                AccountReceivableCtrl.ePage.Masters.ControllerName = "ConfigurationController as ConfigurationCtrl";
            }
            else if (type == "credit-control") {
                AccountReceivableCtrl.ePage.Masters.ControllerName = "CreditControlController as CreditControlCtrl";
            }
            else if (type == "invoice") {
                AccountReceivableCtrl.ePage.Masters.ControllerName = "InvoiceController as InvoiceCtrl";
            }

            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-edit-modal-warehouse right",
                scope: $scope,
                templateUrl: 'app/mdm/organization/accountreceivable/editable-mode/' + type + '.html',
                controller: AccountReceivableCtrl.ePage.Masters.ControllerName,
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": AccountReceivableCtrl.currentOrganization,
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response) {

                    }
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion
        Init();
    }

})();