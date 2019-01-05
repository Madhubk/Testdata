(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCEmailConfigureController", TCEmailConfigureController);

    TCEmailConfigureController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "emailConfig", "jsonEditModal", "trustCenterConfig"];

    function TCEmailConfigureController($location, authService, apiService, helperService, toastr, emailConfig, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCEmailConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();



        function Init() {
            var currentEmail = TCEmailConfigureCtrl.currentEmail[TCEmailConfigureCtrl.currentEmail.label].ePage.Entities;

            TCEmailConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "Email_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentEmail,
            };

            TCEmailConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;


            try {
                TCEmailConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitParties();
                    InitTemplate();
                    InitEmail();
                }
                TCEmailConfigureCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "MstEmailType",
                    ObjectId: TCEmailConfigureCtrl.ePage.Entities.Header.Data.PK
                };
                TCEmailConfigureCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            } catch (error) {
                console.log(error)
            }

            TCEmailConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCEmailConfigureCtrl.ePage.Masters.IsDisableSave = false;


            TCEmailConfigureCtrl.ePage.Masters.SaveEmail = SaveEmail;
        }

        // region Comments

        function InitEmail() {

            TCEmailConfigureCtrl.ePage.Masters.Email = {};
            TCEmailConfigureCtrl.ePage.Masters.Email.OnPartyTypeChange = OnPartyTypeChange;
            TCEmailConfigureCtrl.ePage.Masters.Email.OpenJsonModal = OpenJsonModal;

            TCEmailConfigureCtrl.ePage.Masters.Email.FormView = angular.copy(TCEmailConfigureCtrl.ePage.Entities.Header.Data);

            GetPartiesList();

            var _isEmpty = angular.equals({}, TCEmailConfigureCtrl.ePage.Masters.Email.FormView);

            if (!_isEmpty) {
                PreparePartyMappingInput();
                GetEmailTemplate();
            }
        }

        function OnPartyTypeChange($item) {
            if ($item) {
                TCEmailConfigureCtrl.ePage.Masters.Email.FormView.PartyType_Code = $item.GroupName;
                TCEmailConfigureCtrl.ePage.Masters.Email.FormView.PartyType_FK = $item.PK;
            } else {
                TCEmailConfigureCtrl.ePage.Masters.Email.FormView.PartyType_Code = undefined;
                TCEmailConfigureCtrl.ePage.Masters.Email.FormView.PartyType_FK = undefined;
            }
        }

        function SaveEmail() {
            TCEmailConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCEmailConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCEmailConfigureCtrl.ePage.Masters.Email.FormView;
            _input.SAP_FK = TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MstEmailType.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCEmailConfigureCtrl.ePage.Masters.Email.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCEmailConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = emailConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            emailConfig.TabList[_index].label = TCEmailConfigureCtrl.ePage.Masters.Email.FormView.Key;
                            emailConfig.TabList[_index].code = TCEmailConfigureCtrl.ePage.Masters.Email.FormView.Key;
                            emailConfig.TabList[_index][TCEmailConfigureCtrl.ePage.Masters.Email.FormView.Key] = emailConfig.TabList[_index]["New"];

                            delete emailConfig.TabList[_index]["New"];

                            emailConfig.TabList[_index][TCEmailConfigureCtrl.ePage.Masters.Email.FormView.TypeCode].ePage.Entities.Header.Data = TCEmailConfigureCtrl.ePage.Masters.Email.FormView;

                            PreparePartyMappingInput();

                        }
                    }
                }

                TCEmailConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCEmailConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCEmailConfigureCtrl.ePage.Masters.Email.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCEmailConfigureCtrl.ePage.Masters.Email.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCEmailConfigureCtrl.ePage.Masters.Email.FormView[objName] = result;
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
            TCEmailConfigureCtrl.ePage.Masters.Parties = {};
        }

        function PreparePartyMappingInput() {
            TCEmailConfigureCtrl.ePage.Masters.Parties.MappingInput = {
                MappingCode: "GRUP_ELTYP_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_ELTYP_APP_TNT",
                Access_FK: TCEmailConfigureCtrl.ePage.Masters.Email.FormView.PK,
                AccessCode: TCEmailConfigureCtrl.ePage.Masters.Email.FormView.TypeCode,
                AccessTo: "EMAIL",
                SAP_FK: TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk,
                SAP_Code: TCEmailConfigureCtrl.ePage.Masters.QueryString.AppCode,
            };
        }

        function GetPartiesList() {
            TCEmailConfigureCtrl.ePage.Masters.Parties.PartiesListSource = undefined;
            var _filter = {
                "SAP_FK": TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCEmailConfigureCtrl.ePage.Masters.Parties.PartiesListSource = response.data.Response;
                } else {
                    TCEmailConfigureCtrl.ePage.Masters.Parties.PartiesListSource = [];
                }
            });
        }

        //region Template

        function InitTemplate() {
            TCEmailConfigureCtrl.ePage.Masters.Template = {};
            // TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue = {};

            TCEmailConfigureCtrl.ePage.Masters.OnModuleChange = OnModuleChange;
            TCEmailConfigureCtrl.ePage.Masters.JSONModal = JSONModal;
            TCEmailConfigureCtrl.ePage.Masters.OnTemplateSave = OnTemplateSave;

            TCEmailConfigureCtrl.ePage.Masters.Template.SaveButtonText = "Save";
            TCEmailConfigureCtrl.ePage.Masters.Template.IsDisableSave = false;
        }

        function GetEmailTemplate() {
            var _filter = {
                "EntitySource": "EXCELCONFIG",
                "Key": TCEmailConfigureCtrl.ePage.Masters.Email.FormView.Key,
                "TypeCode": TCEmailConfigureCtrl.ePage.Masters.Email.FormView.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.AppSettings.API.FindAll.Url + TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue = response.data.Response[0];
                    }
                }
                GetModuleList();
            });
        }

        function GetModuleList() {
            TCEmailConfigureCtrl.ePage.Masters.Template.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    TCEmailConfigureCtrl.ePage.Masters.Template.ModuleListSource = response.data.Response;
                    if (TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue) {
                        if (TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue.ModuleCode) {
                            var _index = TCEmailConfigureCtrl.ePage.Masters.Template.ModuleListSource.map(function (value, key) {
                                return value.Key;
                            }).indexOf(TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue.ModuleCode);
                            OnModuleChange(TCEmailConfigureCtrl.ePage.Masters.Template.ModuleListSource[_index]);

                        }
                    }
                } else {
                    TCEmailConfigureCtrl.ePage.Masters.Template.ModuleListSource = [];


                }

            });
        }

        function OnModuleChange($item) {
            TCEmailConfigureCtrl.ePage.Masters.Template.ActiveModule = $item;
            if ($item) {
                GetSubModuleList();
            }
        }

        function GetSubModuleList() {
            TCEmailConfigureCtrl.ePage.Masters.Template.SubModuleList = undefined;
            var _filter = {

                EntitySource: "EXCELCONFIG",
                PropertyName: "SVS_SourceEntityRefKey",
                SAP_FK: TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk,
                TenantCode: authService.getUserInfo().TenantCode,
                ModuleCode: TCEmailConfigureCtrl.ePage.Masters.Template.ActiveModule.Key

            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.AppSettings.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.AppSettings.API.GetColumnValuesWithFilters.Url + TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    TCEmailConfigureCtrl.ePage.Masters.Template.SubModuleList = response.data.Response;
                } else {
                    TCEmailConfigureCtrl.ePage.Masters.Template.SubModuleList = [];
                }
            });
        }

        function JSONModal(objName) {
            var _json = TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue[objName] = result;
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

        function OnTemplateSave() {
            // var _input = {};
            TCEmailConfigureCtrl.ePage.Masters.Template.SaveButtonText = "Please Wait...";
            TCEmailConfigureCtrl.ePage.Masters.Template.IsDisableSave = true;
            var _input = angular.copy(TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue);

            if (TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue.PK) {

            } else {
                _input.Key = TCEmailConfigureCtrl.ePage.Masters.Email.FormView.Key;
                _input.EntitySource = "EXCELCONFIG";
                _input.TypeCode = TCEmailConfigureCtrl.ePage.Masters.Email.FormView.PK;
                _input.IsActive = true;
                _input.IsJSON = true;
                _input.ModuleCode = TCEmailConfigureCtrl.ePage.Masters.Template.ActiveModule.Key;
                _input.SourceEntityRefKey = TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue.SourceEntityRefKey;
                _input.Value = TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue.Value;
            }
            _input.IsModified = true;
            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.AppSettings.API.Upsert.Url + TCEmailConfigureCtrl.ePage.Masters.QueryString.AppPk, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCEmailConfigureCtrl.ePage.Masters.Template.ModalValue = response.data.Response[0];
                    }
                }

                TCEmailConfigureCtrl.ePage.Masters.Template.SaveButtonText = "Save";
                TCEmailConfigureCtrl.ePage.Masters.Template.IsDisableSave = false;
            });
        }

        //end region;
        Init();
    }
})();
