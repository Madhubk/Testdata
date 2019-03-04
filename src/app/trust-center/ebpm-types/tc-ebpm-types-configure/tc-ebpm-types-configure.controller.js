(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCEBPMTypesConfigureController", TCEBPMTypesConfigureController);

    TCEBPMTypesConfigureController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "ebpmTypesConfig", "jsonEditModal", "trustCenterConfig"];

    function TCEBPMTypesConfigureController($location, authService, apiService, helperService, toastr, ebpmTypesConfig, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCEBPMTypesConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            var currentEbpmTypes = TCEBPMTypesConfigureCtrl.currentEbpmTypes[TCEBPMTypesConfigureCtrl.currentEbpmTypes.label].ePage.Entities;

            TCEBPMTypesConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "EBPM_Types_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentEbpmTypes,
            };

            TCEBPMTypesConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCEBPMTypesConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCEBPMTypesConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitEBPMTypes();
                }
                
                TCEBPMTypesConfigureCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "EBPM_CFXTypes",
                    ObjectId: TCEBPMTypesConfigureCtrl.ePage.Entities.Header.Data.PK
                };
                TCEBPMTypesConfigureCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            } catch (error) {
                console.log(error)
            }

            TCEBPMTypesConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCEBPMTypesConfigureCtrl.ePage.Masters.IsDisableSave = false;

            TCEBPMTypesConfigureCtrl.ePage.Masters.SaveEBPMTypes = SaveEBPMTypes;
        }
        // region Module Settings
        function InitEBPMTypes() {
            TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes = {};
            TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.OpenJsonModal = OpenJsonModal;
            TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView = angular.copy(TCEBPMTypesConfigureCtrl.ePage.Entities.Header.Data);

            var _isEmpty = angular.equals({}, TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView);

            if (ebpmTypesConfig.Entities.Header.Meta.Module.ListSource.length > 0) {
                TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.ModuleListSource = ebpmTypesConfig.Entities.Header.Meta.Module.ListSource;
            } else {
                GetModuleList();
            }
        }

        function GetModuleList() {
            TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {

                    TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.ModuleListSource = response.data.Response;
                    ebpmTypesConfig.Entities.Header.Meta.Module.ListSource = response.data.Response;
                } else {
                    TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.ModuleListSource = [];
                    moduleSettingstConfig.Entities.Header.Meta.Module.ListSource = [];
                }
            });
        }

        function SaveEBPMTypes() {
            TCEBPMTypesConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCEBPMTypesConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView;
            _input.IsModified = true;
            // _input.SAP_FK = TCEBPMTypesConfigureCtrl.ePage.Masters.QueryString.AppPk;
            _input.MappingCode = TCEBPMTypesConfigureCtrl.ePage.Masters.QueryString.AdditionalData.Input.MappingCode;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMCFXTypes.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCEBPMTypesConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = ebpmTypesConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            ebpmTypesConfig.TabList[_index].label = TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView.Code;
                            ebpmTypesConfig.TabList[_index].code = TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView.Code;
                            ebpmTypesConfig.TabList[_index][TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView.Code] = ebpmTypesConfig.TabList[_index]["New"];

                            delete ebpmTypesConfig.TabList[_index]["New"];

                            ebpmTypesConfig.TabList[_index][TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView.Code].ePage.Entities.Header.Data = TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView;
                        }
                    }
                }

                TCEBPMTypesConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCEBPMTypesConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCEBPMTypesConfigureCtrl.ePage.Masters.EBPMTypes.FormView[objName] = result;
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
        //end region;
        Init();
    }
})();