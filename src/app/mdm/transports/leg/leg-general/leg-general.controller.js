(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LegGeneralController", LegGeneralController);

    LegGeneralController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "legConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function LegGeneralController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, legConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var LegGeneralCtrl = this;

        function Init() {
            var currentLeg = LegGeneralCtrl.currentLeg[LegGeneralCtrl.currentLeg.label].ePage.Entities;

            LegGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Leg_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentLeg,
            };

            LegGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            LegGeneralCtrl.ePage.Masters.Lineslist = true;
            LegGeneralCtrl.ePage.Masters.Config = legConfig;
            LegGeneralCtrl.ePage.Meta.IsLoading = false;



            LegGeneralCtrl.ePage.Masters.emptyText = "-";
            LegGeneralCtrl.ePage.Masters.selectedRow = -1;

            LegGeneralCtrl.ePage.Masters.HeaderName = '';

            LegGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            LegGeneralCtrl.ePage.Masters.SelectedFromZone = SelectedFromZone;
            LegGeneralCtrl.ePage.Masters.SelectedToZone = SelectedToZone;
            LegGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            LegGeneralCtrl.ePage.Masters.Validation = Validation;
            LegGeneralCtrl.ePage.Masters.SaveButtonText = "Save";

            GetCfxTypeList()
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            LegGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            angular.forEach(LegGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                LegGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), LegGeneralCtrl.currentLeg.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                LegGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), LegGeneralCtrl.currentLeg.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function setSelectedRow(index) {
            LegGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function SelectedFromZone(item) {
            if (item.data) {
                LegGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.data.entity.PK;
                LegGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.data.entity.Name;
            } else {
                LegGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.PK;
                LegGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.Name;
            }
        }

        function SelectedToZone(item) {
            if (item.data) {
                LegGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.data.entity.PK;
                LegGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.data.entity.Name;
            } else {
                LegGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.PK;
                LegGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.Name;
            }
        }

        function OnChangeServiceType(serviceType) {
            angular.forEach(LegGeneralCtrl.ePage.Masters.servicetypelistSource, function (value, key) {
                if (value.AddRef1Code == serviceType) {
                    LegGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    LegGeneralCtrl.ePage.Entities.Header.Data.ServiceType = value.AddRef1Code;
                }
            });
        }

        function GetCfxTypeList() {
            var typeCodeList = ["Leg_type", "ManifestType"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        LegGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        LegGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            LegGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (LegGeneralCtrl.ePage.Entities.Header.Validations) {
                LegGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(LegGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                LegGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(LegGeneralCtrl.currentLeg);
            }
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                apiService.post("eAxisAPI", LegGeneralCtrl.ePage.Entities.Header.API.InsertLeg.Url, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Saved Successfully");

                        // label bind
                        var _index = legConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(LegGeneralCtrl.currentLeg[LegGeneralCtrl.currentLeg.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            apiService.get("eAxisAPI", 'TmsLegTemplate/GetById/' + response.data.Response[0].PK).then(function (response) {
                                if (response.data.Response) {
                                    legConfig.TabList[_index][legConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    legConfig.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = LegGeneralCtrl.ePage.Entities.Header.Data.Title;
                                                value[LegGeneralCtrl.ePage.Entities.Header.Data.Title] = value.New;
                                                delete value.New;
                                            } else if (!value.isNew) {
                                                var templabel = value.label;
                                                if (templabel == LegGeneralCtrl.ePage.Entities.Header.Data.Title) {
                                                    value.label = LegGeneralCtrl.ePage.Entities.Header.Data.Title;
                                                    value[LegGeneralCtrl.ePage.Entities.Header.Data.Title] = value[templabel];
                                                } else {
                                                    value.label = LegGeneralCtrl.ePage.Entities.Header.Data.Title;
                                                    value[LegGeneralCtrl.ePage.Entities.Header.Data.Title] = value[templabel];
                                                    delete value[templabel];
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                            legConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/leg") {
                                helperService.refreshGrid();
                            }
                        }
                    } else {
                        toastr.error("Could Not Save");
                    }
                });
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                apiService.post("eAxisAPI", LegGeneralCtrl.ePage.Entities.Header.API.UpdateLeg.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Saved Successfully");
                        var _index = legConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(LegGeneralCtrl.currentLeg[LegGeneralCtrl.currentLeg.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            apiService.get("eAxisAPI", 'TmsLegTemplate/GetById/' + response.data.Response.PK).then(function (response) {
                                if (response.data.Response) {
                                    legConfig.TabList[_index][legConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    legConfig.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = LegGeneralCtrl.ePage.Entities.Header.Data.Title;
                                                value[LegGeneralCtrl.ePage.Entities.Header.Data.Title] = value.New;
                                                delete value.New;
                                            } else if (!value.isNew) {
                                                var templabel = value.label;
                                                if (templabel == LegGeneralCtrl.ePage.Entities.Header.Data.Title) {
                                                    value.label = LegGeneralCtrl.ePage.Entities.Header.Data.Title;
                                                    value[LegGeneralCtrl.ePage.Entities.Header.Data.Title] = value[templabel];
                                                } else {
                                                    value.label = LegGeneralCtrl.ePage.Entities.Header.Data.Title;
                                                    value[LegGeneralCtrl.ePage.Entities.Header.Data.Title] = value[templabel];
                                                    delete value[templabel];
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                            if ($state.current.url == "/leg") {
                                helperService.refreshGrid();
                            }
                        }
                    } else {
                        toastr.error("Could Not Save");
                    }
                });
            }
        }

        Init();
    }
})();
