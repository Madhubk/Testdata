(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountPayableController", AccountPayableController);

    AccountPayableController.$inject = ["$uibModal", "$scope", "helperService", "apiService", "organizationConfig"];

    function AccountPayableController($uibModal, $scope, helperService, apiService, organizationConfig) {
        var AccountPayableCtrl = this;

        function Init() {
            var currentOrganization = AccountPayableCtrl.currentOrganization[AccountPayableCtrl.currentOrganization.code].ePage.Entities;

            AccountPayableCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_AccountPayable",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            /* Function */
            AccountPayableCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;
            AccountPayableCtrl.ePage.Masters.EditableMode = EditableMode;

            if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData && AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData.length > 0) {
                OnCompanySelect(AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[0]);
            }
        }

        //#region OnCompanySelect, BindAPConfiguration
        function OnCompanySelect($item) {
            AccountPayableCtrl.ePage.Masters.ActiveCompany = angular.copy($item);

            var index = -1;
            AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData.map(function (value, key) {
                return value.PK == AccountPayableCtrl.ePage.Masters.ActiveCompany.PK ? index = key : false;
            });
            AccountPayableCtrl.ePage.Masters.CompanyDataIndex = index;

            BindAPConfiguration()
        }

        function BindAPConfiguration() {
            if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].PK) {
                if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorCode && AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorDesc) {
                    AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].OCG_APCreditorGroupCodeDesc = AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorCode + ' - ' + AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorDesc;
                }
                if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountCode && AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountDesc) {
                    AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].FBN_APDefaultBankAccountCodeDesc = AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountCode + ' - ' + AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountDesc;
                }
                if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeCode && AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeDesc) {
                    AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].FCC_APDefaultChargeCodeDesc = AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeCode + ' - ' + AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeDesc;
                }
            }
        }
        //#endregion

        //#region EditableMode
        function EditableMode(type) {
            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-edit-modal-warehouse right",
                scope: $scope,
                templateUrl: 'app/mdm/organization/accountpayable/editable-tab-pages/' + type + '.html',
                controller: "APConfigurationController as APConfigurationCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": AccountPayableCtrl.currentOrganization,
                        };
                        return exports;
                    },
                    CompanyDataIndex: function () {
                        return AccountPayableCtrl.ePage.Masters.CompanyDataIndex;
                    }
                }
            }).result.then(
                function (response) {
                    if (response) {
                        apiService.get("eAxisAPI", organizationConfig.Entities.API.Org.API.GetById.Url + response.data.OrgHeader.PK).then(function (response) {
                            if (response.data.Status == 'Success') {
                                AccountPayableCtrl.currentOrganization[AccountPayableCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data.Response;
                                AccountPayableCtrl.ePage.Entities.Header.Data = response.data.Response;

                                if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorCode && AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorDesc) {
                                    AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].OCG_APCreditorGroupCodeDesc = AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorCode + ' - ' + AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].CreditorDesc;
                                }
                                if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountCode && AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountDesc) {
                                    AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].FBN_APDefaultBankAccountCodeDesc = AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountCode + ' - ' + AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountDesc;
                                }
                                if (AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeCode && AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeDesc) {
                                    AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].FCC_APDefaultChargeCodeDesc = AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeCode + ' - ' + AccountPayableCtrl.ePage.Entities.Header.Data.OrgCompanyData[AccountPayableCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeDesc;
                                }
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion

        Init();
    }
})();