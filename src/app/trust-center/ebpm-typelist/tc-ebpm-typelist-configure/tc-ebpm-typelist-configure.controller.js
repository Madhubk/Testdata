(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCEBPMTypelistConfigureController", TCEBPMTypelistConfigureController);

    TCEBPMTypelistConfigureController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "ebpmTypelistConfig", "jsonEditModal", "trustCenterConfig"];

    function TCEBPMTypelistConfigureController($location, authService, apiService, helperService, toastr, ebpmTypelistConfig, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCEBPMTypelistConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            var currentTypelist = TCEBPMTypelistConfigureCtrl.currentTypelist[TCEBPMTypelistConfigureCtrl.currentTypelist.label].ePage.Entities;

            TCEBPMTypelistConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "EBPMTypelist_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTypelist,
            };

            TCEBPMTypelistConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;


            try {
                TCEBPMTypelistConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCEBPMTypelistConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitParties();
                    // InitRule();
                    InitTypelist();
                }
            } catch (error) {
                console.log(error)
            }

            TCEBPMTypelistConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCEBPMTypelistConfigureCtrl.ePage.Masters.IsDisableSave = false;

            TCEBPMTypelistConfigureCtrl.ePage.Masters.SaveTypelist = SaveTypelist;
        }

        // region Comments

        function InitTypelist() {

            TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist = {};
            TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.OnPartyTypeChange = OnPartyTypeChange;
            TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.OpenJsonModal = OpenJsonModal;

            TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView = angular.copy(TCEBPMTypelistConfigureCtrl.ePage.Entities.Header.Data);

            GetPartiesList();

            var _isEmpty = angular.equals({}, TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView);

            if (!_isEmpty) {
                // PreparePartyMappingInput();

            }

            if (ebpmTypelistConfig.Entities.Header.Meta.Module.ListSource.length > 0) {
                TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = ebpmTypelistConfig.Entities.Header.Meta.Module.ListSource;
            } else {
                GetModuleList();
            }

        }

        function GetModuleList() {
            TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {

                    TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = response.data.Response;
                    ebpmTypelistConfig.Entities.Header.Meta.Module.ListSource = response.data.Response;
                } else {
                    TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = [];
                    ebpmTypelistConfig.Entities.Header.Meta.Module.ListSource = [];
                }
            });
        }

        function OnPartyTypeChange($item) {
            if ($item) {
                TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_Code = $item.GroupName;
                TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_FK = $item.PK;
            } else {
                TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_Code = undefined;
                TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_FK = undefined;
            }
        }

        function SaveTypelist() {
            TCEBPMTypelistConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCEBPMTypelistConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView;
            _input.IsModified = true;
            _input.SAP_FK = TCEBPMTypelistConfigureCtrl.ePage.Masters.QueryString.AppPk;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SOPTypelist.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCEBPMTypelistConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = ebpmTypelistConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            ebpmTypelistConfig.TabList[_index].label = TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode;
                            ebpmTypelistConfig.TabList[_index].code = TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode;
                            ebpmTypelistConfig.TabList[_index][TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode] = ebpmTypelistConfig.TabList[_index]["New"];

                            delete ebpmTypelistConfig.TabList[_index]["New"];

                            ebpmTypelistConfig.TabList[_index][TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode].ePage.Entities.Header.Data = TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView;

                            PreparePartyMappingInput();

                        }
                    }
                }

                TCEBPMTypelistConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCEBPMTypelistConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCEBPMTypelistConfigureCtrl.ePage.Masters.Typelist.FormView[objName] = result;
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }

        //region Parties

        function InitParties() {
            TCEBPMTypelistConfigureCtrl.ePage.Masters.Parties = {};
        }
        function GetPartiesList() {
            TCEBPMTypelistConfigureCtrl.ePage.Masters.Parties.PartiesListSource = undefined;
            var _filter = {
                "SAP_FK": TCEBPMTypelistConfigureCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCEBPMTypelistConfigureCtrl.ePage.Masters.Parties.PartiesListSource = response.data.Response;
                } else {
                    TCEBPMTypelistConfigureCtrl.ePage.Masters.Parties.PartiesListSource = [];
                }
            });
        }

        //end region;
        Init();
    }
})();
