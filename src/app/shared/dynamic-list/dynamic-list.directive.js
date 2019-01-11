(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicList", DynamicList);

    function DynamicList() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/dynamic-list/dynamic-list.html",
            controller: "DynamicListController",
            controllerAs: "DynamicListCtrl",
            scope: {
                mode: "=",
                dataentryName: "=",
                dataentryObject: "=",
                defaultFilter: "=",
                baseFilter: "=",
                selectedGridRow: "&",
                lookupConfigControlKey: "=",
                isNewButton: "=",
                overrideUrl: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("DynamicListController", DynamicListController);

    DynamicListController.$inject = ["$timeout", "$filter", "authService", "apiService", "helperService", "toastr", "dynamicLookupConfig", "appConfig", "APP_CONSTANT", "confirmation"];

    function DynamicListController($timeout, $filter, authService, apiService, helperService, toastr, dynamicLookupConfig, appConfig, APP_CONSTANT, confirmation) {
        var DynamicListCtrl = this;

        function Init() {
            DynamicListCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": DynamicListCtrl.config
            };

            InitDynamicList();
        }

        // region
        function InitDynamicList() {
            DynamicListCtrl.ePage.Masters.DynamicList = {};
            if (DynamicListCtrl.baseFilter) {
                DynamicListCtrl.ePage.Masters.DynamicList.BaseFilterFields = {};
            }

            InitHeader();
            InitFilter();
            InitCustomized();

            if (DynamicListCtrl.dataentryName && DynamicListCtrl.mode) {
                GetDataEntryDetails();
            }
        }

        function GetDataEntryDetails() {
            DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter = angular.copy(DynamicListCtrl.baseFilter);

            var _filter = {
                DataEntryName: DynamicListCtrl.dataentryName,
                IsRoleBassed: false,
                IsAccessBased: false
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);
                    if (!_isEmpty) {
                        if (response.data.Response.LookUpList) {
                            dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response.LookUpList);
                        }
                        DynamicListCtrl.ePage.Masters.DynamicList.DataEntry = response.data.Response;

                        if (DynamicListCtrl.mode == 1) {
                            GetRelatedLookupList();
                        }

                        if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI) {
                            if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI.indexOf("@") !== -1) {
                                var _filterAPI = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI).split("/");

                                _filterAPI.map(function (value, key) {
                                    if (value.indexOf("@") !== -1) {
                                        _filterAPI[key] = authService.getUserInfo()[_filterAPI[key].slice(1)];
                                    }
                                });

                                DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI = _filterAPI.join("/");
                            }
                        }

                        var _colList = [];
                        DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header.map(function (value, key) {
                            if (!value.IsVisible && value.IsMandatory) {
                                _colList.push(value);
                            } else if (value.IsVisible) {
                                _colList.push(value);
                            }
                        });

                        if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.FilterConfig) {
                            if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.FilterConfig.NoOfColumn) {
                                DynamicListCtrl.ePage.Masters.DynamicList.Filter.ViewType = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.FilterConfig.NoOfColumn;
                            }
                        }

                        DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header = _colList;
                        DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumnAll = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header);

                        DynamicListCtrl.dataentryObject = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry;

                        InitGrid();

                        if (DynamicListCtrl.mode == 1 && DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig) {
                            if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableFavoriteShortcutFilter) {
                                GetUserDefaultFilter();
                            } else {
                                SetDefaultFilter();
                            }
                        } else {
                            SetDefaultFilter();
                        }
                    } else {
                        DynamicListCtrl.ePage.Masters.DynamicList.IsEmptyDataEntryName = true;
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                PageFK: DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        // Default Filter
        function GetUserDefaultFilter() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_DEFAULTSEARCHFILTER",
                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                var _response;
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        _response = response.data.Response[0];
                        if (_response.Value) {
                            _response.Value = JSON.parse(_response.Value);

                            for (var x in _response.Value) {
                                if (_response.Value[x].indexOf("@") != -1) {
                                    _response.Value[x] = helperService.DateFilter(_response.Value[x]);
                                }
                            }

                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = _response.Value;

                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter = angular.copy(_response);
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.UserDefaultFilter = angular.copy(_response);
                        }
                    }
                }

                if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DefaultFilter && !_response) {
                    GetAppDefaultFilter();
                } else {
                    SetDefaultFilter();
                }
            });
        }

        function GetAppDefaultFilter() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName,
                "EntitySource": "QUERY",
                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                "PK": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DefaultFilter
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if (_response.Value) {
                            _response.Value = JSON.parse(_response.Value);
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter = angular.copy(_response);
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppDefaultFilter = angular.copy(_response);
                            var _appFilter = {};

                            _response.Value.ExcuteInput.map(function (value1, key1) {
                                if (value1.Type) {
                                    if (value1.Type == "DateCompare") {
                                        var _val = "";
                                        if (typeof value1.value == "string") {
                                            _val = JSON.parse(value1.value);
                                        }

                                        if (_val.length > 0) {
                                            _val.map(function (value2, key2) {
                                                if (value2.FilterInput && value2.FilterInput.length > 0) {
                                                    value2.FilterInput.map(function (value3, key3) {
                                                        value3.Value = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormat);
                                                    });
                                                }
                                            });
                                        }

                                        value1.value = JSON.stringify(_val);
                                    }
                                } else {
                                    var _value = "";
                                    if (typeof value1.value == "string") {
                                        _value = value1.value;
                                    } else {
                                        _value = value1.value.toString();
                                    }

                                    if (_value.indexOf('@') != -1) {
                                        var _date = helperService.DateFilter(_value);
                                        if (value1.Add && value1.Add.length > 0) {
                                            value1.Add.map(function (value, key) {
                                                if (typeof value.Value == "string") {
                                                    value.Value = Number(value.Value);
                                                }
                                                switch (value.FieldName) {
                                                    case "Day":
                                                        var d = new Date(_date);
                                                        _date = new Date(d.setDate(d.getDate() + value.Value));
                                                        break;
                                                    case "Month":
                                                        var d = new Date(_date);
                                                        _date = new Date(d.setMonth(d.getMonth() + value.Value));
                                                        break;
                                                    case "Year":
                                                        var d = new Date(_date);
                                                        _date = new Date(d.setFullYear(d.getFullYear() + value.Value));
                                                        break;
                                                    case "Hour":
                                                        var d = new Date(_date);
                                                        _date = new Date(d.setHours(d.getHours() + value.Value));
                                                        break;
                                                    case "Minute":
                                                        var d = new Date(_date);
                                                        _date = new Date(d.setMinutes(d.getMinutes() + value.Value));
                                                        break;
                                                    case "Second":
                                                        var d = new Date(_date);
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
                                _appFilter[value1.FieldName] = value1.value;
                            });

                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = _appFilter;
                        }
                    }
                }

                SetDefaultFilter();
            });
        }

        function SetDefaultFilter() {
            if (!DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter) {
                DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = {};
            }

            if (DynamicListCtrl.defaultFilter) {
                var _isEmpty = angular.equals({}, DynamicListCtrl.defaultFilter);

                if (!_isEmpty) {
                    for (var x in DynamicListCtrl.defaultFilter) {
                        DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter[x] = DynamicListCtrl.defaultFilter[x];
                    }
                }
            }

            if (DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter) {
                for (var x in DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter) {
                    // DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter["IsDisabled" + x] = true;
                    DynamicListCtrl.ePage.Masters.DynamicList.BaseFilterFields["IsDisabled" + x] = true;
                }
            }

            if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig) {
                DynamicListCtrl.ePage.Masters.DynamicList.EnableCustomizeButton = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableCustomizeButton;
                DynamicListCtrl.ePage.Masters.DynamicList.EnableResetButton = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableResetButton;
                DynamicListCtrl.ePage.Masters.DynamicList.EnableNewButton = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableNewButton;
                DynamicListCtrl.ePage.Masters.DynamicList.EnableAttachButton = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableAttachButton;
                DynamicListCtrl.ePage.Masters.DynamicList.EnableFilterButton = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableFilterButton;
                DynamicListCtrl.ePage.Masters.DynamicList.EnableClearButton = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableClearButton;
                DynamicListCtrl.ePage.Masters.DynamicList.EnableUserFavoriteButton = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableUserFavoriteButton;

                if (DynamicListCtrl.mode == 1) {
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableAttachButton = false;
                    if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableFavoriteShortcutFilter) {
                        GetFavoriteShortcutList();
                    }

                    if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableCustomizeButton) {
                        GetUserBasedGridColumList();
                    } else {
                        $timeout(function () {
                            DynamicControlFilter();
                        });
                    }
                } else if (DynamicListCtrl.mode == 2) {
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableAttachButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableResetButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableUserFavoriteButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableClearButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableCustomizeButton = false;

                    (DynamicListCtrl.isNewButton) ? DynamicListCtrl.ePage.Masters.DynamicList.EnableNewButton = true: DynamicListCtrl.ePage.Masters.DynamicList.EnableNewButton = false;
                    $timeout(function () {
                        DynamicControlFilter();
                    });
                } else if (DynamicListCtrl.mode == 3) {
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableAttachButton = true;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableResetButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableNewButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableUserFavoriteButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableClearButton = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.EnableCustomizeButton = false;

                    $timeout(function () {
                        DynamicControlFilter();
                    });
                }
            } else {
                $timeout(function () {
                    DynamicControlFilter();
                });
            }

            AddFilterControlVisibleDisable();

            // if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties) {
            //     if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties.IsEnableParties) {
            //         if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties.FKField) {
            //             InitParties();
            //         }
            //     }
            // }
        }
        // endregion

        // ======================Header======================
        // region
        function InitHeader() {
            DynamicListCtrl.ePage.Masters.DynamicList.Header = {};
            DynamicListCtrl.ePage.Masters.DynamicList.Header.FavoriteShortcutFilter = {};
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList = {
                ListSource: []
            };
            DynamicListCtrl.ePage.Masters.DynamicList.Header.RecentFilter = {};
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter = {};
            DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter = {};

            DynamicListCtrl.ePage.Masters.DynamicList.Header.GetFavoriteCount = GetFavoriteCount;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.OnFavoriteClick = OnFavoriteClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.DeleteUserFavorites = DeleteUserFavoritesConfirmation;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.OnRecentFavoriteClick = OnRecentFavoriteClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.OnFavoriteStarClick = OnFavoriteStarClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SetUserDeafultFilter = SetUserDeafultFilter;

            // Buttons
            DynamicListCtrl.ePage.Masters.DynamicList.Header.Refresh = OnRefreshBtnClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.CustomizeGridColumn = CustomizeGridColumn;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.Reset = OnResetBtnClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.Attach = OnAttachBtnClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.New = OnNewBtnClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.Filter = OnFilterBtnClick;

            helperService.refreshGrid = OnRefreshBtnClick;
        }

        function GetFavoriteShortcutList() {
            DynamicListCtrl.ePage.Masters.DynamicList.Header.FavoriteShortcutFilter.ListSource = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_SHORTCUT",
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.FavoriteShortcutFilter.ListSource = response.data.Response;
                } else {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.FavoriteShortcutFilter.ListSource = [];
                }

                if (DynamicListCtrl.mode == 1 && DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableRecentFilter) {
                    GetRecentFilterList();
                }
                if (DynamicListCtrl.mode == 1 && DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableSystemDefaultFilter) {
                    GetSystemFilterList();
                }
                if (DynamicListCtrl.mode == 1 && DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.EnableUserDefaultFilter) {
                    GetUserFilterList();
                }
            });
        }

        function GetRecentFilterList() {
            DynamicListCtrl.ePage.Masters.DynamicList.Header.RecentFilter.ListSource = undefined;
            var _filter = {
                ActionType: "Transaction",
                EntitySource: DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.FilterConfig.EntitySource,
                CreatedBy: authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecSessionActivity.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecSessionActivity.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.RecentFilter.ListSource = response.data.Response;
                } else {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.RecentFilter.ListSource = [];
                }
            });
        }

        function GetSystemFilterList() {
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ListSource = undefined;
            var _filter = {
                "EntitySource": "QUERY",
                "SourceEntityRefKey": DynamicListCtrl.dataentryName,
                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ListSource = response.data.Response;

                    if (DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ListSource.length > 0) {
                        MergeSystemUserSettings(DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ListSource);
                    }
                } else {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ListSource = [];
                }
            });
        }

        function GetUserFilterList() {
            DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_FAVORITES",
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource = response.data.Response;

                    if (DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource.length > 0) {
                        MergeSystemUserSettings(DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource);
                    }
                } else {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource = [];
                }
            });
        }

        function MergeSystemUserSettings($item) {
            if ($item) {
                if ($item.length > 0) {
                    $item.map(function (value, key) {
                        DynamicListCtrl.ePage.Masters.DynamicList.Header.FavoriteShortcutFilter.ListSource.map(function (val, key) {
                            if ((val.EntitySource === DynamicListCtrl.dataentryName.toUpperCase() + "_SHORTCUT") && (val.Value === value.PK)) {
                                value.IsStarred = true;
                            }
                        });

                        if (DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter) {
                            if (value.Key == DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter.Key) {
                                value.IsDefaultFilter = true;
                            }
                        }

                        DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.push(value);
                    });
                }
            }
        }

        function GetFavoriteCount(obj, $index) {
            if (obj.Value) {
                var _data;
                if (typeof obj.Value == "string") {
                    _data = JSON.parse(obj.Value);
                }
                if (_data.ShowCount) {
                    obj.ShowCount = _data.ShowCount;
                    obj.IsExcute = _data.IsExcute;
                    _data.CountInput.map(function (value1, key1) {
                        if (value1.Type) {
                            if (value1.Type == "DateCompare") {
                                var _val = "";
                                if (typeof value1.value == "string") {
                                    _val = JSON.parse(value1.value);
                                }

                                if (_val.length > 0) {
                                    _val.map(function (value2, key2) {
                                        if (value2.FilterInput && value2.FilterInput.length > 0) {
                                            value2.FilterInput.map(function (value3, key3) {
                                                value3.Value = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormat);
                                            });
                                        }
                                    });
                                }

                                value1.value = JSON.stringify(_val);
                            }
                        } else {
                            var _value = "";
                            if (typeof value1.value == "string") {
                                _value = value1.value;
                            } else {
                                _value = value1.value.toString();
                            }

                            if (_value.indexOf('@') != -1) {
                                var _date = helperService.DateFilter(_value);
                                if (value1.Add && value1.Add.length > 0) {
                                    value1.Add.map(function (value, key) {
                                        if (typeof value.Value == "string") {
                                            value.Value = Number(value.Value);
                                        }
                                        switch (value.FieldName) {
                                            case "Day":
                                                var d = new Date(_date);
                                                _date = new Date(d.setDate(d.getDate() + value.Value));
                                                break;
                                            case "Month":
                                                var d = new Date(_date);
                                                _date = new Date(d.setMonth(d.getMonth() + value.Value));
                                                break;
                                            case "Year":
                                                var d = new Date(_date);
                                                _date = new Date(d.setFullYear(d.getFullYear() + value.Value));
                                                break;
                                            case "Hour":
                                                var d = new Date(_date);
                                                _date = new Date(d.setHours(d.getHours() + value.Value));
                                                break;
                                            case "Minute":
                                                var d = new Date(_date);
                                                _date = new Date(d.setMinutes(d.getMinutes() + value.Value));
                                                break;
                                            case "Second":
                                                var d = new Date(_date);
                                                _date = new Date(d.setSeconds(d.getSeconds() + value.Value));
                                                break;
                                            default:
                                                _date = new Date(value.Value);
                                                break;
                                        }
                                    });
                                    value1.value = $filter('date')(new Date(_date), APP_CONSTANT.DatePicker[value1.Format]);
                                } else{
                                    value1.value = _date;
                                }
                            }
                        }
                    });

                    var urlInput = _data.CountAPI;
                    var StringUrl = '';
                    urlInput.split('/').map(function (ele) {
                        var el = ele.charAt(0);
                        if (el == '@') {
                            var _urlFilter = helperService.DateFilter(ele);
                            StringUrl += '/' + _urlFilter;
                        } else {
                            StringUrl += '/' + ele;
                        }
                    });

                    _data.CountInput.TenantCode = authService.getUserInfo().TenantCode;
                    var _input = {
                        "searchInput": _data.CountInput,
                        "FilterID": _data.CountFilterID
                    };

                    if (_data.CountRequestMethod == 'get') {
                        apiService.get("eAxisAPI", StringUrl.substr(1)).then(function (response) {
                            if (response.data.Response) {
                                obj.Count = response.data.Response;
                            }
                        });
                    } else {
                        apiService.post("eAxisAPI", StringUrl.substr(1), _input).then(function (response) {
                            if (response.data.Response) {
                                obj.Count = response.data.Response;
                            }
                        });
                    }
                }
            }
        }

        function OnFavoriteClick(obj, type) {
            if (obj) {
                DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ActiveFilter = undefined;
                DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ActiveFilter = undefined;
                DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ActiveFilter = obj.Key;

                if (type === "user") {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ActiveFilter = obj.Key;
                } else if (type === "system") {
                    DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ActiveFilter = obj.Key;
                } else if (type === "starred") {}

                var _data = obj.Value;
                if (typeof obj.Value == "string") {
                    _data = JSON.parse(obj.Value);
                }

                _data.ExcuteInput.map(function (value1, key1) {
                    if (value1.Type) {
                        if (value1.Type == "DateCompare") {
                            var _val = "";
                            if (typeof value1.value == "string") {
                                _val = JSON.parse(value1.value);
                            }

                            if (_val.length > 0) {
                                _val.map(function (value2, key2) {
                                    if (value2.FilterInput && value2.FilterInput.length > 0) {
                                        value2.FilterInput.map(function (value3, key3) {
                                            value3.Value = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormat);
                                        });
                                    }
                                });
                            }

                            value1.value = JSON.stringify(_val);
                        }
                    } else {
                        var _value = "";
                        if (typeof value1.value == "string") {
                            _value = value1.value;
                        } else {
                            _value = value1.value.toString();
                        }

                        if (_value.indexOf('@') != -1) {
                            var _date = helperService.DateFilter(_value);
                            if (value1.Add && value1.Add.length > 0) {
                                value1.Add.map(function (value, key) {
                                    if (typeof value.Value == "string") {
                                        value.Value = Number(value.Value);
                                    }
                                    switch (value.FieldName) {
                                        case "Day":
                                            var d = new Date(_date);
                                            _date = new Date(d.setDate(d.getDate() + value.Value));
                                            break;
                                        case "Month":
                                            var d = new Date(_date);
                                            _date = new Date(d.setMonth(d.getMonth() + value.Value));
                                            break;
                                        case "Year":
                                            var d = new Date(_date);
                                            _date = new Date(d.setFullYear(d.getFullYear() + value.Value));
                                            break;
                                        case "Hour":
                                            var d = new Date(_date);
                                            _date = new Date(d.setHours(d.getHours() + value.Value));
                                            break;
                                        case "Minute":
                                            var d = new Date(_date);
                                            _date = new Date(d.setMinutes(d.getMinutes() + value.Value));
                                            break;
                                        case "Second":
                                            var d = new Date(_date);
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
                });

                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.OtherConfig.CSS.IsAutoListing = true;

                DynamicControlFilter(_data);
            }
        }

        function OnFavoriteStarClick(obj, type, isStarred) {
            if (obj) {
                var _index = DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(obj.PK);

                if (_index !== -1) {
                    if (!isStarred) {
                        var _count = 0;
                        DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.map(function (val, key) {
                            _count += val.IsStarred ? 1 : 0;
                        });

                        if (_count < 3) {
                            var _input = {
                                "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_SHORTCUT",
                                "Key": obj.Key,
                                "Value": obj.PK,
                                "SAP_FK": authService.getUserInfo().AppPK,
                                "TenantCode": authService.getUserInfo().TenantCode,
                                "SourceEntityRefKey": authService.getUserInfo().UserId,
                                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                            };

                            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                                if (response.data.Response) {
                                    if (response.data.Response.length > 0) {
                                        DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource[_index].IsStarred = true;
                                        var _obj = angular.copy(response.data.Response[0]);
                                        DynamicListCtrl.ePage.Masters.DynamicList.Header.FavoriteShortcutFilter.ListSource.push(_obj);
                                    }
                                }
                            });
                        } else {
                            toastr.warning("Cannot add more than 3 favourites", "Favourite Starred");
                        }
                    } else {
                        DynamicListCtrl.ePage.Masters.DynamicList.Header.FavoriteShortcutFilter.ListSource.map(function (value, key) {
                            if (value.Value === obj.PK && value.Key === obj.Key) {
                                var _input = value;
                                _input.IsDeleted = true;
                                _input.IsModified = true;

                                apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                                    if (response.data.Response) {
                                        DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource[_index].IsStarred = false;
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }

        function DeleteUserFavoritesConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteUserFavorites($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteUserFavorites($item) {
            if ($item) {
                var _input = {
                    "PK": $item.PK,
                    "IsModified": true,
                    "IsDeleted": true
                };

                apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                    if (response.data.Response) {
                        var _indexUser = DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf($item.PK);

                        if (_indexUser != -1) {
                            DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource.splice(_indexUser, 1);
                        }

                        var _index = DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf($item.PK);

                        if (_index != -1) {
                            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.splice(_index, 1);
                        }
                        toastr.success("Favorite Removed Successfully...!");
                    }
                });
            }
        }

        function OnRecentFavoriteClick($item) {
            var _obj = {
                action: "dblClick",
                data: {
                    entity: {
                        PK: $item.EntityRefKey,
                        [DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy.GridConfig.StarredKeyField]: $item.EntityDescription
                    }
                }
            };
        }

        function SetUserDeafultFilter($item, type, isdefaultFilter) {
            var _item = $item;
            if (_item) {
                if (_item.Value) {
                    if (typeof _item.Value == "string") {
                        _item.Value = JSON.parse(_item.Value);
                    }

                    if (_item.Value.ExcuteInput) {
                        if (!isdefaultFilter) {
                            var _isExist = DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.some(function (value, key) {
                                return value.IsDefaultFilter;
                            });

                            if (_isExist) {
                                DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.map(function (value, key) {
                                    if (value.IsDefaultFilter) {
                                        SaveUserDefaultSearchFilter(_item, "delete", "deleteAndInsert");
                                    }
                                });
                            } else {
                                SaveUserDefaultSearchFilter(_item, "insert", "insert");
                            }
                        } else {
                            SaveUserDefaultSearchFilter(_item, "delete", "delete");
                        }
                    }
                }
            }
        }

        function SaveUserDefaultSearchFilter($item, type, mode) {
            if ($item) {
                var _searhInput = {},
                    _input = {};

                $item.Value.ExcuteInput.map(function (value, key) {
                    _searhInput[value.FieldName] = value.value;
                });

                if (type == "delete") {
                    _input = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter);
                    _input.IsModified = true;
                    _input.IsDeleted = true;
                    if (_input.Value) {
                        _input.Value = JSON.stringify(_input.Value);
                    }
                } else if (type == "insert") {
                    var _obj = {
                        "SAP_FK": authService.getUserInfo().AppPK,
                        "AppCode": authService.getUserInfo().AppCode,
                        "TenantCode": authService.getUserInfo().TenantCode,
                        "SourceEntityRefKey": authService.getUserInfo().UserId,
                        "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_DEFAULTSEARCHFILTER",
                        "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                        "Key": $item.Key,
                        "Value": JSON.stringify(_searhInput),
                        "IsJSON": true,
                        "IsModified": true
                    };
                    _input = _obj;
                }
            }

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (type == "delete") {
                        DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.map(function (value, key) {
                            if (value.IsDefaultFilter) {
                                value.IsDefaultFilter = false;
                            }
                        });

                        if (mode == "deleteAndInsert") {
                            SaveUserDefaultSearchFilter($item, "insert");
                        }
                    } else if (type == "insert") {
                        if (response.data.Response.length > 0) {
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter = response.data.Response[0];
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter.IsDefaultFilter = true;
                            $item.Value = JSON.stringify($item.Value);
                            $item.IsDefaultFilter = true;
                        }
                    }
                }
            });
        }

        // Button Actins
        function OnRefreshBtnClick() {
            ApplyFilter();
        }

        function OnResetBtnClick() {
            ClearFilterInput();

            DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ActiveFilter = undefined;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ActiveFilter = undefined;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ActiveFilter = undefined;

            if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsAutoListing) {
                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.OtherConfig.CSS.IsAutoListing = DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsAutoListing;
            }

            $timeout(function () {
                if (DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter) {
                    DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (value, key) {
                        if (!value.Data) {
                            value.Data = {};
                        }
                        for (var x in DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter) {
                            value.Data[x] = DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter[x];
                            // DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter["IsDisabled" + x] = true;
                            DynamicListCtrl.ePage.Masters.DynamicList.BaseFilterFields["IsDisabled" + x] = true;
                        }
                    });
                }

                if (DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter) {
                    DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (value, key) {
                        if (!value.Data) {
                            value.Data = {};
                        }
                        for (var x in DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter.Value) {
                            value.Data[x] = DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter.Value[x];
                        }
                    });
                }

                DynamicControlFilter();
            });
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
            if (DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItemList) {
                if (DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItemList.length > 0) {
                    DynamicListCtrl.selectedGridRow({
                        $item: {
                            action: "multiSelect",
                            data: DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItem,
                            items: DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItemList
                        }
                    });
                }
            }
        }

        function OnFilterBtnClick() {
            $('#filterSideBar' + DynamicListCtrl.dataentryName).addClass('open');
        }
        // endregion

        // ======================Customized======================
        // region
        function InitCustomized() {
            DynamicListCtrl.ePage.Masters.DynamicList.Customized = {};
            InitCustomizedGrid();
            InitCustomizedFilter();
        }

        // Customize Grid
        function InitCustomizedGrid() {
            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid = {};
            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid = {};

            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.TogglePanel = ToggleCustomizeGrigPanel;
            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.Save = SaveCustomizeGridColumn;

            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.SaveBtnText = "Save";
            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsSaveBtnDisable = false;
        }

        function CustomizeGridColumn() {
            $(".cusomize-grid-column").addClass("open");
        }

        function ToggleCustomizeGrigPanel() {
            $(".cusomize-grid-column").removeClass("open");
        }

        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_GRIDCOLUMN",
                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid = angular.copy(response.data.Response[0]);
                        var _value = response.data.Response[0].Value;
                        if (_value) {
                            _value = JSON.parse(_value);
                            var _response = _value;

                            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsAutoListing = _response.IsAutoListing;
                            DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.CSS.IsAutoListing = _response.IsAutoListing;
                            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList = _response.Column;

                            if (_response.Column.length > 0) {
                                DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumnAll.map(function (value1, key1) {
                                    (!value1.IsMandatory) ? value1.IsVisible = false: value1.IsVisible = true;

                                    _response.Column.map(function (value2, key2) {
                                        if (value1.field == value2.field) {
                                            value1.IsVisible = true;
                                            value1.displayName = value2.displayName;
                                            value1.width = value2.width;
                                        }
                                    });
                                });
                            }
                        }
                    }
                }

                DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumn = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumnAll);

                if (!DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.CSS.IsAutoListing) {
                    DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = {};
                }

                DynamicControlFilter();
            });
        }

        function DynamicControlFilter($item) {
            var _dataEntryCopy, _defaultFilter = [];
            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy = undefined;

            if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter) {
                _dataEntryCopy = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter);
            } else {
                _dataEntryCopy = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntry);
            }

            $timeout(function () {
                if ($item) {
                    _dataEntryCopy.FilterAPI = $item.API;
                    _dataEntryCopy.FilterID = $item.FilterID;
                    _defaultFilter = $item.ExcuteInput;
                } else {
                    var _tempArray = [];
                    var _obj = {
                        'FilterType': DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName
                    };
                    _tempArray.push(helperService.createToArrayOfObject(_obj)[0]);

                    _dataEntryCopy.Entities.map(function (value, key) {
                        var _list = helperService.createToArrayOfObject(value.Data);
                        _list.map(function (value, key) {
                            _tempArray.push(value);
                        });
                        _defaultFilter = _tempArray;
                    });
                }

                if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList) {
                    if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList.length > 0) {
                        var _colList = [];
                        _dataEntryCopy.GridConfig.Header.map(function (value1, key1) {
                            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList.map(function (value2, key2) {
                                if (value1.field == value2.field) {
                                    value2 = value1;
                                    _colList.push(value1);
                                }
                            });
                        });

                        // _dataEntryCopy.GridConfig.Header = _colList;
                        _dataEntryCopy.GridConfig.Header = DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList;
                    }
                }

                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy = _dataEntryCopy;
                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter = angular.copy(_dataEntryCopy);
                DynamicListCtrl.ePage.Masters.DynamicList.DefaultFilter = _defaultFilter;

                if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties) {
                    if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties.IsEnableParties) {
                        if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties.FKField) {
                            var _party = [{
                                SField: DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties.FKField,
                                EField: "Party_Pk"
                            }, {
                                SField: DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Parties.CodeField,
                                EField: "Party_Code"
                            }];

                            if (!DynamicListCtrl.ePage.Masters.DynamicList.DefaultFilter) {
                                DynamicListCtrl.ePage.Masters.DynamicList.DefaultFilter = [];
                            }

                            // if (DynamicListCtrl.ePage.Masters.DynamicList.Parties.ActivePartyType) {
                            //     _party.map(function (value, key) {
                            //         // if (value.SField == "PartyType_FK") {
                            //             var _filter = {
                            //                 FieldName: value.SField,
                            //                 Value: DynamicListCtrl.ePage.Masters.DynamicList.Parties.ActivePartyType[value.EField]
                            //             };

                            //             DynamicListCtrl.ePage.Masters.DynamicList.DefaultFilter.push(_filter);
                            //         // }
                            //     });
                            // }
                        }
                    }
                }
            });
        }

        function SaveCustomizeGridColumn() {
            if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumn) {
                if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumn.length > 0) {
                    DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.SaveBtnText = "Please Wait...";
                    DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsSaveBtnDisable = true;

                    var _column = [];
                    DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumn.map(function (value, key) {
                        if (value.IsVisible) {
                            _column.push(value);
                        }
                    });

                    if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.PK) {
                        var _input = DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid;
                        if (typeof _input.Value == "string") {
                            _input.Value = JSON.parse(_input.Value);
                        }
                        _input.Value.Column = _column;
                        _input.Value.IsAutoListing = DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsAutoListing;
                        _input.Value = JSON.stringify(_input.Value);
                        _input.IsModified = true;
                    } else {
                        var _input = {
                            "SAP_FK": authService.getUserInfo().AppPK,
                            "AppCode": authService.getUserInfo().AppCode,
                            "TenantCode": authService.getUserInfo().TenantCode,
                            "SourceEntityRefKey": authService.getUserInfo().UserId,
                            "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_GRIDCOLUMN",
                            "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                            "Key": "GridColumn",
                            "Value": {
                                "Column": _column,
                                'IsAutoListing': (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.CSS.IsAutoListing) ? true : false
                            },
                            "IsJSON": true,
                            "IsModified": true
                        };
                        _input.Value = JSON.stringify(_input.Value);
                    }

                    apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 0) {
                                DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid = angular.copy(response.data.Response[0]);
                                var _value = response.data.Response[0].Value;
                                if (_value) {
                                    _value = JSON.parse(_value);
                                    DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList = angular.copy(_value.Column);
                                    DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsAutoListing = angular.copy(_value.IsAutoListing);
                                    DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.OtherConfig.CSS.IsAutoListing = _value.IsAutoListing;
                                }
                            }
                        }

                        DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.SaveBtnText = "Save";
                        DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsSaveBtnDisable = false;
                        ToggleCustomizeGrigPanel();

                        if (!DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.OtherConfig.CSS.IsAutoListing) {
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = {};
                        }
                        DynamicControlFilter();
                    });
                }
            }
        }

        // Customize Filter
        function InitCustomizedFilter() {
            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeList = {};
            DynamicListCtrl.ePage.Masters.DynamicList.CustomizeList.SaveFilterDislike = SaveFilterDislike;
        }

        function SaveFilterDislike($item) {
            var _input = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName.toUpperCase() + "_FILTERDISLIKE",
                "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                "Key": $item.FieldName,
                "IsJSON": false,
                "IsModified": true,
                "Value": $item.DataEntryPK,
                "SAP_FK": authService.getUserInfo().AppPK,
                "AppCode": authService.getUserInfo().AppCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };

            if (!$item.Include) {
                _input.IsDeleted = false;

                apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                    if (response.data.Response) {
                        $item.Include_FK = response.data.Response[0].PK;
                    }
                });
            } else if ($item.Include) {
                _input.IsDeleted = true;
                _input.PK = $item.Include_FK;

                apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {});
            }
        }
        // endregion

        // ======================Filter======================
        // region
        function InitFilter() {
            DynamicListCtrl.ePage.Masters.DynamicList.Filter = {};

            DynamicListCtrl.ePage.Masters.DynamicList.Filter.ViewType = 1;
            DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting = {
                Input: {}
            };

            DynamicListCtrl.ePage.Masters.DynamicList.Filter.TogglePanel = ToggleFilterPanel;
            DynamicListCtrl.ePage.Masters.DynamicList.Filter.Apply = ApplyFilter;
            DynamicListCtrl.ePage.Masters.DynamicList.Filter.Clear = ClearFilterInput;
            DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.Save = SaveUserSetting;

            DynamicListCtrl.ePage.Masters.DynamicList.Filter.ApplyBtnText = "Apply";
            DynamicListCtrl.ePage.Masters.DynamicList.Filter.IsApplyBtnDisable = false;

            DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.SaveSettingBtnText = "Save";
            DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.IsDisableSaveSettingBtn = false;
        }

        function AddFilterControlVisibleDisable() {
            DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.Entities.map(function (value1, key1) {
                if (value1.ConfigData && value1.ConfigData.length > 0) {
                    value1.ConfigData.map(function (value3, key3) {
                        if (value3.AttributesDetails.DefaultValue) {
                            switch (value3.AttributesDetails.UIControl) {
                                case "Lookup":
                                    value3.AttributesDetails.DefaultValue = JSON.parse(value3.AttributesDetails.DefaultValue);

                                    for (var x in value3.AttributesDetails.DefaultValue) {
                                        if (x != value3.PropertyName) {
                                            value1.Data[x] = value3.AttributesDetails.DefaultValue[x];
                                        }
                                    }

                                    value1.Data[value3.PropertyName] = value3.AttributesDetails.DefaultValue[value3.PropertyName];
                                    break;
                                case "checkbox":
                                    value1.Data[value3.PropertyName] = (value3.AttributesDetails.DefaultValue == "true") ? true : null;
                                    break;
                                default:
                                    value1.Data[value3.PropertyName] = value3.AttributesDetails.DefaultValue;
                                    break;
                            }
                        } else {
                            switch (value3.AttributesDetails.UIControl) {
                                case "tenant":
                                    value1.Data[value3.PropertyName] = authService.getUserInfo().TenantCode;
                                    break;
                                case "user":
                                    value1.Data[value3.PropertyName] = authService.getUserInfo().UserId;
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                }
                if (DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter) {
                    for (var x in DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter) {
                        value1.Data[x] = DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter[x];
                    }
                }
                if ((DynamicListCtrl.mode === 2 || DynamicListCtrl.mode === 3) && dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey]) {
                    if (dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig) {
                        if (typeof dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig == "string") {
                            dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig = JSON.parse(dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig);
                        }

                        value1.CSS = {};
                        value1.ConfigData.map(function (value2, key2) {
                            value1.CSS["Is" + value2.PropertyName + "Visible"] = true;
                            value1.CSS["Is" + value2.PropertyName + "Disable"] = false;

                            if (dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig.CSS) {
                                var _isEmpty = angular.equals({}, dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig.CSS);

                                if (!_isEmpty) {
                                    value1.CSS["Is" + value2.PropertyName + "Visible"] = dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig.CSS["Is" + value2.PropertyName + "Visible"];
                                    value1.CSS["Is" + value2.PropertyName + "Disable"] = dynamicLookupConfig.Entities[DynamicListCtrl.lookupConfigControlKey].OtherConfig.CSS["Is" + value2.PropertyName + "Disable"];
                                }
                            }
                        });
                    }
                }
            });
        }

        function ToggleFilterPanel() {
            $('#filterSideBar' + DynamicListCtrl.dataentryName).removeClass('open');
        }

        function SaveUserSetting() {
            if (DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.Input.Key) {
                var x = DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.FilterAPI.split("/");
                x.splice(x.length - 1, 1);
                var strUrl = x.join("/");
                var allObj = {};
                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (value, key) {
                    var _isEmpty = angular.equals({}, value.Data);
                    if (!_isEmpty) {
                        DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.SaveSettingBtnText = "Please Wait...";
                        DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.IsDisableSaveSettingBtn = true;

                        DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (val, key) {
                            for (var key in val.Data) {
                                allObj[key] = val.Data[key];
                            }
                        });

                        var objJson = {
                            "ExcuteInput": (helperService.createToArrayOfObject(allObj)),
                            "CountInput": (helperService.createToArrayOfObject(allObj)),
                            "ShowCount": true,
                            "ShowInDashboard": true,
                            "CountAPI": strUrl + '/FindCount',
                            "CountFilterID": DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.FilterID,
                            "CountRequestMethod": "post",
                            "ExcuteRequestMethod": "post",
                            "IsExcute": true,
                            "API": DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.FilterAPI,
                            "FilterID": DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.FilterID,
                            "CSS": {
                                "color": "#e7505a",
                                "icon": "fa fa-star-o"
                            }
                        };
                        var _input = [{
                            "SourceEntityRefKey": authService.getUserInfo().UserId,
                            "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_FAVORITES",
                            "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                            "Key": DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.Input.Key,
                            "IsJSON": true,
                            "IsModified": true,
                            "Value": JSON.stringify(objJson),
                            "SAP_FK": authService.getUserInfo().AppPK,
                            "AppCode": authService.getUserInfo().AppCode,
                            "TenantCode": authService.getUserInfo().TenantCode
                        }];

                        apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                            if (response.data.Response) {
                                if (response.data.Response.length > 0) {
                                    DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource.push(response.data.Response[0]);
                                    DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ListSource.push(response.data.Response[0]);

                                    DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.IsShowSaveSettingsTxtBox = !DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.IsShowSaveSettingsTxtBox;

                                    DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.Input = {};

                                    DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.SaveSettingBtnText = "Save";
                                    DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.IsDisableSaveSettingBtn = false;

                                    ToggleFilterPanel();
                                }
                            }
                        });
                    } else {
                        toastr.warning("Please Select at least one field...!");
                    }
                });
            } else {
                toastr.warning("Please Enter the Name...");
            }
        }

        function ClearFilterInput() {
            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy.Entities.map(function (value, key) {
                value.Data = {};
            });
            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (value, key) {
                value.Data = {};
            });
            DynamicListCtrl.ePage.Masters.DynamicList.Filter.SaveUserSetting.Input = {};

            $timeout(function () {
                if (DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter) {
                    for (var x in DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter) {
                        DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (value, key) {
                            value.Data = DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter;
                            // value.Data["IsDisabled" + x] = true;
                            DynamicListCtrl.ePage.Masters.DynamicList.BaseFilterFields["IsDisabled" + x] = true;
                        });
                    }
                }
                DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter = angular.copy(DynamicListCtrl.baseFilter);
            });
        }

        function ApplyFilter() {
            ToggleFilterPanel();

            DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ActiveFilter = undefined;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ActiveFilter = undefined;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ActiveFilter = undefined;

            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy.Filter = [];
            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (value1, key1) {
                value1.ConfigData.map(function (value2, key2) {
                    if (!value2.Include) {
                        delete value1.Data[value2.PropertyName];
                    }
                });

                for (var x in value1.Data) {
                    var _filter = {
                        FieldName: x,
                        Value: value1.Data[x]
                    };
                    DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy.Filter.push(_filter);
                }
            });

            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.OtherConfig.CSS.IsAutoListing = true;

            DynamicListCtrl.ePage.Masters.DynamicList.BaseFilter = angular.copy(DynamicListCtrl.baseFilter);

            DynamicControlFilter();
        }
        // endregion

        // ======================Grid======================
        // region
        function InitGrid() {
            DynamicListCtrl.ePage.Masters.DynamicList.Grid = {};
            DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedGridRow = SelectedGridRow;

            var _gridOptions = {};

            if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig) {
                if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.GridOptions) {
                    _gridOptions = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.GridOptions);
                    _gridOptions.paginationPageSize = JSON.parse(_gridOptions.paginationPageSize);
                    _gridOptions.paginationPageSizes = JSON.parse(_gridOptions.paginationPageSizes);
                    _gridOptions.headerRowHeight = JSON.parse(_gridOptions.headerRowHeight);
                    _gridOptions.rowHeight = JSON.parse(_gridOptions.rowHeight);
                    _gridOptions.gridMenuCustomItems = JSON.parse(_gridOptions.gridMenuCustomItems);
                }
            }

            if (DynamicListCtrl.mode == 2) {
                _gridOptions.enableRowSelection = false;
                _gridOptions.enableRowHeaderSelection = false;
                _gridOptions.enableGridMenu = false;
                _gridOptions.multiSelect = false;
            } else if (DynamicListCtrl.mode == 3) {
                _gridOptions.enableRowSelection = true;
                _gridOptions.enableRowHeaderSelection = true;
                _gridOptions.enableGridMenu = false;
                _gridOptions.multiSelect = true;
            }

            DynamicListCtrl.ePage.Masters.DynamicList.Grid.GridOptions = _gridOptions;
        }

        function SelectedGridRow($item) {
            if (DynamicListCtrl.mode == 1) {
                if ($item.action == 'favorite') {
                    SaveFavoriteItem($item.data);
                } else if ($item.action == 'rowSelection') {
                    DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsStandardToolbar = false;
                    DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsCustomToolbar = false;

                    // if ($item.items.length == 1) {
                    //     if ($item.dataEntryMaster.OtherConfig.ListingPageConfig.EnableStandardToolbar) {
                    //         ConfigureStandardToolBar($item);
                    //     } else if ($item.dataEntryMaster.OtherConfig.ListingPageConfig.EnableCustomToolbar) {
                    //         ConfigureCustomToolBar($item);
                    //     }
                    // } else if ($item.items.length > 1) {
                    //     if ($item.dataEntryMaster.OtherConfig.ListingPageConfig.EnableCustomToolbar) {
                    //         ConfigureCustomToolBar($item);
                    //     }
                    // }

                    if ($item.items.length > 0) {
                        if ($item.dataEntryMaster.OtherConfig.ListingPageConfig.EnableCustomToolbar) {
                            ConfigureCustomToolBar($item);
                        }
                    }

                    DynamicListCtrl.selectedGridRow({
                        $item: $item
                    });
                } else {
                    DynamicListCtrl.selectedGridRow({
                        $item: $item
                    });
                }
            } else if (DynamicListCtrl.mode == 2) {
                DynamicListCtrl.selectedGridRow({
                    $item: $item
                });
            } else if (DynamicListCtrl.mode == 3) {
                DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItem = $item.data;
                DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItemList = $item.items;

                if ($item.action == "link" || $item.action == "dblClick") {
                    DynamicListCtrl.selectedGridRow({
                        $item: {
                            action: $item.action,
                            data: [$item.data.entity],
                            items: $item.items
                        }
                    });
                } else if ($item.action == "rowSelection" || $item.action == "rowSelectionBatch") {

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

        function SaveFavoriteItem(item) {
            var _input = {};
            if (item.entity.IsStarred) {
                _input = {
                    "PK": item.entity.Starred_FK,
                    "IsModified": true,
                    "IsDeleted": true
                };
            } else {
                _input = {
                    "SourceEntityRefKey": authService.getUserInfo().UserId,
                    "Key": item.entity[DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy.GridConfig.StarredKeyField],
                    "Value": item.entity[DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy.GridConfig.StarredValueField],
                    "IsJSON": false,
                    "SAP_FK": authService.getUserInfo().AppPK,
                    "AppCode": authService.getUserInfo().AppCode,
                    "TenantCode": authService.getUserInfo().TenantCode,
                    "EntitySource": DynamicListCtrl.dataentryName.toUpperCase() + "_STARRED",
                    "TypeCode": DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                    "IsModified": true
                };
            }

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (!item.entity.IsStarred && item.entity.Starred_FK == null) {
                            item.entity.IsStarred = true;
                            item.entity.Starred_FK = response.data.Response[0].PK;
                        } else if (item.entity.IsStarred && item.entity.Starred_FK != null) {
                            item.entity.IsStarred = false;
                            item.entity.Starred_FK = null;
                        }
                    } else {
                        item.entity.IsStarred = false;
                        item.entity.Starred_FK = null;
                    }
                }
            });
        }

        function ConfigureStandardToolBar($item) {
            DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsStandardToolbar = false;
            $timeout(function () {
                var _input = {
                    [$item.items[0][DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.CodeFieldName]]: {
                        ePage: {
                            Entities: {
                                Header: {
                                    Data: $item.items[0]
                                }
                            }
                        }
                    },
                    isNew: false,
                    label: $item.items[0][DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.ListingPageConfig.CodeFieldName]
                };

                DynamicListCtrl.ePage.Masters.DynamicList.Grid.StandardMenuInput = angular.copy(_input);

                DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsStandardToolbar = true;
            });
        }

        function ConfigureCustomToolBar($item) {
            DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsCustomToolbar = false;
            $timeout(function () {
                var _input = angular.copy($item.items);
                DynamicListCtrl.ePage.Masters.DynamicList.Grid.CustomToolbarInput = _input;

                DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsCustomToolbar = true;
            });
        }
        // endregion

        // region Parties
        function InitParties() {
            DynamicListCtrl.ePage.Masters.DynamicList.Parties = {};
            DynamicListCtrl.ePage.Masters.DynamicList.Parties.OnPartyChange = OnPartyChange;

            DynamicListCtrl.ePage.Masters.DynamicList.Parties.ListSource = authService.getUserInfo().PartyList;

            if (DynamicListCtrl.ePage.Masters.DynamicList.Parties.ListSource.length > 0) {
                DynamicListCtrl.ePage.Masters.DynamicList.Parties.ActivePartyType = DynamicListCtrl.ePage.Masters.DynamicList.Parties.ListSource[0];
            }
        }

        function OnPartyChange($item) {
            if (DynamicListCtrl.ePage.Masters.DynamicList.Parties.ActivePartyType) {
                if (DynamicListCtrl.ePage.Masters.DynamicList.Parties.ActivePartyType.Party_Pk !== $item.Party_Pk) {
                    DynamicListCtrl.ePage.Masters.DynamicList.Parties.ActivePartyType = $item;
                }
            } else {
                DynamicListCtrl.ePage.Masters.DynamicList.Parties.ActivePartyType = $item
            }

            DynamicControlFilter();
        }
        // endregion

        Init();
    }
})();
