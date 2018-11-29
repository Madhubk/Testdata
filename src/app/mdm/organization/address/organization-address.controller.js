(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationAddress", OrganizationAddress);

    OrganizationAddress.$inject = [];

    function OrganizationAddress() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/address/organization-address.html",
            controller: "OrganizationAddressController",
            controllerAs: "OrganizationAddressCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationAddressController", OrganizationAddressController);

    OrganizationAddressController.$inject = ["$scope", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrganizationAddressController($scope, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr, confirmation) {
        var OrganizationAddressCtrl = this;

        function Init() {
            var currentOrganization = OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.label].ePage.Entities;

            OrganizationAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrganizationAddressCtrl.ePage.Masters.EmptyText = "-";

            OrganizationAddressCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrganizationAddressCtrl.ePage.Masters.OrgAddress = {};
            OrganizationAddressCtrl.ePage.Masters.EditAddress = EditAddress;
            OrganizationAddressCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;

            GetAddressCapablilityList();
            // SetMainAddress();
        }

        function GetAddressCapablilityList() {
            OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.AddressCapability = helperService.metaBase();

            OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.ADDRTYPE.ListSource.map(function (value, key) {
                OrganizationAddressCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.push({
                    AddressType: value.Key,
                    AddressTypeDes: value.Value,
                    IsMainAddress: false,
                    IsMapped: false,
                    IsModified: false,
                    IsValid: false
                });
            });
        }

        function SetMainAddress() {
            if (OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.length > 0) {
                OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.map(function (value, key) {
                    if (value.AddressCapability.length > 0) {
                        value.AddressCapability.map(function (val, index) {
                            if (val.AddressType === "OFC" && val.IsMainAddress) {
                                value.IsMainAddress = true;
                                MoveArrayPosition(OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress, key, 0);
                            }
                        });
                    }
                });
            }
        }

        function MoveArrayPosition(arr, from, to) {
            arr.splice(to, 0, arr.splice(from, 1)[0]);
            return arr;
        }

        function DeleteConfirmation($item) {
            var _mainExist = $item.AddressCapability.some(function (value, key) {
                return (value.AddressType === "OFC" && value.IsMainAddress == true);
            });

            if (!_mainExist) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Delete?',
                    bodyText: 'Are you sure?'
                };

                confirmation.showModal({}, modalOptions).then(function (result) {
                    DeleteAddress($item);
                }, function () {
                    console.log("Cancelled");
                });
            } else {
                toastr.warning("Not allowed to Delete Main Address. You can Swap MainAddress to Other and proceed with Delete...!");
            }
        }

        function DeleteAddress($item) {
            OrganizationAddressCtrl.ePage.Masters.OrgAddress.IsOverlay = true;
            apiService.get("eAxisAPI", appConfig.Entities.OrgAddress.API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.Status === "Success") {
                        var _index = OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.map(function (value, key) {
                            return value.PK;
                        }).indexOf($item.PK);

                        OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.splice(_index, 1);
                    } else {
                        toastr.error("Could not Delete...!");
                    }

                    OrganizationAddressCtrl.ePage.Masters.OrgAddress.IsOverlay = false;
                }
            });
        }

        function EditAddress($item) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "address-edit-modal right address",
                scope: $scope,
                templateUrl: "app/mdm/organization/address/organization-address-modal/address-modal.html",
                controller: 'OrgAddressModalController as OrgAddressModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrganizationAddressCtrl.currentOrganization,
                            "Item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.data) {
                        OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.label].ePage.Entities.Header.Data = response.data;

                        // SetMainAddress();
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
