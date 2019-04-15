(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationContact", OrganizationContact);

    function OrganizationContact() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/contact/organization-contact.html",
            controller: "OrganizationContactController",
            controllerAs: "OrganizationContactCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationContactController", OrganizationContactController);

    OrganizationContactController.$inject = ["$scope", "$uibModal", "apiService", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrganizationContactController($scope, $uibModal, apiService, organizationConfig, helperService, toastr, confirmation) {
        let OrganizationContactCtrl = this;

        function Init() {
            let currentOrganization = OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities;

            OrganizationContactCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Contact",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrganizationContactCtrl.ePage.Masters.EmptyText = "-";

            OrganizationContactCtrl.ePage.Masters.OrgContact = {};
            OrganizationContactCtrl.ePage.Masters.EditContact = EditContact;
            OrganizationContactCtrl.ePage.Masters.DeleteContact = DeleteConfirmation;

            try {
                PrepareGenerateScriptInput();
            } catch (ex) {
                console.log(ex);
            }
        }

        function EditContact($item) {
            let _tempResponse = angular.copy(OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities.Header.Data);

            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-edit-modal right contact",
                scope: $scope,
                templateUrl: "app/mdm/organization/contact/organization-contact-modal/contact-modal.html",
                controller: 'OrgContactModalController as OrgContactModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        let exports = {
                            "Entity": OrganizationContactCtrl.currentOrganization,
                            "Item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(response => {
                OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data;

                OrganizationContactCtrl.ePage.Entities.Header.Data = response.data;

                PrepareGenerateScriptInput();
            }, () => {
                OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities.Header.Data = _tempResponse;
                console.log("Cancelled");
            });
        }

        function DeleteConfirmation($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => DeleteContact($item), () => console.log("Cancelled"));
        }

        function DeleteContact($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgContact.API.Delete.Url + $item.PK).then(response => {
                if (response.data.Response && response.data.Response.Status === "Success") {
                    OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact.map((value, key) => {
                        if (value.PK === $item.PK) {
                            OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact.splice(key, 1);
                        }
                    });
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        function PrepareGenerateScriptInput() {
            OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact.map(value => {
                value.GenerateScriptInput = {
                    ObjectName: "OrgContact",
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
