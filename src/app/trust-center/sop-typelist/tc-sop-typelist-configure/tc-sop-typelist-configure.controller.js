(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCSOPTypelistConfigureController", TCSOPTypelistConfigureController);

    TCSOPTypelistConfigureController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "sopTypelistConfig", "jsonEditModal", "trustCenterConfig"];

    function TCSOPTypelistConfigureController($location, authService, apiService, helperService, toastr, sopTypelistConfig, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCSOPTypelistConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            var currentSopTypelist = TCSOPTypelistConfigureCtrl.currentSopTypelist[TCSOPTypelistConfigureCtrl.currentSopTypelist.label].ePage.Entities;

            TCSOPTypelistConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "SOPTypelist_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentSopTypelist,
            };

            TCSOPTypelistConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;


            try {
                TCSOPTypelistConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCSOPTypelistConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitParties();
                    // InitRule();
                    InitTypelist();
                }
            } catch (error) {
                console.log(error)
            }

            TCSOPTypelistConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCSOPTypelistConfigureCtrl.ePage.Masters.IsDisableSave = false;

            TCSOPTypelistConfigureCtrl.ePage.Masters.SaveTypelist = SaveTypelist;
        }

        // region Comments

        function InitTypelist() {

            TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist = {};
            TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.OnPartyTypeChange = OnPartyTypeChange;
            TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.OpenJsonModal = OpenJsonModal;

            TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView = angular.copy(TCSOPTypelistConfigureCtrl.ePage.Entities.Header.Data);

            GetPartiesList();

            var _isEmpty = angular.equals({}, TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView);

            if (!_isEmpty) {
                // PreparePartyMappingInput();

            }

            if (sopTypelistConfig.Entities.Header.Meta.Module.ListSource.length > 0) {
                TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = sopTypelistConfig.Entities.Header.Meta.Module.ListSource;
            } else {
                GetModuleList();
            }

        }

        function GetModuleList() {
            TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {

                    TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = response.data.Response;
                    sopTypelistConfig.Entities.Header.Meta.Module.ListSource = response.data.Response;
                } else {
                    TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.ModuleListSource = [];
                    sopTypelistConfig.Entities.Header.Meta.Module.ListSource = [];
                }
            });
        }

        function OnPartyTypeChange($item) {
            if ($item) {
                TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_Code = $item.GroupName;
                TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_FK = $item.PK;
            } else {
                TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_Code = undefined;
                TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.PartyType_FK = undefined;
            }
        }

        function SaveTypelist() {
            TCSOPTypelistConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCSOPTypelistConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView;
            _input.IsModified = true;
            _input.SAP_FK = TCSOPTypelistConfigureCtrl.ePage.Masters.QueryString.AppPk;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SOPTypelist.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCSOPTypelistConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = sopTypelistConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            sopTypelistConfig.TabList[_index].label = TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode;
                            sopTypelistConfig.TabList[_index].code = TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode;
                            sopTypelistConfig.TabList[_index][TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode] = sopTypelistConfig.TabList[_index]["New"];

                            delete sopTypelistConfig.TabList[_index]["New"];

                            sopTypelistConfig.TabList[_index][TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView.TypeCode].ePage.Entities.Header.Data = TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView;

                            PreparePartyMappingInput();

                        }
                    }
                }

                TCSOPTypelistConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCSOPTypelistConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCSOPTypelistConfigureCtrl.ePage.Masters.Typelist.FormView[objName] = result;
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
            TCSOPTypelistConfigureCtrl.ePage.Masters.Parties = {};
        }
        function GetPartiesList() {
            TCSOPTypelistConfigureCtrl.ePage.Masters.Parties.PartiesListSource = undefined;
            var _filter = {
                "SAP_FK": TCSOPTypelistConfigureCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCSOPTypelistConfigureCtrl.ePage.Masters.Parties.PartiesListSource = response.data.Response;
                } else {
                    TCSOPTypelistConfigureCtrl.ePage.Masters.Parties.PartiesListSource = [];
                }
            });
        }

        //end region;
        Init();
    }
})();
