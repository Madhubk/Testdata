(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationAddress", OrganizationAddress);

    OrganizationAddress.$inject = [];

    function OrganizationAddress() {
        let exports = {
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

    OrganizationAddressController.$inject = ["$scope", "$uibModal", "apiService", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrganizationAddressController($scope, $uibModal, apiService, organizationConfig, helperService, toastr, confirmation) {
        let OrganizationAddressCtrl = this;

        function Init() {
            let currentOrganization = OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.code].ePage.Entities;

            OrganizationAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrganizationAddressCtrl.ePage.Masters.EmptyText = "-";

            try {
                OrganizationAddressCtrl.ePage.Masters.OrgAddress = {};
                OrganizationAddressCtrl.ePage.Masters.EditAddress = Edit;
                OrganizationAddressCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
                OrganizationAddressCtrl.ePage.Masters.SetAsDefaultAddress = SetAsDefaultAddress;

                PrepareGenerateScriptInput();
            } catch (ex) {
                console.log(ex);
            }
        }

        function DeleteConfirmation($item) {
            let _mainExist = $item.AddressCapability.some(value => (value.AddressType === "OFC" && value.IsMainAddress == true));

            if (!_mainExist) {
                let modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Delete?',
                    bodyText: 'Are you sure?'
                };

                confirmation.showModal({}, modalOptions).then(() => Delete($item));
            } else {
                toastr.warning("Not allowed to Delete Main Address. You can Swap MainAddress to Other and proceed with Delete...!");
            }
        }

        function Delete($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgAddress.API.Delete.Url + $item.PK).then(response => {
                if (response.data.Response && response.data.Response.Status === "Success") {
                    let _index = OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.findIndex(x => x.PK === $item.PK);
                    OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.splice(_index, 1);
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        function Edit($item) {
            let _tempResponse = angular.copy(OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.code].ePage.Entities.Header.Data);

            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-edit-modal right address",
                scope: $scope,
                templateUrl: "app/mdm/organization/address/organization-address-modal/address-modal.html",
                controller: 'OrgAddressModalController as OrgAddressModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        let exports = {
                            "Entity": OrganizationAddressCtrl.currentOrganization,
                            "Item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(response => {
                if (response.data) {
                    OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data;

                    OrganizationAddressCtrl.ePage.Entities.Header.Data = response.data;
                    PrepareGenerateScriptInput();
                }
            }, () => {
                OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.code].ePage.Entities.Header.Data = _tempResponse;
            });
        }

        function SetAsDefaultAddress($item) {
            let _input = angular.copy(OrganizationAddressCtrl.ePage.Entities.Header.Data);
            let _address = angular.copy($item);
            _address.IsModified = true;

            let _ofcAddressCapablity = {
                AddressType: "OFC",
                AddressTypeDes: "Office Address",
                OAD_FK: _address.PK,
                ORG_FK: _input.OrgHeader.PK,
                IsMainAddress: true,
                IsMapped: true,
                IsModified: true
            };

            if (!_address.AddressCapability || _address.AddressCapability.length == 0) {
                _address.AddressCapability = [_ofcAddressCapablity];
            } else {
                let _index = _address.AddressCapability.findIndex(x => x.AddressType === "OFC");

                if (_index != -1) {
                    _address.AddressCapability[_index].IsMainAddress = true;
                    _address.AddressCapability[_index].IsMapped = true;
                    _address.AddressCapability[_index].IsModified = true;
                } else {
                    _address.AddressCapability.push(_ofcAddressCapablity);
                }
            }

            let _index = _input.OrgAddress.findIndex(x => x.PK === _address.PK);

            if (_index != -1) {
                _input.OrgAddress[_index] = _address;
            }

            OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrganizationAddressCtrl.currentOrganization, 'Organization').then(response => {
                if (response.Status == "success" && response.Data) {
                    OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.Data;

                    OrganizationAddressCtrl.ePage.Entities.Header.Data = response.Data;
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    (response.Validations && response.Validations.length > 0) ? response.Validations.map(value => toastr.error(value.Message)): toastr.warning("Failed to Save...!");
                }
            });
        }

        function PrepareGenerateScriptInput() {
            OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.map(value => {
                value.GenerateScriptInput = {
                    ObjectName: "OrgAddress",
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
