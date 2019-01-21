(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationWarehouse", OrganizationWarehouse);

    function OrganizationWarehouse() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/warehouse/warehouse.html",
            controller: "OrgWarehouseController",
            controllerAs: "OrgWarehouseCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrgWarehouseController", OrgWarehouseController);

    OrgWarehouseController.$inject = ["$scope", "$uibModal", "apiService", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrgWarehouseController($scope, $uibModal, apiService, organizationConfig, helperService, toastr, confirmation) {
        var OrgWarehouseCtrl = this;

        function Init() {
            var currentOrganization = OrgWarehouseCtrl.currentOrganization[OrgWarehouseCtrl.currentOrganization.code].ePage.Entities;

            OrgWarehouseCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Company",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgWarehouseCtrl.ePage.Masters.EditableMode = EditableMode;
            GetInventoryDetails()
        }

        function GetInventoryDetails() {
            if (!OrgWarehouseCtrl.currentOrganization.isNew) {
                OrgWarehouseCtrl.ePage.Masters.Loading = true;
                var _filter = {
                    "ORG_FK": OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                    "PageNumber": "1",
                    "PageSize": "10",
                    "SortType": "ASC",
                    "SortColumn": "WOL_CreatedDateTime",
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": organizationConfig.Entities.API.WmsInventory.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", organizationConfig.Entities.API.WmsInventory.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                    OrgWarehouseCtrl.ePage.Masters.Loading = false;
                    if (response.data.Response.length > 0) {
                        OrgWarehouseCtrl.ePage.Masters.CanEditWarehouseModule = true;
                    }
                });
            }
        }

        function EditableMode(type) {
            if (!OrgWarehouseCtrl.ePage.Masters.CanEditWarehouseModule) {
                $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "org-edit-modal-warehouse right",
                    scope: $scope,
                    templateUrl: 'app/mdm/organization/warehouse/editable-pages/' + type + '.html',
                    controller: 'EditableController as EditableCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "Entity": OrgWarehouseCtrl.currentOrganization,
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    if (response) {
                        OrgWarehouseCtrl.currentOrganization[OrgWarehouseCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data;
                        OrgWarehouseCtrl.ePage.Entities.Header.Data = response.data;
                    }
                });
            } else {
                toastr.warning("Product of this organization is Available in Warehouse. So you can not edit.")
            }
        }

        Init();
    }
})();
