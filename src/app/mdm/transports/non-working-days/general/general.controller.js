(function () {
    "use strict";

    angular
        .module("Application")
        .controller("NwdaysGeneralController", NwdaysGeneralController);

    NwdaysGeneralController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "nonWorkingDaysConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function NwdaysGeneralController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, nonWorkingDaysConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var NwdaysGeneralCtrl = this;

        function Init() {
            var currentNWDays = NwdaysGeneralCtrl.currentNWDays[NwdaysGeneralCtrl.currentNWDays.label].ePage.Entities;

            NwdaysGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "NWDays_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentNWDays,
            };

            NwdaysGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            NwdaysGeneralCtrl.ePage.Masters.Lineslist = true;
            NwdaysGeneralCtrl.ePage.Masters.Config = nonWorkingDaysConfig;
            NwdaysGeneralCtrl.ePage.Meta.IsLoading = false;

            NwdaysGeneralCtrl.ePage.Masters.emptyText = "-";
            NwdaysGeneralCtrl.ePage.Masters.selectedRow = -1;

            NwdaysGeneralCtrl.ePage.Masters.HeaderName = '';

            NwdaysGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            NwdaysGeneralCtrl.ePage.Masters.SelectedFromZone = SelectedFromZone;
            NwdaysGeneralCtrl.ePage.Masters.SelectedToZone = SelectedToZone;
            NwdaysGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            // DatePicker
            NwdaysGeneralCtrl.ePage.Masters.DatePicker = {};
            NwdaysGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            NwdaysGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            NwdaysGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            NwdaysGeneralCtrl.ePage.Masters.Validation = Validation;
            NwdaysGeneralCtrl.ePage.Masters.SaveButtonText = "Save";

            GetCfxTypeList()
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            NwdaysGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            angular.forEach(NwdaysGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                NwdaysGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), NwdaysGeneralCtrl.currentNWDays.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                NwdaysGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), NwdaysGeneralCtrl.currentNWDays.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            NwdaysGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function setSelectedRow(index) {
            NwdaysGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function SelectedFromZone(item) {
            if (item.data) {
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.data.entity.PK;
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.data.entity.Name;
            } else {
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.PK;
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.Name;
            }
        }

        function SelectedToZone(item) {
            if (item.data) {
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.data.entity.PK;
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.data.entity.Name;
            } else {
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.PK;
                NwdaysGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.Name;
            }
        }

        function OnChangeServiceType(serviceType) {
            angular.forEach(NwdaysGeneralCtrl.ePage.Masters.servicetypelistSource, function (value, key) {
                if (value.AddRef1Code == serviceType) {
                    NwdaysGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    NwdaysGeneralCtrl.ePage.Entities.Header.Data.ServiceType = value.AddRef1Code;
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
                        NwdaysGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        NwdaysGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
            NwdaysGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (NwdaysGeneralCtrl.ePage.Entities.Header.Validations) {
                NwdaysGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(NwdaysGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                NwdaysGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(NwdaysGeneralCtrl.currentNWDays);
            }
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                apiService.post("eAxisAPI", NwdaysGeneralCtrl.ePage.Entities.Header.API.InsertNWDays.Url, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        // label bind
                        toastr.success("Saved Successfully");
                        var _index = nonWorkingDaysConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(NwdaysGeneralCtrl.currentNWDays[NwdaysGeneralCtrl.currentNWDays.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            apiService.get("eAxisAPI", 'MstNonWorkingDays/GetById/' + response.data.Response[0].PK).then(function (response) {
                                if (response.data.Response) {
                                    nonWorkingDaysConfig.TabList[_index][nonWorkingDaysConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    nonWorkingDaysConfig.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = NwdaysGeneralCtrl.ePage.Entities.Header.Data.Title;
                                                value[NwdaysGeneralCtrl.ePage.Entities.Header.Data.Title] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                }
                            });
                            nonWorkingDaysConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/non-working-days") {
                                helperService.refreshGrid();
                            }
                        }
                    } else {
                        toastr.error("Could Not Save");
                    }
                });
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                apiService.post("eAxisAPI", NwdaysGeneralCtrl.ePage.Entities.Header.API.UpdateNWDays.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Saved Successfully");
                        var _index = nonWorkingDaysConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(NwdaysGeneralCtrl.currentNWDays[NwdaysGeneralCtrl.currentNWDays.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            apiService.get("eAxisAPI", 'MstNonWorkingDays/GetById/' + response.data.Response.PK).then(function (response) {
                                if (response.data.Response) {
                                    nonWorkingDaysConfig.TabList[_index][nonWorkingDaysConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                                }
                            });
                            if ($state.current.url == "/non-working-days") {
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
