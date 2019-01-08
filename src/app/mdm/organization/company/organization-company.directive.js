(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationCompany", OrganizationCompany);

    function OrganizationCompany() {
        var exports = {
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
        var OrganizationCompanyCtrl = this;

        function Init() {
            var currentOrganization = OrganizationCompanyCtrl.currentOrganization[OrganizationCompanyCtrl.currentOrganization.code].ePage.Entities;

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
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(function (result) {
                DeleteCompany($item);
            }, function () {
                console.log("Cancelled");
            });
        }

        function DeleteCompany($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgCompanyData.API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Status == "ValidationFailed" || response.data.Status == "failed") {
                    if (response.data.Validations && response.data.Validations.length > 0) {
                        response.data.Validations.map(function (value, key) {
                            toastr.error(value.Message);
                        });
                    } else {
                        toastr.warning(response.data.Response);
                    }
                } else {
                    var _index = OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);

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
            var modalInstance = $uibModal.open({
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
                        var exports = {
                            "Entity": OrganizationCompanyCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "ActiveCompany": OrganizationCompanyCtrl.ePage.Masters.ActiveCompany
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.data) {
                        OrganizationCompanyCtrl.ePage.Entities.Header.Data = response.data;

                        OrganizationCompanyCtrl.currentOrganization[OrganizationCompanyCtrl.currentOrganization.code].ePage.Entities.Header.Data = OrganizationCompanyCtrl.ePage.Entities.Header.Data;

                        if (OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData && OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.length > 0) {
                            OnCompanySelect(OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData[OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.length - 1]);
                        }
                    }
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        Init();
    }
})();
