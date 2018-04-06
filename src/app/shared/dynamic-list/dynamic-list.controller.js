(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicListController", DynamicListController);

    DynamicListController.$inject = ["$injector", "$timeout", "$location", "authService", "APP_CONSTANT", "apiService", "helperService", "toastr", "dynamicLookupConfig", "appConfig", "confirmation"];

    function DynamicListController($injector, $timeout, $location, authService, APP_CONSTANT, apiService, helperService, toastr, dynamicLookupConfig, appConfig, confirmation) {
        var DynamicListCtrl = this;

        function Init() {
            DynamicListCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": DynamicListCtrl.config
            };

            helperService.refreshGrid = InitDynamicList;
            InitDynamicList();
        }

        // region
        function InitDynamicList() {
            DynamicListCtrl.ePage.Masters.DynamicList = {};

            InitHeader();
            InitFilter();
            InitCustomized();
            InitGrid();

            if (DynamicListCtrl.dataentryName && DynamicListCtrl.mode) {
                GetDataEntryDetails();
            }

            InitOrder();
        }

        function GetDataEntryDetails() {
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
                        DynamicListCtrl.ePage.Masters.DynamicList.DataEntry = response.data.Response;

                        if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Pagination.NoOfColumn) {
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.ViewType = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Pagination.NoOfColumn;
                        }

                        DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.GridColumnAll = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header);

                        if (DynamicListCtrl.mode != "1") {
                            DynamicListCtrl.dataentryObject = DynamicListCtrl.ePage.Masters.DynamicList.DataEntry;
                        }

                        GetUserDefaultFilter();
                    }
                }
            });
        }

        // Default Filter
        function GetUserDefaultFilter() {
            var _response;
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
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        _response = response.data.Response[0];
                        if (_response.Value) {
                            _response.Value = JSON.parse(_response.Value);
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter = angular.copy(_response);
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.UserDefaultFilter = angular.copy(_response);
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = _response.Value;

                            SetDefaultFilter();
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

                            _response.Value.ExcuteInput.map(function (value, key) {
                                if (value.value.indexOf('@') != -1) {
                                    var _date = helperService.DateFilter(value.value);
                                    value.value = _date;
                                }
                                _appFilter[value.FieldName] = value.value;
                            });
                            DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = _appFilter;
                        }
                    }
                }

                SetDefaultFilter();
            });
        }

        function SetDefaultFilter() {
            if (DynamicListCtrl.defaultFilter) {
                var _isEmpty = angular.equals({}, DynamicListCtrl.defaultFilter);

                if (!_isEmpty) {
                    DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter = DynamicListCtrl.defaultFilter;
                }
            }

            AddFilterControlVisibleDisable();
            GetFavoriteShortcutList();
            GetUserBasedGridColumList();
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
            DynamicListCtrl.ePage.Masters.DynamicList.Header.CustomizeGridColumn = CustomizeGridColumn;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.Reset = OnResetBtnClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.Attach = OnAttachBtnClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.New = OnNewBtnClick;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.Filter = OnFilterBtnClick;
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

                if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig
                    .IsRecentFilter) {
                    GetRecentFilterList();
                }
                if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig
                    .IsSystemFilter) {
                    GetSystemFilterList();
                }
                if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig
                    .IsUserFavoriteFilter) {
                    GetUserFilterList();
                }
            });
        }

        function GetRecentFilterList() {
            DynamicListCtrl.ePage.Masters.DynamicList.Header.RecentFilter.ListSource = undefined;
            var _filter = {
                ActionType: "Transaction",
                EntitySource: DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.OtherConfig.Pagination.EntitySource,
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
                "SourceEntityRefKey": DynamicListCtrl.dataentryName,
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
                    _data.CountInput.map(function (value, key) {
                        if (value.value.indexOf("@") != -1) {
                            var _date = helperService.DateFilter(value.value);
                            value.value = _date;
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
                } else if (type === "starred") { }

                var _data = JSON.parse(obj.Value);
                _data.ExcuteInput.map(function (value, key) {
                    if (value.value.indexOf('@') != -1) {
                        var _date = helperService.DateFilter(value.value);
                        value.value = _date;
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
                                    DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ListSource[_index].IsStarred = true;
                                }
                            });
                        } else {
                            toastr.warning("Cannot add more then 3 favourites", "Favourite Starred", );
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

            // SelectedGridRow(_obj);
        }

        function SetUserDeafultFilter($item, type, isdefaultFilter) {
            var _item = $item;
            if (_item) {
                if (_item.Value) {
                    _item.Value = JSON.parse(_item.Value);

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
        function OnResetBtnClick() {
            ClearFilterInput();
            DynamicListCtrl.ePage.Masters.DynamicList.Header.UserFilter.ActiveFilter = undefined;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemFilter.ActiveFilter = undefined;
            DynamicListCtrl.ePage.Masters.DynamicList.Header.SystemUserFavouriteList.ActiveFilter = undefined;

            if (DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter) {
                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.Entities.map(function (value, key) {
                    value.Data = DynamicListCtrl.ePage.Masters.DynamicList.Filter.AppUserDefaultFilter.Value;
                });
            }

            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter.OtherConfig.CSS.IsAutoListing = DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsAutoListing;
            DynamicControlFilter();
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
            if (DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItems) {
                if (DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItems.length > 0) {
                    DynamicListCtrl.selectedGridRow({
                        $item: {
                            "action": "multiSelect",
                            "data": DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedItems
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
                                    (!value1.IsMandatory) ? value1.IsVisible = false : value1.IsVisible = true;

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
            var _dataEntryCopy;

            if (DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter) {
                _dataEntryCopy = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter);
            } else {
                _dataEntryCopy = angular.copy(DynamicListCtrl.ePage.Masters.DynamicList.DataEntry);
            }

            DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy = undefined;

            $timeout(function () {
                if ($item) {
                    _dataEntryCopy.FilterAPI = $item.API;
                    _dataEntryCopy.FilterID = $item.FilterID;
                    _dataEntryCopy.RequestMethod = $item.ExcuteRequestMethod;
                    _dataEntryCopy.Filter = $item.ExcuteInput;
                } else {
                    var _tempArray = [];
                    var _obj = {
                        'FilterType': DynamicListCtrl.dataentryName
                    };
                    _tempArray.push(helperService.createToArrayOfObject(_obj)[0]);

                    _dataEntryCopy.Entities.map(function (value, key) {
                        var _list = helperService.createToArrayOfObject(value.Data);
                        _list.map(function (value, key) {
                            _tempArray.push(value);
                        });
                        _dataEntryCopy.Filter = _tempArray;
                    });
                }

                if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList) {
                    if (DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList.length > 0) {
                        _dataEntryCopy.GridConfig.Header = DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.UserBasedGrid.ColumnList;
                    }
                }

                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryCopy = _dataEntryCopy;
                DynamicListCtrl.ePage.Masters.DynamicList.DataEntryForFilter = angular.copy(_dataEntryCopy);
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
                                'IsAutoListing': DynamicListCtrl.ePage.Masters.DynamicList.CustomizeGrid.IsAutoListing
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

                apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {

                });
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

            InitLookupMaster();
        }

        function InitLookupMaster() {
            var _isEmptyLookupConfig = angular.equals({}, dynamicLookupConfig.Entities);
            if (_isEmptyLookupConfig) {
                GetLookupMasterList();
            }
        }

        function GetLookupMasterList() {
            var _dataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,Warehouse,WarehouseRow,WarehouseArea,OrgHeader,WarehouseOutward,WarehouseInward,WarehouseTransport,ProductRelatedParty,MstServiceLevel,CurrencyMaster,CarrierServiceLevel,MDM_CarrierList,WarehouseLocation,InwardDockDoor,MstCountry,WarehouseLocationType,PickupAndDeliveryOrders,TransportPickupandDelivery,TransportsConsignment,TransportItem,TransportsManifest,TmsConsignmentItem,OrgZone,ConsignmentLeg";
            var _filter = [{
                "FieldName": "DataEntryNameList",
                "value": _dataEntryNameList
            }];
            var _input = {
                "searchInput": _filter,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            dynamicLookupConfig.Entities[value.DataEntryName] = value;
                        });
                    }
                }
            });
        }

        function AddFilterControlVisibleDisable() {
            DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.Entities.map(function (value1, key1) {
                if (DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter) {
                    value1.Data = DynamicListCtrl.ePage.Masters.DynamicList.Filter.DefaultFilter;
                }
                if ((DynamicListCtrl.mode === 2 || DynamicListCtrl.mode === 3) && dynamicLookupConfig.Entities[DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName]) {
                    if (dynamicLookupConfig.Entities[DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName].LookupConfig) {
                        if (dynamicLookupConfig.Entities[DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName].LookupConfig[DynamicListCtrl.lookupConfigFieldName]) {
                            value1.CSS = {};
                            value1.ConfigData.map(function (value2, key2) {
                                value1.CSS["Is" + value2.PropertyName + "Visible"] = true;
                                value1.CSS["Is" + value2.PropertyName + "Disable"] = false;

                                if (dynamicLookupConfig.Entities[DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName].LookupConfig[DynamicListCtrl.lookupConfigFieldName].CSS) {
                                    var _isEmpty = angular.equals({}, dynamicLookupConfig.Entities[DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName].LookupConfig[DynamicListCtrl.lookupConfigFieldName].CSS);

                                    if (!_isEmpty) {
                                        value1.CSS["Is" + value2.PropertyName + "Visible"] = dynamicLookupConfig.Entities[DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName].LookupConfig[DynamicListCtrl.lookupConfigFieldName].CSS["Is" + value2.PropertyName + "Visible"];
                                        value1.CSS["Is" + value2.PropertyName + "Disable"] = dynamicLookupConfig.Entities[DynamicListCtrl.ePage.Masters.DynamicList.DataEntry.DataEntryName].LookupConfig[DynamicListCtrl.lookupConfigFieldName].CSS["Is" + value2.PropertyName + "Disable"];
                                    }
                                }
                            });
                        }
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
        }

        function ApplyFilter() {
            ToggleFilterPanel();

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
            DynamicControlFilter();
        }
        // endregion

        // ======================Grid======================
        // region
        function InitGrid() {
            DynamicListCtrl.ePage.Masters.DynamicList.Grid = {};
            DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsStandardMenu = false;

            DynamicListCtrl.ePage.Masters.DynamicList.Grid.SelectedGridRow = SelectedGridRow;

            DynamicListCtrl.ePage.Masters.DynamicList.Grid.GridConfig = APP_CONSTANT.DynamicGridConfig[DynamicListCtrl.gridConfigType].GridConfig;
        }

        function SelectedGridRow($item) {
            if ($item.action == 'favorite') {
                SaveFavoriteItem($item.data);
            } else if ($item.action == 'rowSelection') {
                if (DynamicListCtrl.mode == 1) {
                    ConfigureStandardMenu($item);
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
                    "IsModified": true,
                    "IsDeleted": false
                };
            }

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (!item.entity.IsStarred && item.entity.Starred_FK == null) {
                        item.entity.IsStarred = true;
                        item.entity.Starred_FK = response.data.Response[0].PK;
                    } else if (item.entity.IsStarred && item.entity.Starred_FK != null) {
                        item.entity.IsStarred = false;
                        item.entity.Starred_FK = null;
                    }
                }
            });
        }

        function ConfigureStandardMenu($item) {
            DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsStandardMenu = false;
            $timeout(function () {
                var _dataEntryName = $item.data.DataEntryMaster.DataEntryName,
                    _configData = appConfig.Entities.standardMenuConfigList[_dataEntryName];
                var _StandardMenuInput = {
                    [$item.data.entity[_configData.keyObjectNo]]: {
                        ePage: {
                            Entities: {
                                Header: {
                                    Data: $item.data.entity
                                }
                            }
                        }
                    },
                    isNew: false,
                    label: $item.data.entity[_configData.keyObjectNo]
                };

                DynamicListCtrl.ePage.Masters.DynamicList.Grid.StandardMenuInput = angular.copy(_StandardMenuInput);
                DynamicListCtrl.ePage.Masters.DynamicList.Grid.StandardMenuEntityName = angular.copy(_dataEntryName);

                ($item.data.isSelected ? DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsStandardMenu = true : DynamicListCtrl.ePage.Masters.DynamicList.Grid.IsStandardMenu = false);
            });
        }
        // endregion

        // ========================Order========================
        // region
        function InitOrder() {
            DynamicListCtrl.ePage.Masters.DynamicList.Order = {};
            DynamicListCtrl.ePage.Masters.StandardMenuConfigList = appConfig.Entities.standardMenuConfigList[DynamicListCtrl.dataentryName];

            // if (DynamicListCtrl.ePage.Masters.StandardMenuConfigList != undefined && DynamicListCtrl.mode === 1) {
            //     DynamicListCtrl.ePage.Masters.ConfigName = $injector.get(DynamicListCtrl.ePage.Masters.StandardMenuConfigList.configName);
            //     DynamicListCtrl.ePage.Masters.ConfigName.Entities.CopyOrder = CopyOrder;
            //     DynamicListCtrl.ePage.Masters.ConfigName.Entities.CancelOrder = CancelOrder;
            //     DynamicListCtrl.ePage.Masters.ConfigName.Entities.MakeIsActiveOrder = MakeIsActiveOrder;
            //     DynamicListCtrl.ePage.Masters.ConfigName.Entities.SplitOrder = SplitOrder;
            // }
        }

        function CopyOrder(_obj, keyObject, _config) {
            /*var r = confirm("Are You Sure Want To Copy? " + _obj.label);
            if (r == true) {
                apiService.get("eAxisAPI", _config.Entities.Header.API.OrderCopy.Url + _obj[_obj.label].ePage.Entities.Header.Data.PK).then(function (response) {
                    var __obj = {
                        entity: response.data.Response[keyObject],
                        data: response.data.Response
                    };

                    DynamicListCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                });
            }*/
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Order Copy?',
                bodyText: 'Would you like to copy this order? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", _config.Entities.Header.API.OrderCopy.Url + _obj[_obj.label].ePage.Entities.Header.Data.PK).then(function (response) {
                        var __obj = {
                            entity: response.data.Response[keyObject],
                            data: response.data.Response
                        };

                        DynamicListCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                    });
                    // $uibModalInstance.dismiss('close');
                }, function () {
                    console.log("Cancelled");
                });
        }

        function SplitOrder(_obj, keyObject, _config) {
            var tempArray = [];
            if (_obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderLines != undefined) {
                // if (_obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                //     _obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderLines.map(function (val, key) {
                //         if (val.Quantity != val.RecievedQuantity) {
                //             tempArray.push(val);
                //         }
                //     });
                //     if (tempArray.length == 0) {
                //         toastr.warning("Actual and Received Quantity Both are Same...")
                //     } else {
                /*var r = confirm("Would you like to split the Order? " + _obj.label);
                if (r == true) {
                    apiService.get("eAxisAPI", _obj[_obj.label].ePage.Entities.Header.API.SplitOrderByOrderPk.Url + _obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderHeader.PK).then(function (response) {

                        var __obj = {
                            entity: response.data.Response[keyObject],
                            data: response.data.Response
                        };

                        DynamicListCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                    });
                }*/
                // pop-up modal 
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Split Order?',
                    bodyText: 'Would you like to split the Order? ' + _obj.label
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        apiService.get("eAxisAPI", _obj[_obj.label].ePage.Entities.Header.API.SplitOrderByOrderPk.Url + _obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                            var __obj = {
                                entity: response.data.Response[keyObject],
                                data: response.data.Response
                            };
                            DynamicListCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                        });
                        // $uibModalInstance.dismiss('close');

                    }, function () {
                        console.log("Cancelled");
                    });
                //     }
                // } else {
                //     toastr.warning("Empty Order Lines...")
                // }
            } else {
                toastr.warning("Can't Split Here...")
            }
        }

        function CancelOrder(_obj, keyObject, _config) {
            /*var r = confirm("Are You Sure Want To Cancel? " + _obj.label);
            if (r == true) {
                var __input = [{
                    "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                    "Properties": [{
                        "PropertyName": "POH_IsCancelled",
                        "PropertyNewValue": true,
                    }]
                }];
                apiService.post("eAxisAPI", _config.Entities.Header.API.CancelOrder.Url, __input).then(function (response) {
                    if (response.data.Status == 'Success') {
                        toastr.success(_obj.label + " Cancelled Successfully...!");
                        DynamicListCtrl.ePage.Masters.IsStandardMenu = false;
                        appConfig.Entities.refreshGrid();
                    }
                });
            }*/
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Cancel?',
                bodyText: 'Would you like to cancel this order? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    var __input = [{
                        "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                        "Properties": [{
                            "PropertyName": "POH_IsCancelled",
                            "PropertyNewValue": true,
                        }]
                    }];
                    apiService.post("eAxisAPI", _config.Entities.Header.API.CancelOrder.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            toastr.success(_obj.label + " Cancelled Successfully...!");
                            DynamicListCtrl.ePage.Masters.IsStandardMenu = false;
                            appConfig.Entities.refreshGrid();
                        }
                    });
                    // $uibModalInstance.dismiss('close');
                }, function () {
                    console.log("Cancelled");
                });
        }

        function MakeIsActiveOrder(_obj, keyObject, _config) {
            if (_obj[_obj.label].ePage.Entities.Header.Data[keyObject]) {
                var __isValid = _obj[_obj.label].ePage.Entities.Header.Data[keyObject].IsValid;
                var _label = __isValid ? "Inactive" : "Active"
            } else {
                var __isValid = _obj[_obj.label].ePage.Entities.Header.Data.IsValid;
                var _label = __isValid ? "Inactive" : "Active"
            }

            if (__isValid) {
                var _isValid = false;
            } else {
                _isValid = true;
            }
            /*var r = confirm("Are You Sure Want To " + _label + " " + _obj.label);
            if (r == true) {
                var __input = [{
                    "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data[keyObject].PK,
                    "Properties": [{
                        "PropertyName": "POH_IsValid",
                        "PropertyNewValue": _isValid,
                    }]
                }];
                apiService.post("eAxisAPI", _config.Entities.Header.API.CancelOrder.Url, __input).then(function (response) {
                    if (response.data.Status == 'Success') {
                        if (__isValid) {
                            toastr.success(_obj.label + " Inactive Successfully...!");
                        } else {
                            toastr.success(_obj.label + " Active Successfully...!");
                        }
                        DynamicListCtrl.ePage.Masters.IsStandardMenu = false;
                        appConfig.Entities.refreshGrid();
                    }
                });
            }*/
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Active/InActive?',
                bodyText: 'Are You Sure Want To' + " " + _label + "? " + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (_obj[_obj.label].ePage.Entities.Header.Data[keyObject]) {
                        var __input = [{
                            "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data[keyObject].PK,
                            "Properties": [{
                                "PropertyName": "POH_IsValid",
                                "PropertyNewValue": _isValid,
                            }]
                        }];
                    } else {
                        var __input = [{
                            "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                            "Properties": [{
                                "PropertyName": "POH_IsValid",
                                "PropertyNewValue": _isValid,
                            }]
                        }];
                    }

                    apiService.post("eAxisAPI", _config.Entities.Header.API.CancelOrder.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            if (__isValid) {
                                toastr.success(_obj.label + " Inactive Successfully...!");
                            } else {
                                toastr.success(_obj.label + " Active Successfully...!");
                            }
                            DynamicListCtrl.ePage.Masters.IsStandardMenu = false;
                            appConfig.Entities.refreshGrid();
                        }
                    });
                    // $uibModalInstance.dismiss('close');

                }, function () {
                    console.log("Cancelled");
                });
        }
        // endregion

        Init();
    }
})();
