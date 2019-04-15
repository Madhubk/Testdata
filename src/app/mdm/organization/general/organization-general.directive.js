(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationGeneral", OrganizationGeneral);

    function OrganizationGeneral() {
        let exports = {
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

    OrganizationGeneralController.$inject = ["$scope", "$uibModal", "helperService"];

    function OrganizationGeneralController($scope, $uibModal, helperService) {
        let OrganizationGeneralCtrl = this;

        function Init() {
            let currentOrganization = OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.code].ePage.Entities;

            OrganizationGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                InitOrgHeader();

                OrganizationGeneralCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "OrgHeader",
                    ObjectId: currentOrganization.Header.Data.OrgHeader.PK
                };
                OrganizationGeneralCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitOrgHeader() {
            OrganizationGeneralCtrl.ePage.Masters.OrgHeader = {};
            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.EmptyText = "-";

            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.EditOrganization = EditOrganization;

            OrganizationGeneralCtrl.ePage.Masters.OrgHeader.DataList = OrganizationGeneralCtrl.ePage.Entities.Header.DataList;

            if (OrganizationGeneralCtrl.currentOrganization.isNew == true) {
                EditOrganization()
            }
        }

        function EditOrganization() {
            let _tempResponse = angular.copy(OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.code].ePage.Entities.Header.Data);

            $uibModal.open({
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
                        let exports = {
                            "Entity": OrganizationGeneralCtrl.currentOrganization,
                            "Item": OrganizationGeneralCtrl.ePage.Entities.Header.Data
                        };
                        return exports;
                    }
                }
            }).result.then(response => {
                if (response.data) {
                    let _header = OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.code].ePage.Entities.Header;
                    _header.Data = response.data;

                    OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.code].ePage.Entities.Header.Data = response.data;

                    OrganizationGeneralCtrl.currentOrganization.isNew = false;
                    OrganizationGeneralCtrl.currentOrganization.label = response.data.OrgHeader.Code;

                    OrganizationGeneralCtrl.ePage.Entities.Header.Data = _header.Data;
                }
            }, () => {
                OrganizationGeneralCtrl.currentOrganization[OrganizationGeneralCtrl.currentOrganization.code].ePage.Entities.Header.Data = _tempResponse;
                console.log("Cancelled");
            });
        }

        Init();
    }
})();
