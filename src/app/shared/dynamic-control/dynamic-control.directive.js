(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicControl", DynamicControlDirective);

    DynamicControlDirective.$inject = [];

    function DynamicControlDirective() {
        let exports = {
            restrict: 'EA',
            templateUrl: 'app/shared/dynamic-control/dynamic-control.html',
            controller: "DynamicControlController",
            controllerAs: "DynamicControlCtrl",
            scope: {
                input: '=',
                mode: '@',
                listMode: "=",
                viewType: "=",
                dataentryName: "=",
                configName: "=",
                current: "=",
                controlsData: "&",
                controlStyle: '@',
                isSaveBtn: "=",
                selectedGridRow: "&",
                pkey: "=",
                baseFilterFields: "=",
                accessControl: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("DynamicControlController", DynamicControlController);

    DynamicControlController.$inject = ["$location", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "$injector", "appConfig", "dynamicLookupConfig", "confirmation"];

    function DynamicControlController($location, $timeout, APP_CONSTANT, apiService, authService, helperService, $injector, appConfig, dynamicLookupConfig, confirmation) {
        let DynamicControlCtrl = this;

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

            // if ($location.path().indexOf('/single-record-view/') != -1) {
            //     // var _Config = $injector.get(DynamicControlCtrl.configName);
            //     var Entity = $location.path().split("/").pop();
            //     var label = JSON.parse(helperService.decryptData(Entity));
            //     DynamicControlCtrl.WorkItemId = label.WorkitemID;
            //     var _Config = $injector.get(label.ConfigName);
            //     if (DynamicControlCtrl.ePage.Masters.Pkey == undefined) {
            //         DynamicControlCtrl.ePage.Masters.Pkey = label.Pkey;
            //     }
            //     _Config.TabList.map(function (val, key) {
            //         if (val.label == label.Code) {
            //             DynamicControlCtrl.currentObj = val[label.Code].ePage.Entities;
            //             DynamicControlCtrl.currentObj.Header.Data.UIDynamic = {}
            //         }
            //     });
            // }

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
            DynamicControlCtrl.ePage.Masters.GetAppCounter = GetAppCounter;
            DynamicControlCtrl.ePage.Masters.Refresh = Refresh;
            DynamicControlCtrl.ePage.Masters.Delete = Delete;
            DynamicControlCtrl.ePage.Masters.OnModelChange = OnModelChange;

            // DatePicker
            DynamicControlCtrl.ePage.Masters.DatePicker = {};
            DynamicControlCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DynamicControlCtrl.ePage.Masters.DatePicker.isOpen = [];
            DynamicControlCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DynamicControlCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DynamicControlCtrl.ePage.Masters.SaveBtnText = "Save";
            DynamicControlCtrl.ePage.Masters.IsDisableDeletBtn = false;
            DynamicControlCtrl.ePage.Masters.DeleteBtnText = "Delete";

            DynamicControlCtrl.ePage.Masters.BaseFilterFields = DynamicControlCtrl.baseFilterFields ? DynamicControlCtrl.baseFilterFields : {};

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
            if (DynamicControlCtrl.accessControl && DynamicControlCtrl.accessControl.length > 0) {
                DynamicControlCtrl.input.Entities.map(function (value1, key1) {
                    value1.ConfigData.map(function (value2, key2) {
                        DynamicControlCtrl.accessControl.map(function (value3, key3) {
                            if (value3.Value === value2.DataEntryPK) {
                                value2.Include = false;
                                value2.Include_FK = value3.PK;
                            }
                        });
                    });
                });
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            DynamicControlCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function EditCall(entityObj) {
            DynamicControlCtrl.ePage.Masters.IsGetById = false;
            var _input = {
                "EntityName": entityObj.EntityName
            };
            let _url = appConfig.Entities.DataEntry.API.FindGetById.Url;
            let _method = "post";

            if (DynamicControlCtrl.pkey) {
                _input.EntityRefKey = DynamicControlCtrl.pkey;

                if (DynamicControlCtrl.input.UpsertURL) {
                    if (typeof DynamicControlCtrl.input.UpsertURL == "string") {
                        _url = JSON.parse(DynamicControlCtrl.input.UpsertURL).R;
                    }
                }

                if (_url.indexOf("DataEntry/Dynamic/FindGetById") === -1) {
                    _url = _url + DynamicControlCtrl.pkey;
                    _method = "get";
                }

                if (_method == "post") {
                    apiService.post("eAxisAPI", _url, _input).then(function (response) {
                        if (response.data.Response) {
                            entityObj.Data = response.data.Response;

                            if ($location.path().indexOf('/single-record-view/') != -1) {
                                UIDynamicFunData();
                            }
                        }

                        GetAppCounter(entityObj);
                        GetUIRestrictionList(entityObj);
                        DynamicControlCtrl.ePage.Masters.IsGetById = true;
                    });
                } else {
                    apiService.get("eAxisAPI", _url).then(function (response) {
                        if (response.data.Response) {
                            entityObj.Data = response.data.Response;

                            if ($location.path().indexOf('/single-record-view/') != -1) {
                                UIDynamicFunData();
                            }
                        }

                        GetAppCounter(entityObj);
                        GetUIRestrictionList(entityObj);
                        DynamicControlCtrl.ePage.Masters.IsGetById = true;
                    });
                }
            } else {
                GetAppCounter(entityObj);
                GetUIRestrictionList(entityObj);
            }
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

            OnModelChange($item);
        }

        function Save() {
            DynamicControlCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DynamicControlCtrl.ePage.Masters.SaveBtnText = "Please Wait...";
            if (DynamicControlCtrl.ePage.Masters.UIRestrictionList && DynamicControlCtrl.ePage.Masters.UIRestrictionList.length > 0) {
                PrepareUIManipulation();
            }

            $timeout(() => {
                let _item = {
                    Entities: DynamicControlCtrl.input.Entities,
                    ValidationInput: DynamicControlCtrl.ePage.Masters.ValidataionInput,
                    IsEnableSave: true
                };
                DynamicControlCtrl.controlsData({
                    $item: _item
                });
            });

            $timeout(() => {
                DynamicControlCtrl.ePage.Masters.IsDisableSaveBtn = false;
                DynamicControlCtrl.ePage.Masters.SaveBtnText = "Save";
            }, 2000);
        }

        function Refresh() {
            if (DynamicControlCtrl.ePage.Masters.UIRestrictionList && DynamicControlCtrl.ePage.Masters.UIRestrictionList.length > 0) {
                PrepareUIManipulation();
            }

            $timeout(() => {
                let _item = {
                    Entities: DynamicControlCtrl.input.Entities,
                    ValidationInput: DynamicControlCtrl.ePage.Masters.ValidataionInput
                };
                DynamicControlCtrl.controlsData({
                    $item: _item
                });
            });
        }

        function Delete() {
            let _modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, _modalOptions).then(result => {
                DynamicControlCtrl.ePage.Masters.IsDisableDeletBtn = true;
                DynamicControlCtrl.ePage.Masters.DeleteBtnText = "Please Wait...";
                let _item = {
                    Entities: DynamicControlCtrl.input.Entities,
                    IsDelete: true
                };
                DynamicControlCtrl.controlsData({
                    $item: _item
                });
                $timeout(() => {
                    DynamicControlCtrl.ePage.Masters.IsDisableDeletBtn = false;
                    DynamicControlCtrl.ePage.Masters.DeleteBtnText = "Delete";
                }, 2000);
            }, () => {});
        }

        function OnModelChange($item) {
            if (DynamicControlCtrl.input.OtherConfig.DetailsPage && DynamicControlCtrl.input.OtherConfig.DetailsPage.IsImmediateValidation) {
                Refresh();
            }
        }

        // TC Grid
        function SelectedGridRow($item) {
            DynamicControlCtrl.selectedGridRow({
                $item: $item
            });
        }

        // Generate counter number
        function GetAppCounter(entity) {
            if (!entity.Data) {
                entity.Data = {};
            }
            let _pk, _propertyName;
            DynamicControlCtrl.input.Entities.map(value1 => {
                value1.ConfigData.map(value2 => {
                    if (value2.IsKey && (value2.Type == "D" || value2.Type == "B")) {
                        if (entity.Data[value2.PropertyName]) {
                            _pk = entity.Data[value2.PropertyName];
                        } else if (entity.Data[value2.FieldName]) {
                            _pk = entity.Data[value2.FieldName];
                        }
                    }
                    if (value2.AttributesDetails.UIControl == "counter") {
                        _propertyName = value2.PropertyName;
                    }
                });
            });
            if (!_pk && _propertyName) {
                DynamicControlCtrl.input
                apiService.get("eAxisAPI", appConfig.Entities.AppCounter.API.GetAppcount.Url + DynamicControlCtrl.input.DataEntryName).then(response => {
                    if (response.data.Response) {
                        entity.Data[_propertyName] = response.data.Response;
                    }
                });
            }
        }

        // UI Manipulation
        function GetUIRestrictionList($item) {
            DynamicControlCtrl.ePage.Masters.UIRestrictionList = undefined;
            let _filter = {
                DEM_DataEntry_PK: DynamicControlCtrl.input.DataEntry_PK,
                Mode: "D"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYNUIRestriction.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYNUIRestriction.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    DynamicControlCtrl.ePage.Masters.UIRestrictionList = response.data.Response;

                    PrepareUIManipulation();
                } else {
                    DynamicControlCtrl.ePage.Masters.UIRestrictionList = [];
                }
            });
        }

        function PrepareUIManipulation() {
            DynamicControlCtrl.ePage.Masters.ValidataionInput = undefined;
            DynamicControlCtrl.ePage.Masters.UIRestrictionList.map(value => {
                let _data = {};
                DynamicControlCtrl.input.Entities.map(value => {
                    value.ConfigData.map(x => {
                        DynamicControlCtrl.ePage.Masters.BaseFilterFields["IsDisabled" + x.FieldName] = false;
                        DynamicControlCtrl.ePage.Masters.BaseFilterFields["IsInVisible" + x.FieldName] = false;
                    });
                    _data = {
                        ..._data,
                        ...value.Data
                    };
                });

                setTimeout(() => {
                    if (value.Expression && value.Restriction) {
                        let _exp = value.Expression;
                        let ExpressionResult = new Function("Data", "return " + _exp);
                        let _evalResult = ExpressionResult(_data);
                        if (_evalResult == true) {
                            let _restriction = (typeof value.Restriction == "string") ? JSON.parse(value.Restriction) : value.Restriction;

                            if (_restriction && _restriction.length > 0) {
                                _restriction.map(value1 => {
                                    if (value1.Disabled == true) {
                                        DynamicControlCtrl.ePage.Masters.BaseFilterFields["IsDisabled" + value1.FieldName] = true;
                                    }
                                    if (value1.InVisible == true) {
                                        DynamicControlCtrl.ePage.Masters.BaseFilterFields["IsInVisible" + value1.FieldName] = true;
                                    }
                                });
                            }
                            if (value.OnSubmit) {
                                let _validataionInput = (typeof value.OnSubmit == "string") ? JSON.parse(value.OnSubmit) : value.OnSubmit;

                                DynamicControlCtrl.ePage.Masters.ValidataionInput = angular.copy(_validataionInput);
                            }
                        }
                    }
                });
            });
        }

        Init();
    }
})();