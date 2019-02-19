(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationContact", OrganizationContact);

    OrganizationContact.$inject = [];

    function OrganizationContact() {
        var exports = {
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
        var OrganizationContactCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities;

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
                GetContactList();
                PrepareGenerateScriptInput();
            } catch (ex) {
                console.log(ex);
            }
        }

        function GetContactList() {
            if (OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities.Header.Data.OrgContact && OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities.Header.Data.OrgContact.length > 0) {
                OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact = OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities.Header.Data.OrgContact;
            } else {
                OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact = [];
            }
        }

        function EditContact($item) {
            var modalInstance = $uibModal.open({
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
                        var exports = {
                            "Entity": OrganizationContactCtrl.currentOrganization,
                            "Item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data;

                    OrganizationContactCtrl.ePage.Entities.Header.Data = response.data;

                    GetContactList();

                    PrepareGenerateScriptInput();
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(function (result) {
                DeleteContact($item);
            }, function () {
                console.log("Cancelled");
            });
        }

        function DeleteContact($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgContact.API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.Status === "Success") {
                        OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact.map(function (value, key) {
                            if (value.PK === $item.PK) {
                                OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact.splice(key, 1);
                            }
                        });
                    } else {
                        toastr.error("Could not Delete...!");
                    }
                }
            });
        }

        function PrepareGenerateScriptInput() {
            OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact.map(function (value, key) {
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
