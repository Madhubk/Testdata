(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicList", DynamicList);

    function DynamicList() {
        let _exports = {
            restrict: "EA",
            templateUrl: "app/shared/dynamic-list/dynamic-list.html",
            controller: "DynamicListController",
            controllerAs: "DynamicListCtrl",
            bindToController: true,
            scope: {
                mode: "=",
                dataentryName: "=",
                dataentryObject: "=",
                defaultFilter: "=",
                baseFilter: "=",
                selectedGridRow: "&",
                lookupConfigControlKey: "=",
                isNewButton: "=",
                overrideUrl: "=",
                validateFilterInput: "&",
                isValidateFilter: "=",
                organizationCode: "="
            }
        };
        return _exports;
    }

    angular
        .module("Application")
        .controller("DynamicListController", DynamicListController);

    DynamicListController.$inject = ["$scope", "$compile", "$filter", "$q", "helperService", "apiService", "authService", "appConfig", "dynamicLookupConfig", "toastr", "confirmation", "errorWarningService", "APP_CONSTANT"];

    function DynamicListController($scope, $compile, $filter, $q, helperService, apiService, authService, appConfig, dynamicLookupConfig, toastr, confirmation, errorWarningService, APP_CONSTANT) {
        let DynamicListCtrl = this;
        // Mode:  1 -> Main Page, 2 -> Lookup, 3 -> Attach

        function Init() {
            DynamicListCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": DynamicListCtrl.config
            };

            try {
                DynamicListCtrl.ePage.Masters.CheckControlAccess = CheckControlAccess;
                InitDataEntry();
            } catch (error) {
                console.log(error);
            }
        }

        function CheckControlAccess(controlId) {
            return helperService.checkUIControl(controlId);
        }

        // #region Header
        function InitHeader() {
            DynamicListCtrl.ePage.Masters.Header = {
                CustomizeGrid: {
                    ListSource: angular.copy(DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.GridConfig.Header),
                    IsAutoListing: true,
                    Save: SaveUserBasedGridColumn,
                    SaveBtnTxt: "Save",
                    IsDisableSaveBtn: false,
                    DeleteBtnTxt: "Reset",
                    IsDisableDeleteBtn: false,
                    Delete: DeleteUserBasedGridColumn,
                    SelectAllColumn: SelectAllColumn,
                    IsSelectAll: false
                },
                Shortcut: {
                    ListSource: [],
                    View: ViewShortcutFilter,
                    GetCount: GetFavoriteCount
                },
                SystemFilter: {
                    ListSource: [],
                    View: ViewSystemFilter
                },
                UserFilter: {
                    ListSource: [],
                    Delete: DeleteUserFilter,
                    Update: UpdateUserFilter,
                    View: ViewUserFilter
                },
                Export: {
                    ListSource: []
                },
                Recent: {
                    ListSource: [],
                    Open: OpenRecentItem
                },
                Schedule: {
                    ListSource: [],
                    Delete: DeleteSchedule,
                    View: ViewScheduleFilter
                },
                OnStarClick: OnStarClick,
                SetAsDeafultFilter: SetAsDeafultFilter,
            };

            // Buttons
            DynamicListCtrl.ePage.Masters.Header.Refresh = OnRefreshBtnClick;
            DynamicListCtrl.ePage.Masters.Header.Reset = OnResetBtnClick;
            DynamicListCtrl.ePage.Masters.Header.Attach = OnAttachBtnClick;
            DynamicListCtrl.ePage.Masters.Header.New = OnNewBtnClick;
            DynamicListCtrl.ePage.Masters.Header.Filter = OnFilterBtnClick;
            helperService.refreshGrid = OnRefreshBtnClick;

            CheckVisibleItems();
            GetStandardExport();
            PrepareExportAsType();
        }

        function CheckVisibleItems() {
            if (DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig && DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.ListingPageConfig) {
                let _listingPageConfig = angular.copy(DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.ListingPageConfig);

                if (DynamicListCtrl.mode == 1) {
                    _listingPageConfig.EnableAttachButton = false;
                } else if (DynamicListCtrl.mode == 2 || DynamicListCtrl.mode == 3) {
                    _listingPageConfig.EnableResetButton = false;
                    _listingPageConfig.EnableNewButton = (DynamicListCtrl.isNewButton == true) ? true : false;
                    _listingPageConfig.EnableClearButton = false;
                    _listingPageConfig.EnableSearch = false;
                    _listingPageConfig.EnableSystemFavoriteFilter = false;
                    _listingPageConfig.EnableUserFavoriteFilter = false;
                    _listingPageConfig.EnableExport = false;
                    _listingPageConfig.EnableRecent = false;
                    _listingPageConfig.EnableGridColumns = false;
                    _listingPageConfig.EnableSaveAsFilterButton = false;
                    _listingPageConfig.EnableFilterFields = false;
                    _listingPageConfig.EnableSchedule = false;

                    if (DynamicListCtrl.mode == 2) {
                        _listingPageConfig.EnableAttachButton = false;
                    } else if (DynamicListCtrl.mode == 3) {
                        _listingPageConfig.EnableAttachButton = true;
                    }
                }

                DynamicListCtrl.ePage.Masters.VisibleItems = _listingPageConfig;
            }
        }

        // #region Button Actions
        function OnRefreshBtnClick() {
            PrepareGridInfo();
        }

        function OnResetBtnClick() {
            DynamicListCtrl.ePage.Masters.Header.ActiveFilter = null;
            DynamicListCtrl.ePage.Masters.DataEntry.DefaultFilter = {};
            DynamicListCtrl.ePage.Masters.Search.EntityInfo = null;
            PrepareGridInfo();
        }

        function OnFilterBtnClick() {
            ToggleFilterSideBar();
        }

        function OnNewBtnClick() {
            DynamicListCtrl.selectedGridRow({
                $item: {
                    "action": "new",
                    "data": undefined
                }
            });
        }

        function OnAttachBtnClick() {
            if (DynamicListCtrl.ePage.Masters.Grid.SelectedItemList.length > 0) {
                DynamicListCtrl.selectedGridRow({
                    $item: {
                        action: "multiSelect",
                        data: DynamicListCtrl.ePage.Masters.Grid.SelectedItem,
                        items: DynamicListCtrl.ePage.Masters.Grid.SelectedItemList
                    }
                });
            }
        }
        // #endregion

        // #region Customize Grid Column
        function SelectAllColumn($event) {
            let _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.ListSource.map(value => value.IsVisible = true);
            } else {
                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.ListSource.map(value => value.IsVisible = value.IsMandatory ? true : false);
            }
        }

        function SaveUserBasedGridColumn() {
            DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.SaveBtnTxt = "Please Wait...";
            DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.IsDisableSaveBtn = true;
            let _column = [];
            DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.ListSource.map(value => {
                if (value.IsVisible) {
                    _column.push(value);
                }
            });

            if (!DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting || !DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting.PK) {
                InsertUserBasedGridColumn(_column);
            } else {
                UpdateUserBasedGridColumn(_column);
            }
        }

        function InsertUserBasedGridColumn(_column) {
            let _input = {
                SAP_FK: authService.getUserInfo().AppPK,
                AppCode: authService.getUserInfo().AppCode,
                TenantCode: authService.getUserInfo().TenantCode,
                SourceEntityRefKey: authService.getUserInfo().UserId,
                EntitySource: DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName.toUpperCase() + "_GRIDCOLUMN",
                TypeCode: DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                Key: "GridColumn",
                Value: JSON.stringify({
                    Column: _column,
                    IsAutoListing: DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.IsAutoListing ? true : false
                }),
                IsJSON: true,
                IsModified: true
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    _response.Value = JSON.parse(_response.Value);
                    DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting = _response;
                    DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource = _response.Value.Column;
                    DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = _response.Value.IsAutoListing;
                    PrepareGridInfo();
                } else {
                    toastr.error("Failed to Save...!");
                }

                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.SaveBtnTxt = "Save";
                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.IsDisableSaveBtn = false;
            });
        }

        function UpdateUserBasedGridColumn(_column) {
            let _input = DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting;
            _input.IsModified = true;
            _input.Value = JSON.stringify({
                Column: _column,
                IsAutoListing: DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.IsAutoListing ? true : false
            });

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Update.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    let _response = response.data.Response;
                    _response.Value = JSON.parse(_response.Value);
                    DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting = _response;
                    DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource = _response.Value.Column;
                    DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = _response.Value.IsAutoListing;
                    PrepareGridInfo();
                } else {
                    toastr.error("Failed to Save...!");
                }

                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.SaveBtnTxt = "Save";
                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.IsDisableSaveBtn = false;
            });
        }

        function DeleteUserBasedGridColumn() {
            if (DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting && DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting.PK) {
                let modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Delete?',
                    bodyText: 'Are you sure?'
                };

                confirmation.showModal({}, modalOptions).then(result => {
                    apiService.get("eAxisAPI", appConfig.Entities.UserSettings.API.Delete.Url + DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting.PK + "/" + authService.getUserInfo().AppPK).then(response => {
                        if (response.data.Response == "Success") {
                            DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting = null;
                            DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.ListSource =
                                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource =
                                DynamicListCtrl.ePage.Masters.DataEntry.FindConfigTemp.GridConfig.Header;

                            PrepareGridInfo();
                        }
                    });
                }, () => {});
            }
        }
        // #endregion

        // #region Shortcut
        function GetFavoriteCount($item) {
            let _value = ($item.Input.Value && typeof $item.Input.Value == "string") ? JSON.parse($item.Input.Value) : $item.Input.Value;

            if (_value.ShowCount) {
                let _url = "";
                _value.CountAPI.split('/').map(value => {
                    if (value.charAt(0) == '@') {
                        _url += '/' + helperService.DateFilter(value);
                    } else {
                        _url += '/' + value;
                    }
                });

                if (_value.CountRequestMethod == 'get') {
                    apiService.get("eAxisAPI", _url.substr(1)).then(response => {
                        if (response.data.Response) {
                            $item.Count = response.data.Response;
                        }
                    });
                } else {
                    $item.ShowCount = _value.ShowCount;
                    $item.IsExcute = _value.IsExcute;
                    _value.CountInput = PrepareExecuteInput(_value.CountInput);
                    _value.CountInput.TenantCode = authService.getUserInfo().TenantCode;
                    let _input = {
                        "searchInput": helperService.createToArrayOfObject(_value.CountInput),
                        "FilterID": _value.CountFilterID
                    };

                    apiService.post("eAxisAPI", _url.substr(1), _input).then(response => {
                        if (response.data.Response) {
                            $item.Count = response.data.Response;
                        }
                    });
                }
            }
        }

        function ViewShortcutFilter($item) {
            DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = true;
            ExecuteFilterInput($item.Input);
        }
        // #endregion

        // #region System & User Filters
        function OnStarClick($item, type) {
            let _systemAndUserFilterList = [...DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource, ...DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource];

            let _index = _systemAndUserFilterList.findIndex(value => value.PK === $item.PK);
            if (_index !== -1) {
                if (!$item.IsStarred) {
                    let _count = 0;
                    _systemAndUserFilterList.map(val => _count += val.IsStarred ? 1 : 0);

                    if (_count < 3) {
                        let _input = {
                            "EntitySource": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName.toUpperCase() + "_SHORTCUT",
                            "Key": $item.Key,
                            "Value": $item.PK,
                            "SAP_FK": authService.getUserInfo().AppPK,
                            "TenantCode": authService.getUserInfo().TenantCode,
                            "SourceEntityRefKey": authService.getUserInfo().UserId,
                            "TypeCode": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                        };

                        apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                            if (response.data.Response && response.data.Response.length > 0) {
                                let _response = angular.copy(response.data.Response[0]);
                                _response.Input = $item;
                                DynamicListCtrl.ePage.Masters.Header.Shortcut.ListSource.push(_response);
                                $item.IsStarred = true;
                                $item.Starred_PK = _response.PK;
                            }
                        });
                    } else {
                        toastr.warning("Cannot add more than 3 favourites");
                    }
                } else {
                    let _index = DynamicListCtrl.ePage.Masters.Header.Shortcut.ListSource.findIndex(value => value.Value === $item.PK);
                    if (_index !== -1) {
                        apiService.get("eAxisAPI", appConfig.Entities.UserSettings.API.Delete.Url + $item.Starred_PK + "/" + authService.getUserInfo().AppPK).then(response => {
                            if (response.data.Response == "Success") {
                                $item.IsStarred = false;
                                DynamicListCtrl.ePage.Masters.Header.Shortcut.ListSource.splice(_index, 1);
                            }
                        });
                    }
                }
            }
        }

        function SetAsDeafultFilter($item, type) {
            if (DynamicListCtrl.ePage.Masters.Header.DefaultFilter && DynamicListCtrl.ePage.Masters.Header.DefaultFilter.PK) {
                let _indexSystem = DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource.findIndex(x => x.IsDefaultFilter == true);
                let _indexUser = DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.findIndex(x => x.IsDefaultFilter == true);

                if (_indexSystem !== -1) {
                    DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource[_indexSystem].IsDefaultFilter = false;
                }
                if (_indexUser !== -1) {
                    DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource[_indexUser].IsDefaultFilter = false;
                }

                if ($item.PK == DynamicListCtrl.ePage.Masters.Header.DefaultFilter.Value) {
                    DeleteDefaultFilter($item);
                } else {
                    UpdateDefaultFilter($item);
                }
            } else {
                InsertDefaultFilter($item);
            }
        }

        function InsertDefaultFilter($item) {
            let _input = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "AppCode": authService.getUserInfo().AppCode,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName.toUpperCase() + "_DEFAULTSEARCHFILTER",
                "TypeCode": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                "IsJSON": false,
                "Key": $item.Key,
                "Value": $item.PK,
                "IsModified": true
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    DynamicListCtrl.ePage.Masters.Header.DefaultFilter = _response;
                    $item.IsDefaultFilter = true;
                } else {
                    toastr.error("Failed toSave...!");
                }
            });
        }

        function UpdateDefaultFilter($item) {
            let _input = DynamicListCtrl.ePage.Masters.Header.DefaultFilter;
            _input.Key = $item.Key;
            _input.Value = $item.PK;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Update.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    DynamicListCtrl.ePage.Masters.Header.DefaultFilter = response.data.Response;
                    $item.IsDefaultFilter = true;
                } else {
                    toastr.error("Failed toSave...!");
                }
            });
        }

        function DeleteDefaultFilter($item) {
            apiService.get("eAxisAPI", appConfig.Entities.UserSettings.API.Delete.Url + DynamicListCtrl.ePage.Masters.Header.DefaultFilter.PK + "/" + authService.getUserInfo().AppPK).then(response => {
                if (response.data.Response == "Success") {
                    DynamicListCtrl.ePage.Masters.Header.DefaultFilter = null;
                    $item.IsDefaultFilter = false;
                }
            });
        }

        function ViewSystemFilter($item) {
            DynamicListCtrl.ePage.Masters.Header.ActiveFilter = angular.copy($item);
            DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = true;
            ExecuteFilterInput($item);
        }

        function DeleteUserFilter($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => {
                apiService.get("eAxisAPI", appConfig.Entities.UserSettings.API.Delete.Url + $item.PK + "/" + authService.getUserInfo().AppPK).then(response => {
                    if (response.data.Response == "Success") {
                        let _index = DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.findIndex(value => value.PK === $item.PK);
                        if (_index !== -1) {
                            DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.splice(_index, 1);
                        }
                    } else {
                        toastr.console.error("Failed to Delete...!");
                    }
                });
            }, () => {});
        }

        function UpdateUserFilter($item) {
            $item.IsDisableUpdateBtn = true;
            let _input = $item;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Update.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    let _response = response.data.Response;
                    _response.IsDisableUpdateBtn = false;
                    let _index = DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.findIndex(x => x.PK === _response.PK);

                    if (_index !== -1) {
                        DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource[_index] = _response;
                    }
                } else {
                    toastr.error("Failed to Save...!");
                }

                $item.IsDisableUpdateBtn = false;
                $item.IsEditLabel = false;
            });
        }

        function ViewUserFilter($item) {
            DynamicListCtrl.ePage.Masters.Header.ActiveFilter = angular.copy($item);
            DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = true;
            ExecuteFilterInput($item);
        }

        function ExecuteFilterInput($item) {
            let _defaultFilter = {};
            let _data = $item.Value;
            if (typeof _data == "string") {
                _data = JSON.parse(_data);
            }
            if (_data.ExcuteInput && _data.ExcuteInput.length > 0) {
                _defaultFilter = PrepareExecuteInput(_data.ExcuteInput);
            }
            // DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = true;
            DynamicListCtrl.ePage.Masters.DataEntry.DefaultFilter = _defaultFilter;

            PrepareGridInfo();
        }

        function PrepareExecuteInput($item) {
            let _defaultFilter = {};
            $item.map(value1 => {
                if (value1.Type && value1.Type == "DateCompare") {
                    let _val = (typeof value1.value == "string") ? JSON.parse(value1.value) : value1.value;
                    if (_val && typeof _val == "object" && _val.length > 0) {
                        _val.map(value2 => {
                            if (value2.FilterInput && typeof value2.FilterInput == "object" && value2.FilterInput.length > 0) {
                                value2.FilterInput.map(value3 => value3.Value = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormat));
                            }
                        });
                    }
                    value1.value = JSON.stringify(_val);
                } else {
                    let _value = (typeof value1.value == "string") ? value1.value : value1.value.toString();
                    if (_value.indexOf('@') !== -1) {
                        let _date = helperService.DateFilter(_value);
                        if (value1.Add && value1.Add.length > 0) {
                            value1.Add.map(value => {
                                if (typeof value.Value == "string") {
                                    value.Value = Number(value.Value);
                                }
                                let d = new Date(_date);
                                switch (value.FieldName) {
                                    case "Day":
                                        _date = new Date(d.setDate(d.getDate() + value.Value));
                                        break;
                                    case "Month":
                                        _date = new Date(d.setMonth(d.getMonth() + value.Value));
                                        break;
                                    case "Year":
                                        _date = new Date(d.setFullYear(d.getFullYear() + value.Value));
                                        break;
                                    case "Hour":
                                        _date = new Date(d.setHours(d.getHours() + value.Value));
                                        break;
                                    case "Minute":
                                        _date = new Date(d.setMinutes(d.getMinutes() + value.Value));
                                        break;
                                    case "Second":
                                        _date = new Date(d.setSeconds(d.getSeconds() + value.Value));
                                        break;
                                    default:
                                        _date = new Date(value.Value);
                                        break;
                                }
                            });
                            value1.value = $filter('date')(new Date(_date), APP_CONSTANT.DatePicker[value1.Format]);
                        } else {
                            value1.value = _date;
                        }
                    }
                }

                _defaultFilter[value1.FieldName] = value1.value;
            });

            return _defaultFilter;
        }
        // #endregion

        // #region Export
        function PrepareExportAsType() {
            DynamicListCtrl.ePage.Masters.Header.Export.ExportAsList = [{
                Name: "pdf",
                Description: "Download As PDF",
                Icon: APP_CONSTANT.ImagePath + "file-types/pdf.png",
                CallBack: DownloadAsPDF
            }, {
                Name: "xlsx",
                Description: "Download As Excel",
                Icon: APP_CONSTANT.ImagePath + "file-types/xlsx.png",
                CallBack: DownloadAsExcel
            }, {
                Name: "csv",
                Description: "Download As CSV",
                Icon: APP_CONSTANT.ImagePath + "file-types/csv.png",
                CallBack: DownloadAsCSV
            }, {
                Name: "json",
                Description: "Download As JSON",
                Icon: APP_CONSTANT.ImagePath + "file-types/json.png",
                CallBack: DownloadAsJson
            }];
        }

        function GetStandardExport() {
            let _standardExport = {
                "Template": "Simple Export",
                "Event": "STDEVENT",
                "Source": "SimpleExport",
                "IsStatic": true,
                "Value": JSON.stringify(GetTemplate()),
                "SourceReference": "StandardExport_" + DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK.split("-").join("")
            };
            DynamicListCtrl.ePage.Masters.Header.Export.ListSource.push(_standardExport);

            if (DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.GridOptions && DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.GridOptions.gridMenuCustomItems) {
                let _exportList = JSON.parse(DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.GridOptions.gridMenuCustomItems);

                _exportList.map(x => x.SourceReference = x.Template + "_" + DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK.split("-").join(""));

                DynamicListCtrl.ePage.Masters.Header.Export.ListSource = [...DynamicListCtrl.ePage.Masters.Header.Export.ListSource, ..._exportList];
            }
        }

        function DownloadAsPDF($item) {
            if ($item.IsStatic) {
                if ($item.Value) {
                    if (typeof $item.Value == "string") {
                        $item.Value = JSON.parse($item.Value);
                    }
                    if ($item.Value.DataObjs && $item.Value.DataObjs.length > 0) {
                        $item.Value.DataObjs.map(x => {
                            if (x.GridConfig) {
                                x.GridConfig = null;
                            }
                        });
                    }
                }
                DownloadTemplate($item, "PDF");
            } else {
                GetTemplateValueFromAppSettings($item).then((response) => {
                    DownloadTemplate(response, "PDF");
                });
            }
        }

        function DownloadAsExcel($item) {
            if ($item.IsStatic) {
                if ($item.Value) {
                    if (typeof $item.Value == "string") {
                        $item.Value = JSON.parse($item.Value);
                    }
                    if ($item.Value.DataObjs && $item.Value.DataObjs.length > 0) {
                        $item.Value.DataObjs.map(x => {
                            if (x.GridConfig) {
                                x.GridConfig = null;
                            }
                        });
                    }
                }
                DownloadTemplate($item, "EXCEL");
            } else {
                GetTemplateValueFromAppSettings($item).then((response) => {
                    DownloadTemplate(response, "EXCEL");
                });
            }
        }

        function DownloadAsCSV($item) {
            if ($item.IsStatic) {
                if ($item.Value) {
                    if (typeof $item.Value == "string") {
                        $item.Value = JSON.parse($item.Value);
                    }
                    if ($item.Value.DataObjs && $item.Value.DataObjs.length > 0) {
                        $item.Value.DataObjs.map(x => {
                            if (x.GridConfig) {
                                x.GridConfig = null;
                            }
                        });
                    }
                }
                DownloadTemplate($item, "CSV");
            } else {
                GetTemplateValueFromAppSettings($item).then((response) => {
                    DownloadTemplate(response, "CSV");
                });
            }
        }

        function DownloadAsJson($item) {
            if ($item.IsStatic) {
                if ($item.Value) {
                    if (typeof $item.Value == "string") {
                        $item.Value = JSON.parse($item.Value);
                    }
                    if ($item.Value.DataObjs && $item.Value.DataObjs.length > 0) {
                        $item.Value.DataObjs.map(x => {
                            if (x.GridConfig) {
                                x.GridConfig = null;
                            }
                        });
                    }
                }
                DownloadTemplate($item, "JSON");
            } else {
                GetTemplateValueFromAppSettings($item).then((response) => {
                    DownloadTemplate(response, "JSON");
                });
            }
        }

        function GetTemplateValueFromAppSettings($item) {
            let _deferred = $q.defer();
            let _filter = {
                "Key": $item.Template,
                EntitySource: "EXCELCONFIG",
                ModuleCode: DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.FilterConfig.EntitySource,
                TenantCode: authService.getUserInfo().TenantCode,
                AppCode: authService.getUserInfo().AppCode,
                SAP_FK: authService.getUserInfo().AppPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(response => {
                response.data.Response ? _deferred.resolve(response.data.Response[0]) : _deferred.resolve([]);
            });

            return _deferred.promise;
        }

        function DownloadTemplate($item, fileType) {
            let _value = ($item.Value && (typeof $item.Value == 'string' || $item.Value instanceof String)) ? JSON.parse($item.Value) : $item.Value;
            let _json = _value.TemplateJson ? _value.TemplateJson : _value;

            if (_json) {
                let _api = appConfig.Entities.Export.API.GridExcel.Url;
                let _input = GetTemplate(_json, fileType, true);

                if (fileType == "CSV" || fileType == "JSON") {
                    _api = appConfig.Entities.Export.API.Others.Url;
                }
                apiService.post("eAxisAPI", _api, _input).then(response => {
                    response.data.Response ? helperService.DownloadDocument(response.data.Response) : toastr.error("Failed to Download...!");
                });
            } else {
                toastr.error("Invalid Input...!")
            }
        }
        // #endregion

        // #region Recent
        function OpenRecentItem($item) {
            let _obj = {
                action: "dblClick",
                data: {
                    entity: {
                        PK: $item.EntityRefKey,
                        [DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.GridConfig.StarredKeyField]: $item.EntityRefCode
                    }
                },
                items: [],
                dataEntryMaster: DynamicListCtrl.ePage.Masters.DataEntry.FindConfig
            };

            SelectedGridRow(_obj);
        }
        // #endregion

        // #region Schedule
        function DeleteSchedule($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => {
                GetScheduledList($item);
                apiService.get("eAxisAPI", appConfig.Entities.AppSettings.API.Delete.Url + $item.PK + "/" + authService.getUserInfo().AppPK).then(response => {
                    let _index = DynamicListCtrl.ePage.Masters.Header.Schedule.ListSource.findIndex(x => x.PK === $item.PK);
                    if (_index !== -1) {
                        DynamicListCtrl.ePage.Masters.Header.Schedule.ListSource.splice(_index, 1);
                    }
                });
            }, () => {});
        }

        function GetScheduledList($item) {
            let _filter = {
                SourceReference: $item.sourceReference,
                ClassSource: "USER_SCHEDULE",
                SAP_FK: authService.getUserInfo().AppPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataConfigScheduler.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    response.data.Response.map(response => DeleteScheduledList(response));
                }
            });
        }

        function DeleteScheduledList($item) {
            apiService.get("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.Delete.Url + $item.PK).then(response => {});
        }

        function ViewScheduleFilter($item) {
            DynamicListCtrl.ePage.Masters.Header.ActiveFilter = angular.copy($item);
            DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = true;
            ExecuteFilterInput($item);
        }
        // #endregion

        // #region Search
        function InitSearch() {
            DynamicListCtrl.ePage.Masters.Search = {};
            DynamicListCtrl.ePage.Masters.Search.OnSearch = OnSearch;

            DynamicListCtrl.ePage.Masters.Search.SearchBtnTxt = "Go";
            DynamicListCtrl.ePage.Masters.Search.IsDisableSearchBtn = false;
        }

        function OnSearch() {
            DynamicListCtrl.ePage.Masters.Search.IsDisableSearchBtn = true;

            PrepareGridInfo();
        }
        // #endregion

        // #endregion

        // #region DataEntry
        function InitDataEntry() {
            DynamicListCtrl.ePage.Masters.DataEntry = {
                BaseFilter: DynamicListCtrl.baseFilter,
                DefaultFilter: DynamicListCtrl.defaultFilter,
                IsLoadGrid: false
            };

            if (DynamicListCtrl.dataentryName) {
                GetDataEntryConfig();
            }
        }

        function GetDataEntryConfig() {
            // Get FindConfig from DataEntryMaster
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig = undefined;
            let _filter = {
                DataEntryName: DynamicListCtrl.dataentryName,
                IsRoleBassed: false,
                IsAccessBased: false,
                OrganizationCode: DynamicListCtrl.organizationCode,
                IsOptimizedListPage: (DynamicListCtrl.mode == 1) ? true : false
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            console.time(DynamicListCtrl.dataentryName + " - FindConfig");
            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(response => {
                DynamicListCtrl.ePage.Masters.DataEntry.FindConfig = {};
                if (response.data.Response) {
                    console.timeEnd(DynamicListCtrl.dataentryName + " - FindConfig");

                    let _response = response.data.Response;

                    dynamicLookupConfig.Entities = {
                        ...dynamicLookupConfig.Entities,
                        ..._response.LookUpList
                    };

                    let _data = {
                        ...DynamicListCtrl.ePage.Masters.DataEntry.BaseFilter,
                        ...DynamicListCtrl.ePage.Masters.DataEntry.DefaultFilter
                    };
                    _response.Entities.map(value => value.Data = _data);

                    DynamicListCtrl.ePage.Masters.DataEntry.FindConfig = _response;
                    DynamicListCtrl.ePage.Masters.DataEntry.FindConfigTemp = angular.copy(_response);
                    DynamicListCtrl.dataentryObject = _response;

                    InitHeader();
                    InitSearch();
                    InitGrid();
                    InitFilter();

                    if (DynamicListCtrl.mode == 1) {
                        if (response.data) {
                            DynamicListCtrl.ePage.Masters.AllFindAllList = _response.OptimizedListPage;
                            if (DynamicListCtrl.ePage.Masters.AllFindAllList) {
                                PrepareUserBasedGridColumList();
                            }
                        } else {
                            PrepareGridInfo();
                        }
                    } else {
                        DynamicListCtrl.ePage.Masters.Filter.AccessControl.IsEnableDynamicControl = true;
                        PrepareGridInfo();
                    }
                }
            });
        }
        // #endregion

        // #region Grid
        function InitGrid() {
            DynamicListCtrl.ePage.Masters.Grid = {
                SelectedItemList: []
            };

            DynamicListCtrl.ePage.Masters.Grid.SelectedGridRow = SelectedGridRow;

            if (DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.FilterConfig) {
                if (DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.FilterConfig.IsAutoListing == undefined) {
                    DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.CSS.IsAutoListing;
                } else {
                    DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.FilterConfig.IsAutoListing;
                }
            } else {
                DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = true;
            }
        }

        function PrepareGridInfo() {
            DynamicListCtrl.ePage.Masters.DataEntry.IsLoadGrid = false;
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig = undefined;
            let _findConfigTemp = angular.copy(DynamicListCtrl.ePage.Masters.DataEntry.FindConfigTemp);

            let _entityKey;
            _findConfigTemp.Entities.map(value1 => {
                value1.ConfigData.map(value2 => {
                    if (value2.IsKey && (value2.Type == "D" || value2.Type == "B")) {
                        _entityKey = value2.FieldName;
                    }
                });
            });

            let _entityInfo = {
                EntityInfo: DynamicListCtrl.ePage.Masters.Search.EntityInfo ? DynamicListCtrl.ePage.Masters.Search.EntityInfo : null,
                EntityKeyValue: _entityKey
            };
            setTimeout(() => {
                let _obj = {
                    'FilterType': _findConfigTemp.DataEntryName
                };
                let _defaultFilter = {
                    ...DynamicListCtrl.ePage.Masters.DataEntry.DefaultFilter,
                    ..._entityInfo,
                    ..._obj
                };

                if (DynamicListCtrl.baseFilter) {
                    _defaultFilter = {
                        ..._defaultFilter,
                        ...DynamicListCtrl.baseFilter
                    };
                    DynamicListCtrl.ePage.Masters.BaseFilterFields = {};
                    for (let x in DynamicListCtrl.baseFilter) {
                        DynamicListCtrl.ePage.Masters.BaseFilterFields["IsDisabled" + x] = true;
                    }
                }

                _findConfigTemp.Entities.map(value => value.Data = _defaultFilter);

                if (_findConfigTemp.OtherConfig.FilterConfig) {
                    if (DynamicListCtrl.ePage.Masters.Grid.IsAutoListing !== undefined) {
                        _findConfigTemp.OtherConfig.FilterConfig.IsAutoListing = DynamicListCtrl.ePage.Masters.Grid.IsAutoListing;
                    }
                } else {
                    _findConfigTemp.OtherConfig.FilterConfig = {
                        IsAutoListing: DynamicListCtrl.ePage.Masters.Grid.IsAutoListing
                    }
                }

                var _activeFilterColumn;
                if (DynamicListCtrl.ePage.Masters.Header.ActiveFilter) {
                    let _value = DynamicListCtrl.ePage.Masters.Header.ActiveFilter.Value;
                    if (typeof _value == "string") {
                        _value = JSON.parse(_value);
                        if (_value.Column) {
                            _activeFilterColumn = _value.Column;
                        }
                    }
                }

                if (_activeFilterColumn) {
                    _findConfigTemp.GridConfig.Header = _activeFilterColumn;
                } else if (!_activeFilterColumn && DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource && DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource.length > 0) {
                    _findConfigTemp.GridConfig.Header = DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource;
                }

                DynamicListCtrl.ePage.Masters.DataEntry.DefaultFilter = _defaultFilter;
                DynamicListCtrl.ePage.Masters.DataEntry.FindConfig = _findConfigTemp;
                DynamicListCtrl.ePage.Masters.Search.IsDisableSearchBtn = false;
                DynamicListCtrl.ePage.Masters.DataEntry.IsLoadGrid = true;
            });
        }

        function SelectedGridRow($item) {
            if (DynamicListCtrl.mode == 1) {
                if ($item.action == "favorite") {
                    if ($item.data.entity.IsStarred && $item.data.entity.Starred_FK) {
                        RemoveStarredItem($item.data);
                    } else {
                        AddStarredItem($item.data);
                    }
                } else {
                    DynamicListCtrl.ePage.Masters.Grid.IsStandardToolbar = false;
                    DynamicListCtrl.ePage.Masters.Grid.IsCustomToolbar = false;
                    if ($item.items.length > 0) {
                        if ($item.dataEntryMaster.OtherConfig.ListingPageConfig && $item.dataEntryMaster.OtherConfig.ListingPageConfig.EnableCustomToolbar) {
                            ConfigureCustomToolBar($item);
                        }
                    }

                    DynamicListCtrl.selectedGridRow({
                        $item: $item
                    });
                }
            } else if (DynamicListCtrl.mode == 2) {
                DynamicListCtrl.selectedGridRow({
                    $item: $item
                });
            } else if (DynamicListCtrl.mode == 3) {
                DynamicListCtrl.ePage.Masters.Grid.SelectedItem = $item.data;
                DynamicListCtrl.ePage.Masters.Grid.SelectedItemList = $item.items;

                if ($item.action == "link" || $item.action == "dblClick") {
                    DynamicListCtrl.selectedGridRow({
                        $item: {
                            action: $item.action,
                            data: [$item.data.entity],
                            items: $item.items
                        }
                    });
                } else if ($item.action == "rowSelection" || $item.action == "rowSelectionBatch") {
                    // 
                } else {
                    DynamicListCtrl.selectedGridRow({
                        $item: $item
                    });
                }
            } else {
                DynamicListCtrl.selectedGridRow({
                    $item: $item
                });
            }
        }

        function AddStarredItem($item) {
            let _input = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "Key": $item.entity[DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.GridConfig.StarredKeyField],
                "Value": $item.entity[DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.GridConfig.StarredValueField],
                "IsJSON": false,
                "SAP_FK": authService.getUserInfo().AppPK,
                "AppCode": authService.getUserInfo().AppCode,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName.toUpperCase() + "_STARRED",
                "TypeCode": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                "IsModified": true
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    $item.entity.IsStarred = true;
                    $item.entity.Starred_FK = response.data.Response[0].PK;
                } else {
                    toastr.error("Failed to Save...!");
                }
            });
        }

        function RemoveStarredItem($item) {
            apiService.get("eAxisAPI", appConfig.Entities.UserSettings.API.Delete.Url + $item.entity.Starred_FK + "/" + authService.getUserInfo().AppPK).then(response => {
                if (response.data.Response == "Success") {
                    $item.entity.IsStarred = false;
                    $item.entity.Starred_FK = null;
                } else {
                    toastr.error("Failed to Save...!");
                }
            });
        }

        function ConfigureCustomToolBar($item) {
            DynamicListCtrl.ePage.Masters.Grid.IsCustomToolbar = false;
            setTimeout(() => {
                let _input = angular.copy($item.items);
                DynamicListCtrl.ePage.Masters.Grid.CustomToolbarInput = _input;
                DynamicListCtrl.ePage.Masters.Grid.IsCustomToolbar = true;
            });
        }
        // #endregion

        // #region Filter
        function InitFilter() {
            DynamicListCtrl.ePage.Masters.Filter = {
                NoOfColumn: 1,
                IsShowCustomizeFilterField: false,
                SaveAsFilter: {
                    SaveBtnTxt: "Save",
                    IsDisableSaveBtn: false,
                    IsNew: "New",
                    Save: SaveAsFilter,
                    Update: UpdateAsFilter
                },
                SaveAsSchedule: {
                    SaveBtnTxt: "Save",
                    IsDisableSaveBtn: false,
                    Save: SaveAsSchedule
                },
                AccessControl: {
                    ListSource: [],
                    IsEnableDynamicControl: false
                }
            };

            DynamicListCtrl.ePage.Masters.Filter.Apply = ApplyFilter;
            DynamicListCtrl.ePage.Masters.Filter.Clear = ClearFilter;
            DynamicListCtrl.ePage.Masters.Filter.CloseFilterSideBar = CloseFilterSideBar;
            DynamicListCtrl.ePage.Masters.Filter.CustomizeFilterField = CustomizeFilterField;

            DynamicListCtrl.ePage.Masters.Filter.ApplyBtnTxt = "Apply";
            DynamicListCtrl.ePage.Masters.Filter.IsDisableApplyBtn = false;

            if (DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig && DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.FilterConfig && DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.FilterConfig.NoOfColumn) {
                DynamicListCtrl.ePage.Masters.Filter.NoOfColumn = parseInt(DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.FilterConfig.NoOfColumn);
            }
        }

        function CloseFilterSideBar() {
            ToggleFilterSideBar();
        }

        function ToggleFilterSideBar() {
            $('#filterSideBar_' + DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK).toggleClass('open');
        }

        function ApplyFilter() {
            DynamicListCtrl.ePage.Masters.Filter.ApplyBtnTxt = "Please Wait";
            DynamicListCtrl.ePage.Masters.Filter.IsDisableApplyBtn = true;

            DynamicListCtrl.ePage.Masters.Search.EntityInfo = null;
            DynamicListCtrl.ePage.Masters.Header.ActiveFilter = null;
            let _data = {};
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => _data = value.Data);
            DynamicListCtrl.ePage.Masters.DataEntry.DefaultFilter = _data;
            DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = true;

            DynamicListCtrl.ePage.Masters.ErrorWarningConfig = angular.copy(errorWarningService);

            ValidateFilterInput().then(response => {
                if (response.Count > 0) {
                    toastr.warning("Please fill mandatory filters...!");
                } else {
                    ToggleFilterSideBar();
                    PrepareGridInfo();
                }

                DynamicListCtrl.ePage.Masters.Filter.ApplyBtnTxt = "Apply";
                DynamicListCtrl.ePage.Masters.Filter.IsDisableApplyBtn = false;
            });
        }

        function ValidateFilterInput() {
            let deferred = $q.defer();
            let _validationInput = {};

            if (DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.Validation && DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.Validation.ModeS) {
                _validationInput = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.Validation.ModeS;
                if (_validationInput && typeof _validationInput == "string") {
                    _validationInput = JSON.parse(_validationInput);
                } else {
                    _validationInput = {};
                }
            }
            let _isEmpty = angular.equals({}, _validationInput);

            if (!_isEmpty) {
                let _obj = {
                    ModuleName: [DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK + DynamicListCtrl.mode],
                    Code: ["DynListPage" + DynamicListCtrl.mode],
                    API: _validationInput.API,
                    FilterInput: {
                        ModuleCode: _validationInput.ModuleCode,
                        Code: (_validationInput.ErrorCodeList && _validationInput.ErrorCodeList.length > 0) ? _validationInput.ErrorCodeList.join(",") : null
                    },
                    GroupCode: _validationInput.GroupCode
                };

                errorWarningService.GetErrorCodeList(_obj).then(response => {
                    DynamicListCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK + DynamicListCtrl.mode].Entity["DynListPage" + DynamicListCtrl.mode].GlobalErrorWarningList;
                    DynamicListCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK + DynamicListCtrl.mode];

                    Validate(_validationInput).then(response => {
                        let _errorCount = $filter("listCount")(DynamicListCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList, 'MessageType', 'E');

                        let _obj = {
                            Count: _errorCount,
                            List: DynamicListCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList
                        }
                        deferred.resolve(_obj);
                    });
                });
            } else {
                let _obj = {
                    Count: 0,
                    List: []
                };
                deferred.resolve(_obj);
            }

            return deferred.promise;
        }

        function Validate(_validationInput) {
            let deferred = $q.defer();
            let _data = {};
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => _data = value.Data);

            let _obj = {
                ModuleName: [DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK + DynamicListCtrl.mode],
                Code: ["DynListPage" + DynamicListCtrl.mode],
                API: _validationInput.API,
                GroupCode: _validationInput.GroupCode,
                ErrorCodeList: _validationInput.ErrorCodeList,
                RelatedBasicDetails: [],
                EntityObject: _data
            };
            errorWarningService.ValidateValue(_obj);

            deferred.resolve();
            return deferred.promise;
        }

        function ClearFilter() {
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => value.Data = {});
            let _baseFilter = {};
            if (DynamicListCtrl.baseFilter) {
                _baseFilter = DynamicListCtrl.baseFilter;
            }
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => value.Data = _baseFilter);
        }

        function CustomizeFilterField($item) {
            if (!$item.Include) {
                SaveFilterDislike($item);
            } else {
                DeleteFilterDislike($item);
            }
        }

        function SaveFilterDislike($item) {
            let _input = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName.toUpperCase() + "_FILTERDISLIKE",
                "TypeCode": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                "Key": $item.FieldName,
                "IsJSON": false,
                "IsModified": true,
                "Value": $item.DataEntryPK,
                "SAP_FK": authService.getUserInfo().AppPK,
                "AppCode": authService.getUserInfo().AppCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    $item.Include_FK = response.data.Response[0].PK;
                } else {
                    toastr.error("Failed to Save...!");
                }
            });
        }

        function DeleteFilterDislike($item) {
            apiService.get("eAxisAPI", appConfig.Entities.UserSettings.API.Delete.Url + $item.Include_FK + "/" + authService.getUserInfo().AppPK).then(response => {
                if (response.data.Response == "Success") {

                } else {
                    toastr.error("Failed to Delete...!");
                }
            });
        }

        // Filter
        function SaveAsFilter() {
            if (DynamicListCtrl.ePage.Masters.Filter.SaveAsFilter.Model) {
                let _data = {};
                DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => {
                    _data = {
                        ..._data,
                        ...value.Data
                    };
                });

                let _isEmpty = angular.equals({}, _data);
                if (!_isEmpty) {
                    SaveFilter();
                } else {
                    toastr.warning("Please Select at least one field...!");
                }
            } else {
                toastr.warning("Please Enter the Name...");
            }
        }

        function SaveFilter() {
            DynamicListCtrl.ePage.Masters.Filter.SaveAsFilter.SaveBtnTxt = "Please Wait...";
            DynamicListCtrl.ePage.Masters.Filter.SaveAsFilter.IsDisableSaveBtn = true;
            let _input = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName.toUpperCase() + "_FAVORITES",
                "TypeCode": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                "Key": DynamicListCtrl.ePage.Masters.Filter.SaveAsFilter.Model,
                "IsJSON": true,
                "IsModified": true,
                "Value": JSON.stringify(PrepareAppUserSettingValue()),
                "SAP_FK": authService.getUserInfo().AppPK,
                "AppCode": authService.getUserInfo().AppCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    _response.UpdateBtnTxt = "Update";
                    _response.IsDisableUpdateBtn = false;
                    DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.push(_response);
                    DynamicListCtrl.ePage.Masters.Filter.SaveAsFilter.Model = null;
                    helperService.closeDropDownPopover();
                } else {
                    toastr.error("Failed To Save...!");
                }

                DynamicListCtrl.ePage.Masters.Filter.SaveAsFilter.SaveBtnTxt = "Save";
                DynamicListCtrl.ePage.Masters.Filter.SaveAsFilter.IsDisableSaveBtn = false;
            });
        }

        function UpdateAsFilter($item) {
            $item.UpdateBtnTxt = "Please Wait...";
            $item.IsDisableUpdateBtn = true;
            let _input = angular.copy($item);
            _input.IsModified = true;
            _input.Value = JSON.stringify(PrepareAppUserSettingValue());

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Update.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    let _response = response.data.Response;
                    _response.UpdateBtnTxt = "Update";
                    _response.IsDisableUpdateBtn = false;

                    let _index = DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.findIndex(x => x.PK === _response.PK);
                    if (_index !== -1) {
                        DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource[_index] = _response;
                    }
                } else {
                    toastr.error("Failed to Save...!");
                }

                $item.UpdateBtnTxt = "Update";
                $item.IsDisableUpdateBtn = false;
            });
        }

        // Schedule
        function SaveAsSchedule() {
            if (DynamicListCtrl.ePage.Masters.Filter.SaveAsSchedule.Model) {
                let _data = {};
                DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => {
                    _data = {
                        ..._data,
                        ...value.Data
                    };
                });

                let _isEmpty = angular.equals({}, _data);
                if (!_isEmpty) {
                    SaveSchedule();
                } else {
                    toastr.warning("Please Select at least one field...!");
                }
            } else {
                toastr.warning("Please Enter the Name...");
            }
        }

        function SaveSchedule() {
            DynamicListCtrl.ePage.Masters.Filter.SaveAsSchedule.SaveBtnTxt = "Please Wait...";
            DynamicListCtrl.ePage.Masters.Filter.SaveAsSchedule.IsDisableSaveBtn = true;
            let _input = {
                "EntitySource": "SCHEDULE",
                "SourceEntityRefKey": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName,
                "TypeCode": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                "Key": DynamicListCtrl.ePage.Masters.Filter.SaveAsSchedule.Model,
                "IsJSON": true,
                "IsModified": true,
                "Value": JSON.stringify(PrepareAppUserSettingValue({
                    IsRelatedDetails: true
                })),
                "SAP_FK": authService.getUserInfo().AppPK,
                "AppCode": authService.getUserInfo().AppCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    DynamicListCtrl.ePage.Masters.Header.Schedule.ListSource.push(_response);
                    OpenNewSchedule(_response);
                    DynamicListCtrl.ePage.Masters.Filter.SaveAsSchedule.Model = null;
                    helperService.closeDropDownPopover();
                } else {
                    toastr.error("Failed To Save...!");
                }

                DynamicListCtrl.ePage.Masters.Filter.SaveAsSchedule.SaveBtnTxt = "Save";
                DynamicListCtrl.ePage.Masters.Filter.SaveAsSchedule.IsDisableSaveBtn = false;
            });
        }

        function OpenNewSchedule($item) {
            let _scheduleInput = PrepareScheduleInput($item);
            Object.assign($item, _scheduleInput);

            DynamicListCtrl.ePage.Masters._scheduleObj = {
                // externalCode: "STDEVENT",
                classSource: "USER_SCHEDULE",
                configType: "Email",
                relatedDetails: GetRelatedDetails(),
                sourceReference: "StandardExport_" + $item.PK.split("-").join(""),
                template: "Simple Export",
                dataentryObj: DynamicListCtrl.ePage.Masters.DataEntry.FindConfig
            };

            let _template = `<i style = "display: none;" schedule external-code="DynamicListCtrl.ePage.Masters._scheduleObj.externalCode" source-reference="DynamicListCtrl.ePage.Masters._scheduleObj.sourceReference" class-source="DynamicListCtrl.ePage.Masters._scheduleObj.classSource" config-type="DynamicListCtrl.ePage.Masters._scheduleObj.configType" related-details="DynamicListCtrl.ePage.Masters._scheduleObj.relatedDetails" template="DynamicListCtrl.ePage.Masters._scheduleObj.template" dataentry-obj="DynamicListCtrl.ePage.Masters._scheduleObj.dataentryObj" mode="'2'"></i>`
            let _view = $compile(angular.element(_template))($scope);
            _view.click();
            ToggleFilterSideBar();
        }

        function PrepareAppUserSettingValue($item) {
            let strUrl = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterAPI.split("/");
            strUrl.splice(strUrl.length - 1, 1).join("/");
            let _filterInput = {};
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => {
                _filterInput = {
                    ..._filterInput,
                    ...value.Data
                };
            });
            if (DynamicListCtrl.ePage.Masters.DataEntry.BaseFilter) {
                _filterInput = {
                    ..._filterInput,
                    ...DynamicListCtrl.ePage.Masters.DataEntry.BaseFilter
                };
            }
            let _value = {
                "ExcuteInput": helperService.createToArrayOfObject(_filterInput),
                "CountInput": helperService.createToArrayOfObject(_filterInput),
                "ShowCount": true,
                "ShowInDashboard": true,
                "CountAPI": strUrl + '/FindCount',
                "CountFilterID": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterID,
                "CountRequestMethod": "post",
                "ExcuteRequestMethod": "post",
                "IsExcute": true,
                "API": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterAPI,
                "FilterID": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterID,
                "CSS": {
                    "color": "#e7505a",
                    "icon": "fa fa-star-o"
                },
                "Column": DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.GridConfig.Header,
                'IsAutoListing': DynamicListCtrl.ePage.Masters.Grid.IsAutoListing ? true : false
            };

            if ($item && $item.IsRelatedDetails) {
                _value.ScheduleDetails = GetRelatedDetails();
            }

            return _value;
        }

        function GetRelatedDetails() {
            let _filterInput = {};
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(value => {
                _filterInput = {
                    ..._filterInput,
                    ...value.Data
                };
            });

            let _relatedDetails = {
                "RelatedDetail": helperService.createToArrayOfObject(_filterInput),
                "GridReport": GetTemplate(null, null, true)
            };

            return _relatedDetails;
        }

        function GetTemplate($item, fileType, isStandard) {
            let _template = {
                "FileName": null,
                "FileType": null,
                "TemplateName": "DynamicReport",
                "SheetName": "Default",
                "HeaderBGColor": "#f7f7f7",
                "HeaderForegroundColor": "#444",
                "DataObjs": [{
                    "SectionName": "Header",
                    "DataSource": "LOCAL",
                    "DataObject": {
                        "Date": null,
                        "Title": null
                    },
                    "IsFilterEnabled": false
                }, {
                    "SectionName": "DynamicRow",
                    "DataSource": "API",
                    "IsApi": true,
                    "ApiName": null,
                    "HttpMethod": "POST",
                    "SearchInput": {
                        "FilterID": null,
                        "SearchInput": null
                    },
                    "RenderType": true,
                    "IsList": true,
                    "IsFilterEnabled": true,
                    "GridConfig": null,
                    "IsSelf": true,
                    "IsAutoHeader": true,
                    "AutoColumnWidth": 20
                }],
                "JobDocs": {
                    "EntityRefKey": null,
                    "EntitySource": null,
                    "EntityRefCode": null
                },
                "IsAsync": false,
                "IsLocal": false,
                "StartRow": 3,
                "IsSaveToDrive": false
            };
            let _input = $item ? $item : _template;
            let _jobDocs = {
                EntityRefCode: DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName,
                EntityRefKey: DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntry_PK,
                EntitySource: "REPORT"
            };
            let _pagination = angular.copy(DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.OtherConfig.Pagination);
            _pagination.PageSize = "100000";
            // Get local Columns
            let _gridConfig = [];
            let _count = 1;
            let _customHeaderList = [];
            if (DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource && DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource.length > 0) {
                _customHeaderList = DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource;
            } else {
                _customHeaderList = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.GridConfig.Header;
            }

            _customHeaderList.map((value, key) => {
                if (value.displayName) {
                    let _column = {
                        DisplayName: value.displayName,
                        FieldName: value.field,
                        OrdinalPosition: _count++,
                        DataType: value.DataType ? value.DataType : value.type,
                        TypeFormat: value.Format,
                        Flag: value.Flag
                    };
                    _gridConfig.push(_column);
                }
            });
            // Get local Filter input
            let _searchInput = {};
            DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Entities.map(x => Object.assign(_searchInput, x.Data));

            if (!_input.JobDocs) {
                _input.JobDocs = {};
            }
            _input.JobDocs = Object.assign(_input.JobDocs, _jobDocs);
            _input.FileType = fileType ? fileType : "EXCEL";
            _input.FileName = _input.FileName ? _input.FileName : DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DataEntryName;
            _input.IsSaveToDrive = false;

            if (_input.DataObjs && _input.DataObjs.length > 0) {
                _input.DataObjs.map(x => {
                    if (x.DataSource === "LOCAL" && !x.IsApi) {
                        x.DataObject.Date = new Date().toUTCString();
                        x.DataObject.Title = x.DataObject.Title ? x.DataObject.Title : DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.Title;
                    } else if (x.DataSource === "API" && x.IsApi) {
                        if (!x.SearchInput) {
                            x.SearchInput = {};
                        }
                        let _api = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterAPI,
                            _filterAPIArray = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterAPI.split("/"),
                            _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;
                        if (_isFindLookup) {
                            _api = _filterAPIArray.slice(0, -1).join("/");
                            x.SearchInput.DBObjectName = DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterAPI.split("/").pop();
                        }

                        x.ApiName = _api;
                        x.SearchInput.FilterID = x.SearchInput.FilterID ? x.SearchInput.FilterID : DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.FilterID;
                        x.GridConfig = (x.GridConfig && x.GridConfig.length > 0) ? x.GridConfig : _gridConfig;

                        if (x.SearchInput.SearchInput && x.SearchInput.SearchInput.length > 0) {
                            let _sInput = {};
                            x.SearchInput.SearchInput.map(x => {
                                _sInput[x.FieldName] = x.value;
                            });
                            _sInput = Object.assign(_sInput, _searchInput);

                            x.SearchInput.SearchInput = helperService.createToArrayOfObject(_sInput);
                        } else {
                            if (isStandard) {
                                let _filterInput = Object.assign(_pagination, _searchInput);
                                _filterInput = helperService.createToArrayOfObject(_filterInput);
                                x.SearchInput.SearchInput = _filterInput;
                            } else {
                                let _paginationFilter = helperService.createToArrayOfObject(_pagination);
                                x.SearchInput.SearchInput = _paginationFilter;
                            }
                        }
                    }
                });
            }

            return _input;
        }

        function PrepareScheduleInput($item) {
            let _obj = {
                // Event: "STDEVENT",
                Source: "SimpleExport",
                Template: "Simple Export",
                SourceReference: "StandardExport_" + $item.PK.split("-").join(""),
                SearchInput: JSON.parse($item.Value).ScheduleDetails
            };
            return _obj;
        }
        // #endregion

        // #region Prepare Optimized list page
        function PrepareUserBasedGridColumList() {
            if (DynamicListCtrl.ePage.Masters.AllFindAllList.GridColumns && DynamicListCtrl.ePage.Masters.AllFindAllList.GridColumns.length > 0) {
                let _response = DynamicListCtrl.ePage.Masters.AllFindAllList.GridColumns[0];
                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.UserSetting = _response;
                let _value = JSON.parse(_response.Value);
                let _AllColumns = angular.copy(DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.GridConfig.Header);
                let _gridColumn = [];

                if (_value.Column && _value.Column.length > 0) {
                    _gridColumn = angular.copy(_value.Column);
                    _AllColumns.map(value1 => {
                        let _index = _gridColumn.findIndex(x => x.field == value1.field);
                        if (_index == -1) {
                            value1.IsVisible = false;
                            _gridColumn.push(value1);
                        }
                    });
                }

                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.ListSource = _gridColumn;
                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.TempListSource = _value.Column;
                DynamicListCtrl.ePage.Masters.Header.CustomizeGrid.IsAutoListing = _value.IsAutoListing;
                DynamicListCtrl.ePage.Masters.Grid.IsAutoListing = _value.IsAutoListing;
            }
            PrepareSystemFilterList();
        }

        function PrepareSystemFilterList() {
            if (DynamicListCtrl.ePage.Masters.AllFindAllList.SystemQueries && DynamicListCtrl.ePage.Masters.AllFindAllList.SystemQueries.length > 0) {
                DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource = DynamicListCtrl.ePage.Masters.AllFindAllList.SystemQueries;
            }
            PrepareUserFilterList();
        }

        function PrepareUserFilterList() {
            if (DynamicListCtrl.ePage.Masters.AllFindAllList.SavedFilters && DynamicListCtrl.ePage.Masters.AllFindAllList.SavedFilters.length > 0) {
                DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource = DynamicListCtrl.ePage.Masters.AllFindAllList.SavedFilters;

                DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.map(x => {
                    x.UpdateBtnTxt = "Update";
                    x.IsDisableUpdateBtn = false;
                });
            }

            PrepareUserDefaultFilter();
            PrepareShortcutList();
            PrepareFilterAccessControl();
            PrepareRecentFilterList();
            PrepareScheduleList();
            PrepareRelatedLookupList();
        }

        function PrepareUserDefaultFilter() {
            if (DynamicListCtrl.ePage.Masters.AllFindAllList.DefultQuery && DynamicListCtrl.ePage.Masters.AllFindAllList.DefultQuery.length > 0) {
                let _response = DynamicListCtrl.ePage.Masters.AllFindAllList.DefultQuery[0];
                DynamicListCtrl.ePage.Masters.Header.DefaultFilter = _response;
                let _indexSystem = DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource.findIndex(x => x.PK === _response.Value);
                let _indexUser = DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.findIndex(x => x.PK === _response.Value);

                if (_indexSystem !== -1) {
                    DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource[_indexSystem].IsDefaultFilter = true;
                    DynamicListCtrl.ePage.Masters.Header.ActiveFilter = angular.copy(DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource[_indexSystem]);
                    ExecuteFilterInput(DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource[_indexSystem]);
                }
                if (_indexUser !== -1) {
                    DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource[_indexUser].IsDefaultFilter = true;
                    DynamicListCtrl.ePage.Masters.Header.ActiveFilter = angular.copy(DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource[_indexUser]);
                    ExecuteFilterInput(DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource[_indexUser]);
                }
            } else {
                let _index = DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource.findIndex(x => x.PK === DynamicListCtrl.ePage.Masters.DataEntry.FindConfig.DefaultFilter);
                if (_index != -1) {
                    DynamicListCtrl.ePage.Masters.Header.DefaultFilter = DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource[_index];
                    DynamicListCtrl.ePage.Masters.Header.ActiveFilter = angular.copy(DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource[_index]);
                    ExecuteFilterInput(DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource[_index]);
                } else {
                    PrepareGridInfo();
                }
            }
        }

        function PrepareShortcutList() {
            if (DynamicListCtrl.ePage.Masters.AllFindAllList.Shortcut && DynamicListCtrl.ePage.Masters.AllFindAllList.Shortcut.length > 0) {
                DynamicListCtrl.ePage.Masters.Header.Shortcut.ListSource = DynamicListCtrl.ePage.Masters.AllFindAllList.Shortcut;

                DynamicListCtrl.ePage.Masters.Header.Shortcut.ListSource.map(value => {
                    DynamicListCtrl.ePage.Masters.Header.SystemFilter.ListSource.map(value1 => {
                        if (value.Value === value1.PK) {
                            value1.IsStarred = true;
                            value1.Starred_PK = value.PK;
                            value.Input = value1;
                        }
                    });
                    DynamicListCtrl.ePage.Masters.Header.UserFilter.ListSource.map(value2 => {
                        if (value.Value === value2.PK) {
                            value2.IsStarred = true;
                            value2.Starred_PK = value.PK;
                            value.Input = value2;
                        }
                    });
                });
            }
        }

        function PrepareRecentFilterList() {
            if (DynamicListCtrl.ePage.Masters.AllFindAllList.SecRecentItems && DynamicListCtrl.ePage.Masters.AllFindAllList.SecRecentItems.length > 0) {
                DynamicListCtrl.ePage.Masters.Header.Recent.ListSource = DynamicListCtrl.ePage.Masters.AllFindAllList.SecRecentItems;
            }
        }

        function PrepareScheduleList() {
            if (DynamicListCtrl.ePage.Masters.AllFindAllList.Schedules && DynamicListCtrl.ePage.Masters.AllFindAllList.Schedules.length > 0) {
                let _response = DynamicListCtrl.ePage.Masters.AllFindAllList.Schedules;
                _response.map((value) => {
                    let _scheduleInput = PrepareScheduleInput(value);
                    Object.assign(value, _scheduleInput);
                });
                DynamicListCtrl.ePage.Masters.Header.Schedule.ListSource = _response;
            }
        }

        function PrepareRelatedLookupList() {
            let _response = DynamicListCtrl.ePage.Masters.AllFindAllList.RelatedLookups;
            let _isEmpty = angular.equals({}, _response);

            if (!_isEmpty) {
                Object.assign(dynamicLookupConfig.Entities, _response);
            }
        }

        function PrepareFilterAccessControl() {
            DynamicListCtrl.ePage.Masters.Filter.AccessControl.ListSource = DynamicListCtrl.ePage.Masters.AllFindAllList.SearchFields;
            DynamicListCtrl.ePage.Masters.Filter.AccessControl.IsEnableDynamicControl = true;
        }
        // #endregion

        Init();
    }
})();