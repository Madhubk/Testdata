(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OrganizationGeneralController", OrganizationGeneralController);

    OrganizationGeneralController.$inject = ["$scope", "$uibModal", "apiService", "appConfig", "helperService"];

    function OrganizationGeneralController($scope, $uibModal, apiService, appConfig, helperService) {
        var OrganizationGeneralCtrl = this;

        function Init() {
            var currentOrganization = OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.label].ePage.Entities;

            OrganizationGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrganizationGeneralCtrl.ePage.Masters.OrgHeader = {};
            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.EmptyText = "-";

            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.DataList = [{
                "DispName": "Active",
                "Value": "IsActive"
            }, {
                "DispName": "Shipper",
                "Value": "IsConsignor"
            }, {
                "DispName": "Consignee",
                "Value": "IsConsignee"
            }, {
                "DispName": "Transport Client",
                "Value": "IsTransportClient"
            }, {
                "DispName": "Warehouse Client",
                "Value": "IsWarehouseClient"
            }, {
                "DispName": "Warehouse",
                "Value": "IsWarehouse"
            }, {
                "DispName": "Carrier",
                "Value": "IsForwarder"
            }, {
                "DispName": "Broker",
                "Value": "IsBroker"
            }, {
                "DispName": "Services",
                "Value": "IsService"
            }, {
                "DispName": "Distribution Center",
                "Value": "IsDistributionCentre"
            }, {
                "DispName": "Depot",
                "Value": "IsRoadFreightDepot"
            }, {
                "DispName": "Store",
                "Value": "IsStore"
            }];

            OrganizationGeneralCtrl.ePage.Masters.OpenEditForm = OpenEditForm;

            SetMainAddress();

            if (OrganizationGeneralCtrl.currentOrganization.isNew == true) {
                OpenEditForm(OrganizationGeneralCtrl.ePage.Entities.Header.Data, 'general', true)
            }
        }

        function OpenEditForm($item, type, isNewMode) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right " + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/general/organization-general-modal/" + type + "-modal.html",
                controller: 'OrgGeneralModalController as OrgGeneralModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrganizationGeneralCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "isNewMode": isNewMode
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    var _obj = {
                        "OrgHeader": OrgHeaderResponse
                    };
                    _obj[response.type]();
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function OrgHeaderResponse() {
            apiService.get("eAxisAPI", appConfig.Entities.Organization.API.GetById.Url + OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgHeader.PK).then(function (response) {
                if (response.data.Response) {
                    OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgHeader = response.data.Response.OrgHeader;
                    OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgAddress = response.data.Response.OrgAddress;
                    OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgMiscServ = response.data.Response.OrgMiscServ;

                    SetMainAddress()
                }
            });
        }

        function SetMainAddress() {
            if (OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgAddress.length > 0) {
                OrganizationGeneralCtrl.ePage.Entities.Header.Data.OrgAddress.map(function (value, key) {
                    if (!value.AddressCapability) {
                        value.AddressCapability = [];
                    }

                    if (value.AddressCapability.length > 0) {
                        value.AddressCapability.map(function (val, index) {
                            if (val.AddressType === "OFC") {
                                if (val.IsMainAddress) {
                                    OrganizationGeneralCtrl.ePage.Masters.MainAddress = value;
                                }
                            }
                        });
                    }
                });
            }
        }

        Init();
    }
})();
