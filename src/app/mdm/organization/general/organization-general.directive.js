(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationGeneral", OrganizationGeneral);

    function OrganizationGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/general/organization-general.html",
            controller: "OrganizationGeneralController",
            controllerAs: "OrganizationGeneralCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationGeneralController", OrganizationGeneralController);

    OrganizationGeneralController.$inject = ["$rootScope", "$scope", "$uibModal", "helperService"];

    function OrganizationGeneralController($rootScope, $scope, $uibModal, helperService) {
        var OrganizationGeneralCtrl = this;

        $rootScope.UpdateGeneralPage = UpdateMainAddress;

        function Init() {
            var currentOrganization = OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.label].ePage.Entities;

            OrganizationGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                InitOrgHeader();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitOrgHeader() {
            OrganizationGeneralCtrl.ePage.Masters.OrgHeader = {};
            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.EmptyText = "-";

            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.EditOrganization = EditOrganization;

            GetDataList();
            GetMainAddress();

            if (OrganizationGeneralCtrl.currentOrganization.isNew == true) {
                EditOrganization()
            }
        }

        function GetDataList() {
            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.DataList = [{
                "DispName": "Consignor",
                "Value": "IsConsignor"
            }, {
                "DispName": "Consignee",
                "Value": "IsConsignee"
            }, {
                "DispName": "Forwarder",
                "Value": "IsForwarder"
            }, {
                "DispName": "Transport Client",
                "Value": "IsTransportClient"
            }, {
                "DispName": "Warehouse Client",
                "Value": "IsWarehouseClient"
            }, {
                "DispName": "Broker",
                "Value": "IsBroker"
            }, {
                "DispName": "Road Freight Depot",
                "Value": "IsRoadFreightDepot"
            }, {
                "DispName": "Store",
                "Value": "IsStore"
            }];
        }

        function GetMainAddress() {
            if (OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgAddress && OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgAddress.length > 0) {
                OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgAddress.map(function (value, key) {
                    if (value.IsMainAddress == true) {
                        OrganizationGeneralCtrl.ePage.Masters.OrgHeader.MainAddress = value;
                    }
                });
            }
        }

        function EditOrganization() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-edit-modal right general",
                scope: $scope,
                templateUrl: "app/mdm/organization/general/organization-general-modal/general-modal.html",
                controller: 'OrgGeneralModalController as OrgGeneralModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrganizationGeneralCtrl.currentOrganization,
                            "Item": OrganizationGeneralCtrl.ePage.Entities.Header.Data
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.data) {
                        var _header = angular.copy(OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.label].ePage.Entities.Header);

                        OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.label].ePage.Entities.Header.Data = response.data;

                        OrganizationGeneralCtrl.currentOrganization.isNew = false;
                        OrganizationGeneralCtrl.currentOrganization.code = response.data.OrgHeader.Code;
                        OrganizationGeneralCtrl.currentOrganization.label = response.data.OrgHeader.Code;

                        _header.Data = response.data;
                        OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.label] = {
                            ePage: {
                                Entities: {
                                    Header: _header
                                }
                            }
                        };

                        OrganizationGeneralCtrl.ePage.Entities.Header.Data = _header.Data;

                        delete OrganizationGeneralCtrl.currentOrganization.New;

                        GetMainAddress();
                    }
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function UpdateMainAddress() {
            GetMainAddress();
        }

        Init();
    }
})();
