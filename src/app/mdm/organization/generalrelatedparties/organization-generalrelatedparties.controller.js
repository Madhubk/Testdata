(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgGenRelatedPartiesController", OrgGenRelatedPartiesController);

    OrgGenRelatedPartiesController.$inject = ["$rootScope", "$scope", "$location", "APP_CONSTANT", "authService", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr"];

    function OrgGenRelatedPartiesController($rootScope, $scope, $location, APP_CONSTANT, authService, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr) {
        var OrgGenRelatedPartiesCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrgGenRelatedPartiesCtrl.currentOrganization[OrgGenRelatedPartiesCtrl.currentOrganization.label].ePage.Entities;

            OrgGenRelatedPartiesCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_RelatedParties",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrgGenRelatedPartiesCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgGenRelatedPartiesCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            OrgGenRelatedPartiesCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;

            OrgGenRelatedPartiesCtrl.ePage.Masters.FreightDirectionListSource = [{
                Code: "PIC",
                Description: "Shipper"
            }, {
                Code: "DLV",
                Description: "Consignee"
            }];

            OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgRelatedParty = undefined;
            OrgGenRelatedPartiesCtrl.ePage.Masters.FreightDirection = OrgGenRelatedPartiesCtrl.ePage.Masters.FreightDirectionListSource[0].Code;

            GetCompanyListing();
                
        }

        // =====================Company Start=====================

        function GetCompanyListing() {
            OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgCompanyData = undefined;
            var _filter = {
                ORG_FK: OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgCompanyData.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgCompanyData.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgCompanyData = response.data.Response;

                    OnCompanySelect(OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgCompanyData[0], 0);

                    GetOrgRelatedPartiesList();
                }
            });
        }

        function OnCompanySelect($item, index) {
            OrgGenRelatedPartiesCtrl.ePage.Masters.SelectedCompany = $item;
        }

        // =====================Company End=====================

        // =====================Related Party Start=====================

        function GetOrgRelatedPartiesList() {
            OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgRelatedParty = undefined;
            var _filter = {
                "Parent_PK": OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                "SortColumn": "ORP_FreightDirection",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgRelatedPartiesMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgRelatedPartiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgGenRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgRelatedParty = response.data.Response;
                }
            });
        }

        // =====================Related Party End=====================

        function OpenEditForm($item, type) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "relatedparties-edit right " + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/generalrelatedparties/org-generalrelatedparties-modal/" + type + "-modal.html",
                controller: 'OrgGenRelatedPartyModalController as OrgGenRelatedPartyModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrgGenRelatedPartiesCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "SelectedCompany": OrgGenRelatedPartiesCtrl.ePage.Masters.SelectedCompany
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    var _obj = {
                        "OrgRelatedParty": OrgRelatedPartyResponse
                    };
                    _obj[response.type]();
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function OrgRelatedPartyResponse() {
            GetOrgRelatedPartiesList();
        }

        Init();
    }
})();
