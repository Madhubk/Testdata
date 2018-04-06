(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OrganizationContactController", OrganizationContactController);

    OrganizationContactController.$inject = ["$rootScope", "$scope", "$location", "APP_CONSTANT", "authService", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrganizationContactController($rootScope, $scope, $location, APP_CONSTANT, authService, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr, confirmation) {
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

            OrganizationContactCtrl.ePage.Masters.OrgContact = {};
            OrganizationContactCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrganizationContactCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            OrganizationContactCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
            OrganizationContactCtrl.ePage.Masters.DeleteContact = DeleteContact;
            
        }

        function OpenEditForm($item, type, isNewMode) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "contact-edit right " + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/contact/organization-contact-modal/" + type + "-modal.html",
                controller: 'OrgContactModalController as OrgContactModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        console.log(OrganizationContactCtrl.currentOrganization)
                        var exports = {
                            "Entity": OrganizationContactCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "isNewMode": isNewMode
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    console.log(response);
                    var _obj = {
                        "OrgContact": OrgContactResponse
                    };
                    _obj[response.type]();
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function OrgContactResponse() {
            OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact = undefined;
            var _filter = {
                ORG_FK: OrganizationContactCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact = response.data.Response;
                } else {
                    OrganizationContactCtrl.ePage.Entities.Header.Data.OrgContact = [];
                }
            });
        }

        function DeleteConfirmation($item, type) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContact($item, type);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteContact($item, type) {
            OrganizationContactCtrl.ePage.Masters[type].IsOverlay = true;
            apiService.get("eAxisAPI", appConfig.Entities[type].API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.Status === "Success") {
                        OrganizationContactCtrl.ePage.Entities.Header.Data[type].map(function (value, key) {
                            if (value.PK === $item.PK) {
                                OrganizationContactCtrl.ePage.Entities.Header.Data[type].splice(key, 1);
                            }
                        });
                        toastr.success("Record Deleted Successfully...!");
                    } else {
                        toastr.error("Could not Delete...!");
                    }

                    OrganizationContactCtrl.ePage.Masters[type].IsOverlay = false;
                }
            });
        }

        Init();
    }
})();
