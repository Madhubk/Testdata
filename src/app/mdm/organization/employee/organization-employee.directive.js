(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationEmployee", OrganizationEmployee);

    function OrganizationEmployee() {
        var exports = {
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

    OrganizationEmployeeController.$inject = ["$scope", "$uibModal", "apiService", "organizationConfig", "helperService", "mdmConfig", "confirmation"];

    function OrganizationEmployeeController($scope, $uibModal, apiService, organizationConfig, helperService, mdmConfig, confirmation) {
        /* jshint validthis: true */
        var OrganizationEmployeeCtrl = this;

        function Init() {
            var currentOrganization = OrganizationEmployeeCtrl.currentOrganization[OrganizationEmployeeCtrl.currentOrganization.label].ePage.Entities;

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
            var modalInstance = $uibModal.open({
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
                        var exports = {
                            "Entity": OrganizationEmployeeCtrl.currentOrganization,
                            "Item": $item,
                            "ActiveCompany": OrganizationEmployeeCtrl.ePage.Masters.ActiveCompany
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.data) {
                        OrganizationEmployeeCtrl.ePage.Entities.Header.Data = response.data;

                        OrganizationEmployeeCtrl.currentOrganization[OrganizationEmployeeCtrl.currentOrganization.label].ePage.Entities.Header.Data = OrganizationEmployeeCtrl.ePage.Entities.Header.Data;
                    }
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(function (result) {
                DeleteEmployee($item);
            }, function () {
                console.log("Cancelled");
            });
        }

        function DeleteEmployee($item) {
            apiService.get("eAxisAPI", mdmConfig.Entities.OrgEmployeeAssignments.API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Response) {
                    var _index = OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.map(function (value, key) {
                        return value.PK;
                    }).indexOf($item.PK);

                    if (_index != -1) {
                        OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.splice(_index, 1);
                    }
                }
            });
        }

        Init();
    }
})();
