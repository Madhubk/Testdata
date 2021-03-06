(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationCompany", OrganizationCompany);

    function OrganizationCompany() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/company/organization-company.html",
            controller: "OrganizationCompanyController",
            controllerAs: "OrganizationCompanyCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationCompanyController", OrganizationCompanyController);

    OrganizationCompanyController.$inject = ["$scope", "$uibModal", "organizationConfig", "helperService", "confirmation", "apiService", "toastr"];

    function OrganizationCompanyController($scope, $uibModal, organizationConfig, helperService, confirmation, apiService, toastr) {
        /* jshint validthis: true */
        let OrganizationCompanyCtrl = this;

        function Init() {
            let currentOrganization = OrganizationCompanyCtrl.currentOrganization[OrganizationCompanyCtrl.currentOrganization.code].ePage.Entities;

            OrganizationCompanyCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Company",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrganizationCompanyCtrl.ePage.Masters.EmptyText = "-";

            try {
                OrganizationCompanyCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

                OrganizationCompanyCtrl.ePage.Masters.AddNewCompany = AddNewCompany;
                OrganizationCompanyCtrl.ePage.Masters.EditCompany = EditCompany;
                OrganizationCompanyCtrl.ePage.Masters.EditARDetails = EditARDetails;
                OrganizationCompanyCtrl.ePage.Masters.EditAPDetails = EditAPDetails;
                OrganizationCompanyCtrl.ePage.Masters.DeleteCompany = DeleteConfirmation;
                OrganizationCompanyCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;

                if (OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData && OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.length > 0) {
                    OnCompanySelect(OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData[0]);
                    PrepareGenerateScriptInput();
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        function OnCompanySelect($item) {
            OrganizationCompanyCtrl.ePage.Masters.ActiveCompany = angular.copy($item);
        }

        function AddNewCompany() {
            OpenEditForm(undefined, 'company');
        }

        function EditCompany($item) {
            OpenEditForm($item, 'company');
        }

        function EditARDetails() {
            OpenEditForm(OrganizationCompanyCtrl.ePage.Masters.ActiveCompany, 'ardetails');
        }

        function EditAPDetails() {
            OpenEditForm(OrganizationCompanyCtrl.ePage.Masters.ActiveCompany, 'apdetails');
        }

        function DeleteConfirmation($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => DeleteCompany($item), () => console.log("Cancelled"));
        }

        function DeleteCompany($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgCompanyData.API.Delete.Url + $item.PK).then(response => {
                if (response.data.Status == "ValidationFailed" || response.data.Status == "failed") {
                    (response.data.Validations && response.data.Validations.length > 0) ? response.data.Validations.map(value => toastr.error(value.Message)): toastr.warning(response.data.Response);
                } else {
                    let _index = OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.findIndex(value => value.PK === $item.PK);

                    if (_index != -1) {
                        OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.splice(_index, 1);
                    }

                    if (OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData && OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.length > 0) {
                        OnCompanySelect(OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData[0]);
                    }
                }
            });
        }

        function OpenEditForm($item, type) {
            let _tempResponse = angular.copy(OrganizationCompanyCtrl.currentOrganization[OrganizationCompanyCtrl.currentOrganization.code].ePage.Entities.Header.Data);

            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "right org-edit-modal-" + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/company/org-company-modal/" + type + "-modal.html",
                controller: 'OrgCompanyModalController as OrgCompanyModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        let exports = {
                            "Entity": OrganizationCompanyCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "ActiveCompany": OrganizationCompanyCtrl.ePage.Masters.ActiveCompany
                        };
                        return exports;
                    }
                }
            }).result.then(response => {
                if (response.data) {
                    OrganizationCompanyCtrl.ePage.Entities.Header.Data = response.data;

                    OrganizationCompanyCtrl.currentOrganization[OrganizationCompanyCtrl.currentOrganization.code].ePage.Entities.Header.Data = OrganizationCompanyCtrl.ePage.Entities.Header.Data;

                    if (OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData && OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.length > 0) {
                        OnCompanySelect(OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData[OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.length - 1]);

                        PrepareGenerateScriptInput();
                    }
                }
            }, () => {
                OrganizationCompanyCtrl.currentOrganization[OrganizationCompanyCtrl.currentOrganization.code].ePage.Entities.Header.Data = _tempResponse;
            });
        }

        function PrepareGenerateScriptInput() {
            OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.map(value => {
                value.GenerateScriptInput = {
                    ObjectName: "OrgCompanyData",
                    ObjectId: value.PK
                };
                value.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            });
        }

        Init();
    }
})();
