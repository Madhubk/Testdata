(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgGenRelatedPartyModalController", OrgGenRelatedPartyModalController);

    OrgGenRelatedPartyModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "organizationConfig", "helperService", "param", "toastr", "appConfig"];

    function OrgGenRelatedPartyModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, organizationConfig, helperService, param, toastr, appConfig) {
        var OrgGenRelatedPartyModalCtrl = this;
        var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

        function Init() {
            OrgGenRelatedPartyModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_RelatedParties",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgGenRelatedPartyModalCtrl.ePage.Masters.param = param;
            OrgGenRelatedPartyModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgGenRelatedPartyModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgGenRelatedPartyModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgGenRelatedPartyModalCtrl.ePage.Masters.Save = Save;
            OrgGenRelatedPartyModalCtrl.ePage.Masters.Cancel = Cancel;

            InitRelatedParty();
        }

        function InitRelatedParty() {
            OrgGenRelatedPartyModalCtrl.ePage.Masters.RelatedParty = {};
            OrgGenRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView = {};

            if (OrgGenRelatedPartyModalCtrl.ePage.Masters.param.Item) {
                OrgGenRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView = angular.copy(OrgGenRelatedPartyModalCtrl.ePage.Masters.param.Item);
            }

            //OrgGenRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView.CMP_FK = OrgGenRelatedPartyModalCtrl.ePage.Masters.param.SelectedCompany.CMP_FK;

            OrgGenRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView.Parent_PK = OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;

            OrgGenRelatedPartyModalCtrl.ePage.Masters.RelatedParty.AutoCompleteOnSelect = AutoCompleteOnSelect;
            OrgGenRelatedPartyModalCtrl.ePage.Masters.RelatedParty.SelectedLookupData = SelectedLookupData;
        }

        function AutoCompleteOnSelect($item) {
            console.log($item);
        }

        function SelectedLookupData($item) {
            console.log($item);
        }

        function Save(obj, type) {
            var _isEmpty = angular.equals(obj, {});

            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                obj.IsModified = true;
                if (type !== "OrgHeader") {
                    var _isExist = OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type].some(function (value, key) {
                        return value.RelatedParty_PK === obj.RelatedParty_PK && value.Party_PK === obj.Party_PK;
                    });

                    if (!_isExist) {
                        OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type].push(obj);
                    } else {
                        var _index = OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type].map(function (value, key) {
                            if (value.RelatedParty_PK === obj.RelatedParty_PK && value.Party_PK === obj.Party_PK) {

                                OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].CMP_FK = obj.CMP_FK;
                                OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].Parent_PK = obj.Parent_PK;
                                OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].Party_PK = obj.Party_PK;
                                OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].RelatedParty_PK = obj.RelatedParty_PK;
                                OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].UNL_PK = obj.UNL_PK;
                                OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].FreightMode = obj.FreightMode;
                                OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].FreightDirection = obj.FreightDirection;
                            }
                        });
                    }
                }

                OrgGenRelatedPartyModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgGenRelatedPartyModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgGenRelatedPartyModalCtrl.ePage.Masters.param.Entity,'Organization').then(function (response) {
                    if (response.Status === "success") {
                        var _exports = {
                            Data: obj,
                            type: type
                        };
                        $uibModalInstance.close(_exports);
                        Cancel();
                        OrgGenRelatedPartyModalCtrl.ePage.Masters.Config.refreshgrid();
                    } 
                    else if (response.Status === "failed") {
                        var _filter = {
                        "Parent_PK": OrgGenRelatedPartyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
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
                            currentOrganization.Header.Data.OrgRelatedParty = response.data.Response;
                            }
                        });
                        Cancel();
                    }

                    OrgGenRelatedPartyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgGenRelatedPartyModalCtrl.ePage.Masters.IsDisableSave = false;
                });
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
