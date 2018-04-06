(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationReferenceController", OrganizationReferenceController);

    OrganizationReferenceController.$inject = ["$scope", "$location", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr"];

    function OrganizationReferenceController($scope, $location, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr) {
        /* jshint validthis: true */
        var OrganizationReferenceCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrganizationReferenceCtrl.currentOrganization[OrganizationReferenceCtrl.currentOrganization.label].ePage.Entities;

            OrganizationReferenceCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Company",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrganizationReferenceCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrganizationReferenceCtrl.ePage.Masters.OpenEditForm = OpenEditForm;

        }

        function OpenEditForm($item,type) {    
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "reference-edit right " + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/reference/org-reference-modal/" + type + "-modal.html",
                controller: 'OrgReferenceModalController as OrgReferenceModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrganizationReferenceCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
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
            // do nothing
        }

        Init();
    }
})();
