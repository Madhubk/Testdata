(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicControlController", DynamicControlController);

    DynamicControlController.$inject = ["$location", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "$injector", "appConfig", "dynamicLookupConfig"];

    function DynamicControlController($location, $timeout, APP_CONSTANT, apiService, authService, helperService, $injector, appConfig, dynamicLookupConfig) {
        var DynamicControlCtrl = this;

        function Init() {
            DynamicControlCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Control",
                "Masters": {},
                "Meta": helperService.metaBase()
            };

            if (DynamicControlCtrl.pkey) {
                DynamicControlCtrl.ePage.Masters.Pkey = DynamicControlCtrl.pkey;
            }

            if ($location.path().indexOf('/single-record-view/') != -1) {
                // var _Config = $injector.get('shipmentConfig');
                // var _Config = $injector.get(DynamicControlCtrl.configName);
                var Entity = $location.path().split("/").pop();
                var label = JSON.parse(helperService.decryptData(Entity));
                DynamicControlCtrl.WorkItemId = label.WorkitemID;
                var _Config = $injector.get(label.ConfigName);
                if (DynamicControlCtrl.ePage.Masters.Pkey == undefined) {
                    DynamicControlCtrl.ePage.Masters.Pkey = label.Pkey;
                }
                _Config.TabList.map(function (val, key) {
                    if (val.label == label.Code) {
                        DynamicControlCtrl.currentObj = val[label.Code].ePage.Entities;
                        DynamicControlCtrl.currentObj.Header.Data.UIDynamic = {}
                    }
                });
            }

            DynamicControlCtrl.ePage.Masters.TenantCode = authService.getUserInfo().TenantCode;
            DynamicControlCtrl.ePage.Masters.AppCode = authService.getUserInfo().AppCode;
            DynamicControlCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;
            DynamicControlCtrl.ePage.Masters.ModeFilter = ModeFilter;
            DynamicControlCtrl.ePage.Masters.EditCall = EditCall;
            DynamicControlCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            DynamicControlCtrl.ePage.Masters.AutoCompleteList = AutoCompleteList;
            DynamicControlCtrl.ePage.Masters.SelectedData = SelectedData;
            DynamicControlCtrl.ePage.Masters.Save = Save;
            DynamicControlCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // DatePicker
            DynamicControlCtrl.ePage.Masters.DatePicker = {};
            DynamicControlCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DynamicControlCtrl.ePage.Masters.DatePicker.isOpen = [];
            DynamicControlCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DynamicControlCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DynamicControlCtrl.ePage.Masters.SaveBtnText = "Save";

            DynamicControlCtrl.ePage.Masters.ViewType = DynamicControlCtrl.viewType;
            if (!DynamicControlCtrl.ePage.Masters.ViewType) {
                if (DynamicControlCtrl.mode == "S") {
                    DynamicControlCtrl.ePage.Masters.ViewType = "1";
                } else {
                    DynamicControlCtrl.ePage.Masters.ViewType = "2";
                }
            }

            if (!DynamicControlCtrl.input && DynamicControlCtrl.dataentryName && DynamicControlCtrl.mode == "S") {
                GetDynamicControl();
            } else if (DynamicControlCtrl.input) {
                if (DynamicControlCtrl.mode == "S" && DynamicControlCtrl.listMode == '1') {
                    GetDynamicAccessControl();
                }
                GetDataEntryDynamicList();
            }
        }

        function GetDynamicControl() {
            var _filter = {
                DataEntryName: DynamicControlCtrl.dataentryName,
                IsRoleBassed: "false",
                IsAccessBased: "false"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    DynamicControlCtrl.input = response.data.Response;
                    if (DynamicControlCtrl.mode == "S" && DynamicControlCtrl.listMode == '1') {
                        GetDynamicAccessControl();
                    }
                }
            });
        }

        function GetDataEntryDynamicList() {
            if (DynamicControlCtrl.mode == "D") {
                DynamicControlCtrl.input.Entities.map(function (value, key) {
                    EditCall(value);
                });
            }
        }

        function GetDynamicAccessControl() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": DynamicControlCtrl.input.DataEntryName.toUpperCase() + "_FILTERDISLIKE",
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "TypeCode": DynamicControlCtrl.input.DataEntry_PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DynamicControlCtrl.input.Entities.map(function (value1, key1) {
                            value1.ConfigData.map(function (value2, key2) {
                                response.data.Response.map(function (value3, key3) {
                                    if (value3.Value === value2.DataEntryPK) {
                                        value2.Include = false;
                                        value2.Include_FK = value3.PK;
                                    }
                                });
                            });
                        });
                    }
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            DynamicControlCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function EditCall(entityObj) {
            var _input = {
                "EntityName": entityObj.EntityName
            };

            if (DynamicControlCtrl.pkey) {
                _input.EntityRefKey = DynamicControlCtrl.pkey;
            }

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response[0] != null) {
                        entityObj.Data = response.data.Response[0];
                        if ($location.path().indexOf('/single-record-view/') != -1) {
                            UIDynamicFunData();
                        }
                    }
                }
            });
        }

        function UIDynamicFunData() {
            var _entityArray = [];
            DynamicControlCtrl.input.Entities.map(function (value, key) {
                var _entityObj = {
                    "EntityName": value.EntityName,
                    "Data": value.Data
                };
                _entityArray.push(_entityObj);
            });

            DynamicControlCtrl.currentObj.Header.Data.UIDynamic.TaskName = DynamicControlCtrl.input.DataEntryName;
            DynamicControlCtrl.currentObj.Header.Data.UIDynamic.PrcoessName = DynamicControlCtrl.input.ProcessName;
            DynamicControlCtrl.currentObj.Header.Data.UIDynamic.WorkitemID = DynamicControlCtrl.WorkItemId;
            DynamicControlCtrl.currentObj.Header.Data.UIDynamic.IsComplete = 'false';
            DynamicControlCtrl.currentObj.Header.Data.UIDynamic.Key = DynamicControlCtrl.ePage.Masters.Pkey;
            DynamicControlCtrl.currentObj.Header.Data.UIDynamic.Entities = _entityArray;
        }

        function ModeFilter(item) {
            return item.Type === DynamicControlCtrl.mode || item.Type === "B";
        }

        function AutoCompleteOnSelect($item, $model, $label, obj, entity) {
            entity.Data[obj.AttributesDetails.EntityKey] = $item[obj.AttributesDetails.UIValue];

            if (entity.Data != null) {
                if (obj.Additional) {
                    for (var j = 0; j < obj.Additional.length; j++) {
                        entity.Data[obj.Additional[j].EntityField] = $item[obj.Additional[j].LookupField];
                    }
                }
            }
        }

        function AutoCompleteList(FieldName, Value, obj, entity) {
            var inputObj = {};
            inputObj.SearchInput = [];

            if (Value != "#") {
                if (entity.Data != null) {
                    for (var i = 0; i < obj.PossibleFilters.length; i++) {
                        if (obj.PossibleFilters[i].FieldName != obj.AttributesDetails.UIDisplay) {
                            if (entity.Data[obj.PossibleFilters[i].FieldName] != undefined) {
                                if (entity.Data[obj.PossibleFilters[i].FieldName]) {
                                    obj.PossibleFilters[i].Value = entity.Data[obj.PossibleFilters[i].FieldName];
                                } else {
                                    obj.PossibleFilters[i].Value = "";
                                }
                            }
                        } else {
                            obj.PossibleFilters[i].Value = Value;
                            inputObj.SearchInput.push(obj.PossibleFilters[i]);
                        }
                    }
                }
            }

            inputObj.FilterID = obj.AttributesDetails.FilterID;
            inputObj.DBObjectName = obj.AttributesDetails.DBSource;

            return apiService.post("eAxisAPI", obj.AttributesDetails.APIUrl, inputObj).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                } else {
                    return [];
                }
            });
        }

        function SelectedData($item, Entity, ControlKey) {
            var _index = -1,
                _lookupConfig;
            for (var x in dynamicLookupConfig.Entities) {
                (ControlKey) ? _index = x.indexOf(ControlKey): _index = x.indexOf(ControlKey);

                if (_index !== -1) {
                    _lookupConfig = dynamicLookupConfig.Entities[x];
                }
            }
            if (!Entity.Data) {
                Entity.Data = {}
            }

            _lookupConfig.getValues.map(function (value, key) {
                Entity.Data[value.eField] = $item.data.entity[_lookupConfig.getValues[key].sField];
            });
        }

        function Save() {
            DynamicControlCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DynamicControlCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            DynamicControlCtrl.controlsData({
                $item: DynamicControlCtrl.input.Entities
            });

            $timeout(function () {
                DynamicControlCtrl.ePage.Masters.IsDisableSaveBtn = false;
                DynamicControlCtrl.ePage.Masters.SaveBtnText = "Save";
            }, 1000);
        }

        // TC Grid
        function SelectedGridRow($item) {
            DynamicControlCtrl.selectedGridRow({
                $item: $item
            });
        }

        Init();
    }
})();
