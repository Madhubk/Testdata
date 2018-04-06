(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationEmployeeController", OrganizationEmployeeController);

    OrganizationEmployeeController.$inject = ["$scope", "$location", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr"];

    function OrganizationEmployeeController($scope, $location, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr) {
        /* jshint validthis: true */
        var OrganizationEmployeeCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrganizationEmployeeCtrl.currentOrganization[OrganizationEmployeeCtrl.currentOrganization.label].ePage.Entities;

            OrganizationEmployeeCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Employee",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrganizationEmployeeCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrganizationEmployeeCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            OrganizationEmployeeCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;
            //OrganizationEmployeeCtrl.ePage.Masters.SelectedCompany(OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgCompanyData[0],0); 
            GetCompanyListing();
        }

        // =====================Employee Start=====================

        function GetCompanyListing() {
            OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgCompanyData = undefined;
            var _filter = {
                ORG_FK: OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgCompanyData.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgCompanyData.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgCompanyData = response.data.Response;

                    OnCompanySelect(OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgCompanyData[0], 0);
                }
            });
        }

        function OnCompanySelect($item, index) {
            OrganizationEmployeeCtrl.ePage.Masters.SelectedCompany = $item;
            if(OrganizationEmployeeCtrl.ePage.Masters.SelectedCompany){
                GetEmployeeListing($item,index);
            }            
        }

        // =====================Employee End=====================

        // =====================Employee Start=====================

        function GetEmployeeListing(item,index) {
            OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments = undefined;
            var _filter = {
                "OrgPK": OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                "CompanyPK": OrganizationEmployeeCtrl.ePage.Masters.SelectedCompany.CMP_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgEmployeeAssignments.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgEmployeeAssignments.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments = response.data.Response;
                    console.log(OrganizationEmployeeCtrl.ePage.Entities.Header.Data.OrgStaffAssignments);
                }
            });
            //OnCompanySelect(item,0);
        }

        // =====================Employee End=====================

        function OpenEditForm($item, type) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "org-employee-edit right " + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/employee/org-employee-modal/" + type + "-modal.html",
                controller: 'OrgEmployeeModalController as OrgEmployeeModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrganizationEmployeeCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "SelectedCompany": OrganizationEmployeeCtrl.ePage.Masters.SelectedCompany
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    var _obj = {
                        "OrgStaffAssignments": OrgStaffAssignmentsResponse
                    };
                    _obj[response.entity](response);
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function OrgStaffAssignmentsResponse() {
            GetEmployeeListing();
            
        }

        Init();
    }
})();
