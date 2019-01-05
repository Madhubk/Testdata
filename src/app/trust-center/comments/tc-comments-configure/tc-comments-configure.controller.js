(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCCommentsConfigureController", TCCommentsConfigureController);

    TCCommentsConfigureController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "commentsConfig", "jsonEditModal", "trustCenterConfig"];

    function TCCommentsConfigureController($location, authService, apiService, helperService, toastr, commentsConfig, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCCommentsConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            var currentComments = TCCommentsConfigureCtrl.currentComments[TCCommentsConfigureCtrl.currentComments.label].ePage.Entities;

            TCCommentsConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "Comments_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentComments,
            };

            TCCommentsConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCCommentsConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCCommentsConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitParties();
                    // InitRule();
                    InitComments();
                }

                TCCommentsConfigureCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "MstCommentType",
                    ObjectId: TCCommentsConfigureCtrl.ePage.Entities.Header.Data.PK
                };
                TCCommentsConfigureCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            } catch (error) {
                console.log(error)
            }

            TCCommentsConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCCommentsConfigureCtrl.ePage.Masters.IsDisableSave = false;

            TCCommentsConfigureCtrl.ePage.Masters.SaveComments = SaveComments;
        }

        // region Comments

        function InitComments() {

            TCCommentsConfigureCtrl.ePage.Masters.Comments = {};
            TCCommentsConfigureCtrl.ePage.Masters.Comments.OnPartyTypeChange = OnPartyTypeChange;
            TCCommentsConfigureCtrl.ePage.Masters.Comments.OpenJsonModal = OpenJsonModal;

            TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView = angular.copy(TCCommentsConfigureCtrl.ePage.Entities.Header.Data);

            GetPartiesList();

            var _isEmpty = angular.equals({}, TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView);

            if (!_isEmpty) {
                PreparePartyMappingInput();

            }

            if (commentsConfig.Entities.Header.Meta.Module.ListSource.length > 0) {
                TCCommentsConfigureCtrl.ePage.Masters.Comments.ModuleListSource = commentsConfig.Entities.Header.Meta.Module.ListSource;
            } else {
                GetModuleList();
            }

        }

        function GetModuleList() {
            TCCommentsConfigureCtrl.ePage.Masters.Comments.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    TCCommentsConfigureCtrl.ePage.Masters.Comments.ModuleListSource = response.data.Response;
                    commentsConfig.Entities.Header.Meta.Module.ListSource = response.data.Response;
                } else {
                    TCCommentsConfigureCtrl.ePage.Masters.Comments.ModuleListSource = [];
                    commentsConfig.Entities.Header.Meta.Module.ListSource = [];
                }
            });
        }

        function OnPartyTypeChange($item) {
            if ($item) {
                TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.PartyType_Code = $item.GroupName;
                TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.PartyType_FK = $item.PK;
            } else {
                TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.PartyType_Code = undefined;
                TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.PartyType_FK = undefined;
            }
        }

        function SaveComments() {
            TCCommentsConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCCommentsConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MstCommentType.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCCommentsConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = commentsConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            commentsConfig.TabList[_index].label = TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.TypeCode;
                            commentsConfig.TabList[_index].code = TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.TypeCode;
                            commentsConfig.TabList[_index][TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.TypeCode] = commentsConfig.TabList[_index]["New"];

                            delete commentsConfig.TabList[_index]["New"];

                            commentsConfig.TabList[_index][TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.TypeCode].ePage.Entities.Header.Data = TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView;

                            PreparePartyMappingInput();

                        }
                    }
                }

                TCCommentsConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCCommentsConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView[objName] = result;
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
            TCCommentsConfigureCtrl.ePage.Masters.Parties = {};
        }

        function PreparePartyMappingInput() {
            TCCommentsConfigureCtrl.ePage.Masters.Parties.MappingInput = {
                MappingCode: "GRUP_CTYP_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_CTYP_APP_TNT",
                Access_FK: TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.PK,
                AccessCode: TCCommentsConfigureCtrl.ePage.Masters.Comments.FormView.TypeCode,
                AccessTo: "COMMENT",
                SAP_FK: TCCommentsConfigureCtrl.ePage.Masters.QueryString.AppPk,
                SAP_Code: TCCommentsConfigureCtrl.ePage.Masters.QueryString.AppCode
            };
        }

        function GetPartiesList() {
            TCCommentsConfigureCtrl.ePage.Masters.Parties.PartiesListSource = undefined;
            var _filter = {
                "SAP_FK": TCCommentsConfigureCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCCommentsConfigureCtrl.ePage.Masters.Parties.PartiesListSource = response.data.Response;
                } else {
                    TCCommentsConfigureCtrl.ePage.Masters.Parties.PartiesListSource = [];
                }
            });
        }


        //end region;
        Init();
    }
})();
