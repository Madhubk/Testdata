(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RegionGeneralController", RegionGeneralController);

    RegionGeneralController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "regionConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function RegionGeneralController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, regionConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var RegionGeneralCtrl = this;

        function Init() {
            var currentRegion = RegionGeneralCtrl.currentRegion[RegionGeneralCtrl.currentRegion.label].ePage.Entities;

            RegionGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Region_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRegion,
            };

            RegionGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            RegionGeneralCtrl.ePage.Masters.Lineslist = true;
            RegionGeneralCtrl.ePage.Masters.Config = regionConfig;
            RegionGeneralCtrl.ePage.Meta.IsLoading = false;

            RegionGeneralCtrl.ePage.Masters.emptyText = "-";
            RegionGeneralCtrl.ePage.Masters.selectedRow = -1;

            RegionGeneralCtrl.ePage.Masters.HeaderName = '';

            RegionGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            RegionGeneralCtrl.ePage.Masters.SelectedFromZone = SelectedFromZone;
            RegionGeneralCtrl.ePage.Masters.SelectedToZone = SelectedToZone;
            RegionGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            // DatePicker
            RegionGeneralCtrl.ePage.Masters.DatePicker = {};
            RegionGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            RegionGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            RegionGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            RegionGeneralCtrl.ePage.Masters.Validation = Validation;
            RegionGeneralCtrl.ePage.Masters.SaveButtonText = "Save";

            GetCfxTypeList()
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            RegionGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            angular.forEach(RegionGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                RegionGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), RegionGeneralCtrl.currentRegion.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                RegionGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), RegionGeneralCtrl.currentRegion.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            RegionGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function setSelectedRow(index) {
            RegionGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function SelectedFromZone(item) {
            if (item.data) {
                RegionGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.data.entity.PK;
                RegionGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.data.entity.Name;
            } else {
                RegionGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.PK;
                RegionGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.Name;
            }
        }

        function SelectedToZone(item) {
            if (item.data) {
                RegionGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.data.entity.PK;
                RegionGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.data.entity.Name;
            } else {
                RegionGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.PK;
                RegionGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.Name;
            }
        }

        function OnChangeServiceType(serviceType) {
            angular.forEach(RegionGeneralCtrl.ePage.Masters.servicetypelistSource, function (value, key) {
                if (value.AddRef1Code == serviceType) {
                    RegionGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    RegionGeneralCtrl.ePage.Entities.Header.Data.ServiceType = value.AddRef1Code;
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
                        RegionGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        RegionGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
            RegionGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (RegionGeneralCtrl.ePage.Entities.Header.Validations) {
                RegionGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(RegionGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                RegionGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(RegionGeneralCtrl.currentRegion);
            }
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                apiService.post("eAxisAPI", RegionGeneralCtrl.ePage.Entities.Header.API.InsertRegion.Url, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        RegionGeneralCtrl.ePage.Entities.Header.Data = response.data.Response[0];
                        toastr.success("Save Successfully");
                        apiService.get("eAxisAPI", RegionGeneralCtrl.ePage.Entities.Header.API.GetByID.Url + RegionGeneralCtrl.ePage.Entities.Header.Data.PK).then(function SuccessCallback(response) {
                            RegionGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                        });
                        // label bind
                        var _index = regionConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(RegionGeneralCtrl.currentRegion[RegionGeneralCtrl.currentRegion.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            apiService.get("eAxisAPI", 'MstRegion/GetById/' + RegionGeneralCtrl.currentRegion[RegionGeneralCtrl.currentRegion.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    regionConfig.TabList[_index][regionConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    regionConfig.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = RegionGeneralCtrl.ePage.Entities.Header.Data.Code;
                                                value[RegionGeneralCtrl.ePage.Entities.Header.Data.Code] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                }
                            });
                            regionConfig.TabList[_index].isNew = false;
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
                apiService.post("eAxisAPI", RegionGeneralCtrl.ePage.Entities.Header.API.UpdateRegion.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Save Successfully");
                        RegionGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                        apiService.get("eAxisAPI", RegionGeneralCtrl.ePage.Entities.Header.API.GetByID.Url + RegionGeneralCtrl.ePage.Entities.Header.Data.PK).then(function SuccessCallback(response) {
                            RegionGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                        });
                    } else {
                        toastr.error("Could Not Save");
                    }
                });
            }
        }

        Init();
    }
})();
