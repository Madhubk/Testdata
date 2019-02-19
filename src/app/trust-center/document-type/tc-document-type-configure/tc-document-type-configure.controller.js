(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCDocumentTypeConfigureController", TCDocumentTypeConfigureController);

    TCDocumentTypeConfigureController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "documentTypeConfig", "jsonEditModal", "trustCenterConfig"];

    function TCDocumentTypeConfigureController($location, authService, apiService, helperService, toastr, documentTypeConfig, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCDocumentTypeConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            var currentDocumentType = TCDocumentTypeConfigureCtrl.currentDocumentType[TCDocumentTypeConfigureCtrl.currentDocumentType.label].ePage.Entities;

            TCDocumentTypeConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "DocumentType_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDocumentType,
            };

            TCDocumentTypeConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;


            try {
                TCDocumentTypeConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCDocumentTypeConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitParties();
                    // InitRule();
                    InitDocumentType();
                }

                TCDocumentTypeConfigureCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "MstDocType",
                    ObjectId: TCDocumentTypeConfigureCtrl.ePage.Entities.Header.Data.PK
                };
                TCDocumentTypeConfigureCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            } catch (error) {
                console.log(error)
            }

            TCDocumentTypeConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCDocumentTypeConfigureCtrl.ePage.Masters.IsDisableSave = false;

            TCDocumentTypeConfigureCtrl.ePage.Masters.SaveDocumentType = SaveDocumentType;
        }

        // region Document

        function InitDocumentType() {

            TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType = {};
            TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.OnPartyTypeChange = OnPartyTypeChange;
            TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.OpenJsonModal = OpenJsonModal;

            TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView = angular.copy(TCDocumentTypeConfigureCtrl.ePage.Entities.Header.Data);

            GetPartiesList();

            var _isEmpty = angular.equals({}, TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView);

            if (!_isEmpty) {
                PreparePartyMappingInput();

            }

            if (documentTypeConfig.Entities.Header.Meta.Module.ListSource.length > 0) {
                TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.ModuleListSource = documentTypeConfig.Entities.Header.Meta.Module.ListSource;
            } else {
                GetModuleList();
            }

        }

        function GetModuleList() {
            TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.ModuleListSource = response.data.Response;
                    documentTypeConfig.Entities.Header.Meta.Module.ListSource = response.data.Response;
                } else {
                    TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.ModuleListSource = [];
                    documentTypeConfig.Entities.Header.Meta.Module.ListSource = [];
                }
            });
        }

        function OnPartyTypeChange($item) {
            if ($item) {
                TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.PartyType_Code = $item.GroupName;
                TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.PartyType_FK = $item.PK;
            } else {
                TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.PartyType_Code = undefined;
                TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.PartyType_FK = undefined;
            }
        }

        function SaveDocumentType() {
            TCDocumentTypeConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCDocumentTypeConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DocTypeMaster.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCDocumentTypeConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = documentTypeConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            documentTypeConfig.TabList[_index].label = TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.DocType;
                            documentTypeConfig.TabList[_index].code = TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.DocType;
                            documentTypeConfig.TabList[_index][TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.DocType] = documentTypeConfig.TabList[_index]["New"];

                            delete documentTypeConfig.TabList[_index]["New"];

                            documentTypeConfig.TabList[_index][TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.DocType].ePage.Entities.Header.Data = TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView;

                            PreparePartyMappingInput();

                        }
                    }
                }

                TCDocumentTypeConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCDocumentTypeConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView[objName] = result;
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
            TCDocumentTypeConfigureCtrl.ePage.Masters.Parties = {};
        }

        function PreparePartyMappingInput() {
            TCDocumentTypeConfigureCtrl.ePage.Masters.Parties.MappingInput = {
                MappingCode: "GRUP_DTYP_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_DTYP_APP_TNT",

                AccessTo: "DOCUMENT",
                Access_FK: TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.PK,
                AccessCode: TCDocumentTypeConfigureCtrl.ePage.Masters.DocumentType.FormView.DocType,

                SAP_FK: TCDocumentTypeConfigureCtrl.ePage.Masters.QueryString.AppPk,
                SAP_Code: TCDocumentTypeConfigureCtrl.ePage.Masters.QueryString.AppCode,

                PartyMappingAPI: "GroupDocumentType",
                PartyRoleMappingAPI: "GroupRoleDocumentType"
            };
        }

        function GetPartiesList() {
            TCDocumentTypeConfigureCtrl.ePage.Masters.Parties.PartiesListSource = undefined;
            var _filter = {
                "SAP_FK": TCDocumentTypeConfigureCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCDocumentTypeConfigureCtrl.ePage.Masters.Parties.PartiesListSource = response.data.Response;
                } else {
                    TCDocumentTypeConfigureCtrl.ePage.Masters.Parties.PartiesListSource = [];
                }
            });
        }

        //end region;
        Init();
    }
})();