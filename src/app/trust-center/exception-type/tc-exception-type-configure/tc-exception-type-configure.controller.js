(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCExceptionTypeConfigureController", TCExceptionTypeConfigureController);

    TCExceptionTypeConfigureController.$inject = ["$location", "$window", "authService", "apiService", "helperService", "toastr", "exceptionTypeConfig", "jsonEditModal", "trustCenterConfig"];

    function TCExceptionTypeConfigureController($location, $window, authService, apiService, helperService, toastr, exceptionTypeConfig, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCExceptionTypeConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            var currentExceptionType = TCExceptionTypeConfigureCtrl.currentExceptionType[TCExceptionTypeConfigureCtrl.currentExceptionType.label].ePage.Entities;

            TCExceptionTypeConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "ExceptionType_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentExceptionType,
            };

            TCExceptionTypeConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCExceptionTypeConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCExceptionTypeConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitParties();
                    InitExceptionType();
                }

                TCExceptionTypeConfigureCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "MstExceptionType",
                    ObjectId: TCExceptionTypeConfigureCtrl.ePage.Entities.Header.Data.PK
                };
                TCExceptionTypeConfigureCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            } catch (error) {
                console.log(error)
            }

            TCExceptionTypeConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCExceptionTypeConfigureCtrl.ePage.Masters.IsDisableSave = false;

            TCExceptionTypeConfigureCtrl.ePage.Masters.SaveExceptionType = SaveExceptionType;
        }

        // region Exception
        function InitExceptionType() {
            TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType = {};
            TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.OnPartyTypeChange = OnPartyTypeChange;
            TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.OpenJsonModal = OpenJsonModal;

            TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView = angular.copy(TCExceptionTypeConfigureCtrl.ePage.Entities.Header.Data);

            GetPartiesList();

            var _isEmpty = angular.equals({}, TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView);

            if (!_isEmpty) {
                PreparePartyMappingInput();
                InitEvent();
            }
        }

        function OnPartyTypeChange($item) {
            if ($item) {
                TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.PartyType_Code = $item.GroupName;
                TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.PartyType_FK = $item.PK;
            } else {
                TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.PartyType_Code = undefined;
                TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.PartyType_FK = undefined;
            }
        }

        function SaveExceptionType() {
            TCExceptionTypeConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCExceptionTypeConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView;
            _input.IsModified = true;
            _input.SAP_FK = TCExceptionTypeConfigureCtrl.ePage.Masters.QueryString.AppPk;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MstExceptionType.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCExceptionTypeConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = exceptionTypeConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            exceptionTypeConfig.TabList[_index].label = TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.Key;
                            exceptionTypeConfig.TabList[_index].code = TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.Key;
                            exceptionTypeConfig.TabList[_index][TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.Key] = exceptionTypeConfig.TabList[_index]["New"];

                            delete exceptionTypeConfig.TabList[_index]["New"];

                            exceptionTypeConfig.TabList[_index][TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.Key].ePage.Entities.Header.Data = TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView;

                            PreparePartyMappingInput();
                        }
                    }
                }

                TCExceptionTypeConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCExceptionTypeConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView[objName];

            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView[objName] = result;
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
        // endregion

        //region Parties
        function InitParties() {
            TCExceptionTypeConfigureCtrl.ePage.Masters.Parties = {};
        }

        function PreparePartyMappingInput() {
            TCExceptionTypeConfigureCtrl.ePage.Masters.Parties.MappingInput = {
                MappingCode: "GRUP_ETYP_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_ETYP_APP_TNT",
                Access_FK: TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.PK,
                AccessTo: "EXCEPTION",
                AccessCode: TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.Key,
                SAP_FK: TCExceptionTypeConfigureCtrl.ePage.Masters.QueryString.AppPk,
                SAP_Code: TCExceptionTypeConfigureCtrl.ePage.Masters.QueryString.AppCode,
            };
        }

        function GetPartiesList() {
            TCExceptionTypeConfigureCtrl.ePage.Masters.Parties.PartiesListSource = undefined;
            var _filter = {
                "SAP_FK": TCExceptionTypeConfigureCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCExceptionTypeConfigureCtrl.ePage.Masters.Parties.PartiesListSource = response.data.Response;
                } else {
                    TCExceptionTypeConfigureCtrl.ePage.Masters.Parties.PartiesListSource = [];
                }
            });
        }
        //end region

        // region Event
        function InitEvent() {
            TCExceptionTypeConfigureCtrl.ePage.Masters.Event = {};
            TCExceptionTypeConfigureCtrl.ePage.Masters.Event.CreateEvent = CreateEvent;
            TCExceptionTypeConfigureCtrl.ePage.Masters.Event.EditEvent = EditEvent;

            TCExceptionTypeConfigureCtrl.ePage.Masters.Event.IsEventCreated = false;

            GetEventDetails();
        }

        function GetEventDetails() {
            TCExceptionTypeConfigureCtrl.ePage.Masters.Event.ActiveEvent = undefined;
            var _filter = {
                Code: TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.Key,
                EntityRefKey: TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EventMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCExceptionTypeConfigureCtrl.ePage.Masters.Event.ActiveEvent = response.data.Response[0];
                        TCExceptionTypeConfigureCtrl.ePage.Masters.Event.IsEventCreated = true;
                    }
                }
            });
        }

        function CreateEvent() {
            var _input = {
                Code: TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.Key,
                EntityRefKey: TCExceptionTypeConfigureCtrl.ePage.Masters.ExceptionType.FormView.PK,
                Priority: "1",
                IsModified: true
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventMaster.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCExceptionTypeConfigureCtrl.ePage.Masters.Event.ActiveEvent = response.data.Response[0];
                        TCExceptionTypeConfigureCtrl.ePage.Masters.Event.IsEventCreated = true;
                    }
                }
            });
        }

        function EditEvent() {
            var _queryString = TCExceptionTypeConfigureCtrl.ePage.Masters.QueryString;
            _queryString.EventInfo = TCExceptionTypeConfigureCtrl.ePage.Masters.Event.ActiveEvent;

            $window.open("#/TC/event/" + helperService.encryptData(_queryString), '_blank');
        }

        Init();
    }
})();
