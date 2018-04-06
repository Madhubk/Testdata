(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationCompanyController", OrganizationCompanyController);

    OrganizationCompanyController.$inject = ["$scope", "$location", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr"];

    function OrganizationCompanyController($scope, $location, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr) {
        /* jshint validthis: true */
        var OrganizationCompanyCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrganizationCompanyCtrl.currentOrganization[OrganizationCompanyCtrl.currentOrganization.label].ePage.Entities;

            OrganizationCompanyCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Company",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrganizationCompanyCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrganizationCompanyCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            OrganizationCompanyCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;

            GetCompanyListing();
        }

        // =====================Company Start=====================

        function GetCompanyListing() {
            OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData = undefined;
            var _filter = {
                ORG_FK: OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgCompanyData.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgCompanyData.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData = response.data.Response;
                    console.log(OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData)
                    OnCompanySelect(OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData[0], 0);
                }
            });
        }

        function GetSingleCompanyDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.OrgCompanyData.API.GetById.Url + OrganizationCompanyCtrl.ePage.Masters.SelectedCompany.PK).then(function (response) {
                if (response.data.Response) {
                    OrganizationCompanyCtrl.ePage.Entities.Header.Data.OrgCompanyData.map(function (value, key) {
                        if (value.PK === response.data.Response.PK) {
                            value = response.data.Response;
                            OrganizationCompanyCtrl.ePage.Masters.SelectedCompany = response.data.Response;
                        }
                    });
                }
            });
        }

        function OnCompanySelect($item, index) {
            OrganizationCompanyCtrl.ePage.Masters.SelectedCompany = $item;

        }

        // =====================Company End=====================

        function OpenEditForm($item, type) {    
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "company-edit right " + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/company/org-company-modal/" + type + "-modal.html",
                controller: 'OrgCompanyModalController as OrgCompanyModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrganizationCompanyCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "SelectedCompany": OrganizationCompanyCtrl.ePage.Masters.SelectedCompany
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    var _obj = {
                        "OrgCompanyData": OrgCompanyDataResponse,
                    };
                    _obj[response.entity](response);
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function OrgCompanyDataResponse(response) {
            if (response.type === "OrgARDetails" || response.type === "OrgAPDetails") {
                GetSingleCompanyDetails();
            } else {
                GetCompanyListing();
            }
        }

        Init();
    }
})();
