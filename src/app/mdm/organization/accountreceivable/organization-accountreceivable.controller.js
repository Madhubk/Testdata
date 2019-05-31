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

            AccountReceivableCtrl.ePage.Masters.EmptyText = "-";

            /* Function */
            AccountReceivableCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;
            AccountReceivableCtrl.ePage.Masters.EditableMode = EditableMode;

            if (AccountReceivableCtrl.ePage.Entities.Header.Data.OrgCompanyData && AccountReceivableCtrl.ePage.Entities.Header.Data.OrgCompanyData.length > 0) {
                OnCompanySelect(AccountReceivableCtrl.ePage.Entities.Header.Data.OrgCompanyData[0]);
            }
        }

        //#region OnCompanySelect
        function OnCompanySelect($item) {
            AccountReceivableCtrl.ePage.Masters.ActiveCompany = angular.copy($item);

            var index = -1;
            AccountReceivableCtrl.ePage.Entities.Header.Data.OrgCompanyData.map(function (value, key) {
                return value.PK == AccountReceivableCtrl.ePage.Masters.ActiveCompany.PK ? index = key : false;
            });
            AccountReceivableCtrl.ePage.Masters.CompanyDataIndex = index;
        }
        //#endregion

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
                    },
                    CompanyDataIndex: function () {
                        return AccountReceivableCtrl.ePage.Masters.CompanyDataIndex;
                    }
                }
            }).result.then(
                function (response) {
                    if (response) {
                        AccountReceivableCtrl.currentOrganization[AccountReceivableCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data;
                        AccountReceivableCtrl.ePage.Entities.Header.Data = response.data;
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion
        Init();
    }

})();