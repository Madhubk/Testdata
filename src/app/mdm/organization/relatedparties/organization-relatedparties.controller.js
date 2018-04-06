(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgRelatedPartiesController", OrgRelatedPartiesController);

    OrgRelatedPartiesController.$inject = ["$rootScope", "$scope", "$location", "APP_CONSTANT", "authService", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr"];

    function OrgRelatedPartiesController($rootScope, $scope, $location, APP_CONSTANT, authService, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr) {
        var OrgRelatedPartiesCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrgRelatedPartiesCtrl.currentOrganization[OrgRelatedPartiesCtrl.currentOrganization.label].ePage.Entities;

            OrgRelatedPartiesCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_RelatedParties",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrgRelatedPartiesCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgRelatedPartiesCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            OrgRelatedPartiesCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;

            OrgRelatedPartiesCtrl.ePage.Masters.FreightDirectionListSource = [{
                Code: "PIC",
                Description: "Shipper"
            }, {
                Code: "DLV",
                Description: "Consignee"
            }];

            OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgRelatedParty = undefined;
            OrgRelatedPartiesCtrl.ePage.Masters.FreightDirection = OrgRelatedPartiesCtrl.ePage.Masters.FreightDirectionListSource[0].Code;

            GetCompanyListing();
                
        }

        // =====================Company Start=====================

        function GetCompanyListing() {
            OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgCompanyData = undefined;
            var _filter = {
                ORG_FK: OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgCompanyData.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgCompanyData.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgCompanyData = response.data.Response;

                    OnCompanySelect(OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgCompanyData[0], 0);

                    GetOrgRelatedPartiesList();
                }
            });
        }

        function OnCompanySelect($item, index) {
            OrgRelatedPartiesCtrl.ePage.Masters.SelectedCompany = $item;
        }

        // =====================Company End=====================

        // =====================Related Party Start=====================

        function GetOrgRelatedPartiesList() {
            OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgRelatedParty = undefined;
            var _filter = {
                "Parent_PK": OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
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
                    OrgRelatedPartiesCtrl.ePage.Entities.Header.Data.OrgRelatedParty = response.data.Response;
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
                templateUrl: "app/mdm/organization/relatedparties/org-relatedparties-modal/" + type + "-modal.html",
                controller: 'OrgRelatedPartyModalController as OrgRelatedPartyModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrgRelatedPartiesCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "SelectedCompany": OrgRelatedPartiesCtrl.ePage.Masters.SelectedCompany
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
