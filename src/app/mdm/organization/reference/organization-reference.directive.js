(function () {
    "use strict";

    // OrgRefDate
    angular
        .module("Application")
        .directive("organizationReference", OrganizationReference);

    function OrganizationReference() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/reference/organization-reference.html",
            controller: "OrganizationReferenceController",
            controllerAs: "OrganizationReferenceCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationReferenceController", OrganizationReferenceController);

    OrganizationReferenceController.$inject = ["$scope", "$uibModal", "helperService", "APP_CONSTANT", "organizationConfig", "confirmation", "apiService", "toastr"];

    function OrganizationReferenceController($scope, $uibModal, helperService, APP_CONSTANT, organizationConfig, confirmation, apiService, toastr) {
        /* jshint validthis: true */
        let OrganizationReferenceCtrl = this;

        function Init() {
            var currentOrganization = OrganizationReferenceCtrl.currentOrganization[OrganizationReferenceCtrl.currentOrganization.code].ePage.Entities;

            OrganizationReferenceCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Reference",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                InitOrgReference();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitOrgReference() {
            OrganizationReferenceCtrl.ePage.Masters.OrgReference = {};
            OrganizationReferenceCtrl.ePage.Masters.OrgReference.DateFormat = APP_CONSTANT.DatePicker.dateFormat;

            OrganizationReferenceCtrl.ePage.Masters.OrgReference.AddReference = AddReference;
            OrganizationReferenceCtrl.ePage.Masters.OrgReference.EditReference = EditReference;
            OrganizationReferenceCtrl.ePage.Masters.OrgReference.DeleteReference = DeleteConfirmation;
        }

        function AddReference() {
            EditReference();
        }

        function EditReference($item) {
            let _tempResponse = angular.copy(OrganizationReferenceCtrl.currentOrganization[OrganizationReferenceCtrl.currentOrganization.code].ePage.Entities.Header.Data);

            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-edit-modal-reference right",
                scope: $scope,
                templateUrl: "app/mdm/organization/reference/org-reference-modal/org-reference-modal.html",
                controller: 'OrgReferenceModalController as OrgReferenceModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        let exports = {
                            "Entity": OrganizationReferenceCtrl.currentOrganization,
                            "Item": $item,
                        };
                        return exports;
                    }
                }
            }).result.then(response => {
                if (response.data) {
                    OrganizationReferenceCtrl.currentOrganization[OrganizationReferenceCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data;

                    OrganizationReferenceCtrl.ePage.Entities.Header.Data = response.data;
                }
            }, () => {
                OrganizationReferenceCtrl.currentOrganization[OrganizationReferenceCtrl.currentOrganization.code].ePage.Entities.Header.Data = _tempResponse;
            });
        }

        function DeleteConfirmation($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => DeleteReference($item), () => console.log("Cancelled"));
        }

        function DeleteReference($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgRefDate.API.Delete.Url + $item.PK).then(response => {
                if (response.data.Response === "Success") {
                    OrganizationReferenceCtrl.ePage.Entities.Header.Data.OrgRefDate.map((value, key) => {
                        if (value.PK === $item.PK) {
                            OrganizationReferenceCtrl.ePage.Entities.Header.Data.OrgRefDate.splice(key, 1);
                        }
                    });
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        Init();
    }
})();
