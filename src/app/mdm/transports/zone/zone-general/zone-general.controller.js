(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ZoneGeneralController", ZoneGeneralController);

    ZoneGeneralController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "zoneConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function ZoneGeneralController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, zoneConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var ZoneGeneralCtrl = this;

        function Init() {
            var currentZone = ZoneGeneralCtrl.currentZone[ZoneGeneralCtrl.currentZone.label].ePage.Entities;

            ZoneGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Zone_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentZone,
            };

            ZoneGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            ZoneGeneralCtrl.ePage.Masters.Lineslist = true;
            ZoneGeneralCtrl.ePage.Masters.Config = zoneConfig;
            ZoneGeneralCtrl.ePage.Meta.IsLoading = false;

            ZoneGeneralCtrl.ePage.Masters.emptyText = "-";
            ZoneGeneralCtrl.ePage.Masters.selectedRow = -1;

            ZoneGeneralCtrl.ePage.Masters.HeaderName = '';
            ZoneGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            ZoneGeneralCtrl.ePage.Masters.OnChangeZoneType = OnChangeZoneType;
            ZoneGeneralCtrl.ePage.Masters.SelectedFromZone = SelectedFromZone;
            ZoneGeneralCtrl.ePage.Masters.SelectedToZone = SelectedToZone;
            ZoneGeneralCtrl.ePage.Masters.SelectedCountry = SelectedCountry;
            ZoneGeneralCtrl.ePage.Masters.OnChangeState = OnChangeState;
            ZoneGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ZoneGeneralCtrl.ePage.Masters.StateEmpty = StateEmpty;
            ZoneGeneralCtrl.ePage.Masters.StateListSource = "";
            ZoneGeneralCtrl.ePage.Masters.Validation = Validation;
            ZoneGeneralCtrl.ePage.Masters.SaveButtonText = "Save";

            GetCfxTypeList()
            if (!ZoneGeneralCtrl.currentZone.isNew) {
                getState()
            }
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            ZoneGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            angular.forEach(ZoneGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ZoneGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ZoneGeneralCtrl.currentZone.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ZoneGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ZoneGeneralCtrl.currentZone.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function setSelectedRow(index) {
            ZoneGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function SelectedCountry(item) {
            if (item.data) {
                ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_Code = item.data.entity.Code;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_Desc = item.data.entity.Desc;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_FK = item.data.entity.PK;
                getState()
            } else {
                ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_Code = item.Code;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_Desc = item.Desc;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_FK = item.PK;
                getState()
            }
            ZoneGeneralCtrl.ePage.Masters.OnChangeValues(ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_Code, "E5537", false, undefined);
        }

        function getState() {
            var _filter = {
                "CountryCode": ZoneGeneralCtrl.ePage.Entities.Header.Data.COU_Code,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ZoneGeneralCtrl.ePage.Entities.Header.API.CountryState.FilterID,
            };
            apiService.post("eAxisAPI", ZoneGeneralCtrl.ePage.Entities.Header.API.CountryState.Url, _input).then(function (response) {
                ZoneGeneralCtrl.ePage.Masters.StateListSource = response.data.Response;
            });
        }

        function OnChangeState(state) {
            angular.forEach(ZoneGeneralCtrl.ePage.Masters.StateListSource, function (value, key) {
                if (value.Code == state) {
                    ZoneGeneralCtrl.ePage.Entities.Header.Data.STA_Code = value.Code;
                    ZoneGeneralCtrl.ePage.Entities.Header.Data.STA_Description = value.Description;
                    ZoneGeneralCtrl.ePage.Entities.Header.Data.STA_FK = value.PK;
                }
            });
            ZoneGeneralCtrl.ePage.Masters.OnChangeValues(ZoneGeneralCtrl.ePage.Entities.Header.Data.STA_Code, "E5538", false, undefined);
        }

        function StateEmpty(){
            ZoneGeneralCtrl.ePage.Masters.StateListSource = "";
        }

        function SelectedFromZone(item) {
            if (item.data) {
                ZoneGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.data.entity.PK;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.data.entity.Name;
            } else {
                ZoneGeneralCtrl.ePage.Entities.Header.Data.TMZ_FromZoneFK = item.PK;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.FromZoneName = item.Name;
            }
        }

        function SelectedToZone(item) {
            if (item.data) {
                ZoneGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.data.entity.PK;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.data.entity.Name;
            } else {
                ZoneGeneralCtrl.ePage.Entities.Header.Data.TMZ_ToZoneFK = item.PK;
                ZoneGeneralCtrl.ePage.Entities.Header.Data.ToZoneName = item.Name;
            }
        }

        function OnChangeServiceType(serviceType) {
            angular.forEach(ZoneGeneralCtrl.ePage.Masters.servicetypelistSource, function (value, key) {
                if (value.AddRef1Code == serviceType) {
                    ZoneGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    ZoneGeneralCtrl.ePage.Entities.Header.Data.ServiceType = value.AddRef1Code;
                }
            });
        }

        function OnChangeZoneType(ZoneType) {

        }

        function GetCfxTypeList() {
            var typeCodeList = ["Zone_type", "ManifestType", "State"];
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
                        ZoneGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ZoneGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
            ZoneGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ZoneGeneralCtrl.ePage.Entities.Header.Validations) {
                ZoneGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(ZoneGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ZoneGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ZoneGeneralCtrl.currentZone);
            }
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                apiService.post("eAxisAPI", ZoneGeneralCtrl.ePage.Entities.Header.API.InsertZone.Url, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        ZoneGeneralCtrl.ePage.Entities.Header.Data = response.data.Response[0];
                        toastr.success("Saved Successfully");
                        apiService.get("eAxisAPI", ZoneGeneralCtrl.ePage.Entities.Header.API.GetByID.Url + ZoneGeneralCtrl.ePage.Entities.Header.Data.PK).then(function SuccessCallback(response) {
                            ZoneGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                            // Label Bind
                            var _index = zoneConfig.TabList.map(function (value, key) {
                                return value[value.label].ePage.Entities.Header.Data.PK;
                            }).indexOf(ZoneGeneralCtrl.currentZone[ZoneGeneralCtrl.currentZone.label].ePage.Entities.Header.Data.PK);

                            if (_index !== -1) {
                                apiService.get("eAxisAPI", 'MstZone/GetById/' + ZoneGeneralCtrl.currentZone[ZoneGeneralCtrl.currentZone.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                    if (response.data.Response) {
                                        zoneConfig.TabList[_index][zoneConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                        zoneConfig.TabList.map(function (value, key) {
                                            if (_index == key) {
                                                if (value.New) {
                                                    // if (value.code == ZoneGeneralCtrl.ePage.Entities.Header.Data.ZoneNumber) {
                                                    value.label = ZoneGeneralCtrl.ePage.Entities.Header.Data.Name;
                                                    value[ZoneGeneralCtrl.ePage.Entities.Header.Data.Name] = value.New;
                                                    delete value.New;
                                                    // }
                                                }
                                            }
                                        });
                                    }
                                });
                                zoneConfig.TabList[_index].isNew = false;
                                if ($state.current.url == "/zone") {
                                    helperService.refreshGrid();
                                }
                            }
                        });
                    } else {
                        toastr.error("Could Not Save");
                    }
                });
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                apiService.post("eAxisAPI", ZoneGeneralCtrl.ePage.Entities.Header.API.UpdateZone.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Saved Successfully");
                        ZoneGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                        apiService.get("eAxisAPI", ZoneGeneralCtrl.ePage.Entities.Header.API.GetByID.Url + ZoneGeneralCtrl.ePage.Entities.Header.Data.PK).then(function SuccessCallback(response) {
                            ZoneGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
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
