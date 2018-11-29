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

    OrganizationContactController.$inject = ["$scope", "$uibModal", "apiService", "appConfig", "helperService", "toastr", "confirmation"];

    function OrganizationContactController($scope, $uibModal, apiService, appConfig, helperService, toastr, confirmation) {
        var OrganizationContactCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.label].ePage.Entities;

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
        }

        function EditContact($item) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "contact-edit-modal right contact",
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
                    OrganizationContactCtrl.currentOrganization[OrganizationContactCtrl.currentOrganization.label].ePage.Entities.Header.Data = response.data;
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
            OrganizationContactCtrl.ePage.Masters.OrgContact.IsOverlay = true;
            apiService.get("eAxisAPI", appConfig.Entities.OrgContact.API.Delete.Url + $item.PK).then(function (response) {
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

                    OrganizationContactCtrl.ePage.Masters.OrgContact.IsOverlay = false;
                }
            });
        }

        Init();
    }
})();
