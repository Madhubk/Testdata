(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgRelatedPartyModalController", OrgRelatedPartyModalController);

    OrgRelatedPartyModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "organizationConfig", "helperService", "param", "toastr", "appConfig"];

    function OrgRelatedPartyModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, organizationConfig, helperService, param, toastr, appConfig) {
        var OrgRelatedPartyModalCtrl = this;
        var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

        function Init() {
            OrgRelatedPartyModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_RelatedParties",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgRelatedPartyModalCtrl.ePage.Masters.param = param;
            OrgRelatedPartyModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgRelatedPartyModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgRelatedPartyModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgRelatedPartyModalCtrl.ePage.Masters.Save = Save;
            OrgRelatedPartyModalCtrl.ePage.Masters.Cancel = Cancel;

            InitRelatedParty();
        }

        function InitRelatedParty() {
            OrgRelatedPartyModalCtrl.ePage.Masters.RelatedParty = {};
            OrgRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView = {};

            if (OrgRelatedPartyModalCtrl.ePage.Masters.param.Item) {
                OrgRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView = angular.copy(OrgRelatedPartyModalCtrl.ePage.Masters.param.Item);
            }

            OrgRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView.CMP_FK = OrgRelatedPartyModalCtrl.ePage.Masters.param.SelectedCompany.CMP_FK;

            OrgRelatedPartyModalCtrl.ePage.Masters.RelatedParty.FormView.Parent_PK = OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;

            OrgRelatedPartyModalCtrl.ePage.Masters.RelatedParty.AutoCompleteOnSelect = AutoCompleteOnSelect;
            OrgRelatedPartyModalCtrl.ePage.Masters.RelatedParty.SelectedLookupData = SelectedLookupData;
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
                    var _isExist = OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type].some(function (value, key) {
                        return value.RelatedParty_PK === obj.RelatedParty_PK && value.Party_PK === obj.Party_PK;
                    });

                    if (!_isExist) {
                        OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type].push(obj);
                    } else {
                        var _index = OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type].map(function (value, key) {
                            if (value.RelatedParty_PK === obj.RelatedParty_PK && value.Party_PK === obj.Party_PK) {

                                OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].CMP_FK = obj.CMP_FK;
                                OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].Parent_PK = obj.Parent_PK;
                                OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].Party_PK = obj.Party_PK;
                                OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].RelatedParty_PK = obj.RelatedParty_PK;
                                OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].UNL_PK = obj.UNL_PK;
                                OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].FreightMode = obj.FreightMode;
                                OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data[type][key].FreightDirection = obj.FreightDirection;
                            }
                        });
                    }
                }

                OrgRelatedPartyModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgRelatedPartyModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgRelatedPartyModalCtrl.ePage.Masters.param.Entity,'Organization').then(function (response) {
                    if (response.Status === "success") {
                        var _exports = {
                            Data: obj,
                            type: type
                        };
                        $uibModalInstance.close(_exports);
                        Cancel();
                        OrgRelatedPartyModalCtrl.ePage.Masters.Config.refreshgrid();
                    } 
                    else if (response.Status === "failed") {
                        var _filter = {
                        "Parent_PK": OrgRelatedPartyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
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

                    OrgRelatedPartyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgRelatedPartyModalCtrl.ePage.Masters.IsDisableSave = false;
                });
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
