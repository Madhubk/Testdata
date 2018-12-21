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

    OrganizationAddressController.$inject = ["$scope", "$uibModal", "apiService", "mdmConfig", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrganizationAddressController($scope, $uibModal, apiService, mdmConfig, organizationConfig, helperService, toastr, confirmation) {
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

            try {
                OrganizationAddressCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

                OrganizationAddressCtrl.ePage.Masters.OrgAddress = {};
                OrganizationAddressCtrl.ePage.Masters.EditAddress = EditAddress;
                OrganizationAddressCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
                OrganizationAddressCtrl.ePage.Masters.SetAsDefaultAddress = SetAsDefaultAddress;

                GetAddressCapablilityList();
            } catch (ex) {
                console.log(ex);
            }
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
            apiService.get("eAxisAPI", mdmConfig.Entities.OrgAddress.API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.Status === "Success") {
                        var _index = OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.map(function (value, key) {
                            return value.PK;
                        }).indexOf($item.PK);

                        OrganizationAddressCtrl.ePage.Entities.Header.Data.OrgAddress.splice(_index, 1);
                    } else {
                        toastr.error("Could not Delete...!");
                    }
                }
            });
        }

        function EditAddress($item) {
            var modalInstance = $uibModal.open({
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

                        OrganizationAddressCtrl.ePage.Entities.Header.Data = response.data;
                    }
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function SetAsDefaultAddress($item) {
            var _input = angular.copy(OrganizationAddressCtrl.ePage.Entities.Header.Data);
            var _address = angular.copy($item);
            _address.IsModified = true;

            var _ofcAddressCapablity = {
                AddressType: "OFC",
                AddressTypeDes: "Office Address",
                IsMainAddress: true,
                IsMapped: true,
                IsModified: true,
                OAD_FK: _address.PK,
                ORG_FK: _input.OrgHeader.PK
            };

            if (!_address.AddressCapability) {
                _address.AddressCapability = [];
                _address.AddressCapability.push(_ofcAddressCapablity);
            } else {
                if (_address.AddressCapability.length == 0) {
                    _address.AddressCapability.push(_ofcAddressCapablity);
                } else {
                    var _index = _address.AddressCapability.map(function (value, key) {
                        return value.AddressType;
                    }).indexOf("OFC");

                    if (_index != -1) {
                        _address.AddressCapability[_index].IsMainAddress = true;
                        _address.AddressCapability[_index].IsMapped = true;
                        _address.AddressCapability[_index].IsModified = true;
                    } else {
                        _address.AddressCapability.push(_ofcAddressCapablity);
                    }
                }
            }

            var _index = _input.OrgAddress.map(function (value, key) {
                return value.PK;
            }).indexOf(_address.PK);

            if (_index != -1) {
                var _index = _input.OrgAddress[_index] = _address;
            }

            OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.label].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrganizationAddressCtrl.currentOrganization, 'Organization').then(function (response) {
                if (response.Status == "success") {
                    if (response.Data) {
                        OrganizationAddressCtrl.currentOrganization[OrganizationAddressCtrl.currentOrganization.label].ePage.Entities.Header.Data = response.Data;

                        OrganizationAddressCtrl.ePage.Entities.Header.Data = response.Data;
                    }
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    if (response.Validations && response.Validations.length > 0) {
                        response.Validations.map(function (value, key) {
                            toastr.error(value.Message);
                        });
                    } else {
                        toastr.warning("Failed to Save...!");
                    }
                }
            });
        }

        Init();
    }
})();
