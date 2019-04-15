(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationEmployee", OrganizationEmployee);

    function OrganizationEmployee() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/employee/organization-employee.html",
            controller: "OrganizationEmployeeController",
            controllerAs: "OrganizationEmployeeCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationEmployeeController", OrganizationEmployeeController);

    OrganizationEmployeeController.$inject = ["$scope", "$uibModal", "apiService", "organizationConfig", "helperService", "confirmation"];

    function OrganizationEmployeeController($scope, $uibModal, apiService, organizationConfig, helperService, confirmation) {
        /* jshint validthis: true */
        let OrganizationEmployeeCtrl = this;

        function Init() {
            let currentOrganization = OrganizationEmployeeCtrl.currentOrganization[OrganizationEmployeeCtrl.currentOrganization.code].ePage.Entities;

            OrganizationEmployeeCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Employee",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrganizationEmployeeCtrl.ePage.Masters.EmptyText = "-";

            try {
                OrganizationEmployeeCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

                OrganizationEmployeeCtrl.ePage.Masters.AddNewEmployee = AddNewEmployee;
                OrganizationEmployeeCtrl.ePage.Masters.EditEmployee = EditEmployee;
                OrganizationEmployeeCtrl.ePage.Masters.DeleteEmployee = DeleteConfirmation;
                OrganizationEmployeeCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;

                if (OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgCompanyData && OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgCompanyData.length > 0) {
                    OnCompanySelect(OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgCompanyData[0]);

                    PrepareGenerateScriptInput();
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        function OnCompanySelect($item) {
            OrganizationEmployeeCtrl.ePage.Masters.ActiveCompany = angular.copy($item);
        }

        function AddNewEmployee() {
            OpenEditForm();
        }

        function EditEmployee($item) {
            OpenEditForm($item);
        }

        function OpenEditForm($item) {
            let _tempResponse = angular.copy(OrganizationEmployeeCtrl.currentOrganization[OrganizationEmployeeCtrl.currentOrganization.code].ePage.Entities.Header.Data);

            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-edit-modal-employee right",
                scope: $scope,
                templateUrl: "app/mdm/organization/employee/org-employee-modal/employee-modal.html",
                controller: 'OrgEmployeeModalController as OrgEmployeeModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        let exports = {
                            "Entity": OrganizationEmployeeCtrl.currentOrganization,
                            "Item": $item,
                            "ActiveCompany": OrganizationEmployeeCtrl.ePage.Masters.ActiveCompany
                        };
                        return exports;
                    }
                }
            }).result.then(response => {
                if (response.data) {
                    OrganizationEmployeeCtrl.ePage.Entities.Header.Data = response.data;

                    OrganizationEmployeeCtrl.currentOrganization[OrganizationEmployeeCtrl.currentOrganization.code].ePage.Entities.Header.Data = OrganizationEmployeeCtrl.ePage.Entities.Header.Data;

                    PrepareGenerateScriptInput();
                }
            }, () => {
                OrganizationEmployeeCtrl.currentOrganization[OrganizationEmployeeCtrl.currentOrganization.code].ePage.Entities.Header.Data = _tempResponse;
                console.log("Cancelled")
            });
        }

        function DeleteConfirmation($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => DeleteEmployee($item));
        }

        function DeleteEmployee($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgEmployeeAssignments.API.Delete.Url + $item.PK).then(response => {
                if (response.data.Response) {
                    let _index = OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.findIndex(value => value.PK === $item.PK);

                    if (_index != -1) {
                        OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.splice(_index, 1);
                    }
                }
            });
        }

        function PrepareGenerateScriptInput() {
            OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.map(value => {
                value.GenerateScriptInput = {
                    ObjectName: "OrgStaffAssignments",
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
