(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApplicationSettingsController", ApplicationSettingsController);

    ApplicationSettingsController.$inject = ["$scope", "$location", "$timeout", "$uibModal", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation", "jsonEditModal"];

    function ApplicationSettingsController($scope, $location, $timeout, $uibModal, authService, apiService, helperService, appConfig, toastr, confirmation, jsonEditModal) {
        /* jshint validthis: true */
        var AppSettingsCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            AppSettingsCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ApplicationSettings",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            AppSettingsCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            AppSettingsCtrl.ePage.Masters.emptyText = "-";

            try {
                AppSettingsCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (AppSettingsCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitModule();
                    InitAppSettingsModule();
                    InitAppSettingsList();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            AppSettingsCtrl.ePage.Masters.Breadcrumb = {};
            AppSettingsCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (AppSettingsCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + AppSettingsCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            var _listSourceType = {
                Type1: [{
                    Code: "home",
                    Description: "Home",
                    Link: "TC/home",
                    IsRequireQueryString: false,
                    IsActive: false
                }, {
                    Code: "system",
                    Description: "System",
                    Link: "TC/dashboard/" + helperService.encryptData('{"Type":"System", "BreadcrumbTitle": "System"}'),
                    IsRequireQueryString: false,
                    IsActive: false
                }, {
                    Code: "applicationsettings",
                    Description: "Application Settings" + _breadcrumbTitle,
                    Link: "#",
                    IsRequireQueryString: false,
                    IsActive: true
                }],
                Type2: [{
                    Code: "home",
                    Description: "Home",
                    Link: "TC/home",
                    IsRequireQueryString: false,
                    IsActive: false
                }, {
                    Code: "configuration",
                    Description: "Configuration",
                    Link: "TC/dashboard/" + helperService.encryptData('{"Type":"Configuration", "BreadcrumbTitle": "Configuration"}'),
                    IsRequireQueryString: false,
                    IsActive: false
                }, {
                    Code: _breadcrumbTitle.toLowerCase(),
                    Description: _breadcrumbTitle,
                    Link: "TC/" + _breadcrumbTitle.toLowerCase(),
                    IsRequireQueryString: true,
                    QueryStringObj: {
                        "AppPk": AppSettingsCtrl.ePage.Masters.QueryString.AppPk,
                        "AppCode": AppSettingsCtrl.ePage.Masters.QueryString.AppCode,
                        "AppName": AppSettingsCtrl.ePage.Masters.QueryString.AppName
                    },
                    IsActive: false
                }, {
                    Code: "applicationsettings",
                    Description: "Application Settings" + _breadcrumbTitle,
                    Link: "#",
                    IsRequireQueryString: false,
                    IsActive: true
                }]
            };

            AppSettingsCtrl.ePage.Masters.Breadcrumb.ListSource = _listSourceType[AppSettingsCtrl.ePage.Masters.QueryString.Type];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        //=============== Module List Start ============ /

        function InitModule() {
            AppSettingsCtrl.ePage.Masters.Module = {};
            AppSettingsCtrl.ePage.Masters.Module.OnModuleChange = OnModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            var _filter = {
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + AppSettingsCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    AppSettingsCtrl.ePage.Masters.Module.Listsource = response.data.Response;

                    if (AppSettingsCtrl.ePage.Masters.Module.Listsource.length > 0) {
                        OnModuleChange(AppSettingsCtrl.ePage.Masters.Module.Listsource[0]);
                    }
                } else {
                    AppSettingsCtrl.ePage.Masters.Module.Listsource = [];
                }
            });
        }

        function OnModuleChange($item) {
            AppSettingsCtrl.ePage.Masters.Module.ActiveModule = $item;
            AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource = [];

            if ($item) {
                GetAppSettingsModuleList();
            }
        }

        //=============== Module List End ============ // 

        // ============== Settings List Type =========== //

        function InitAppSettingsModule() {
            AppSettingsCtrl.ePage.Masters.AppSettingsModule = {};
            AppSettingsCtrl.ePage.Masters.AppSettingsModule.OnAppSettingsModuleListClick = OnAppSettingsModuleListClick;
        }

        function GetAppSettingsModuleList() {
            AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource = undefined;
            var _filter = {
                "PropertyName": 'SVS_SourceEntityRefKey',
                "SAP_FK": AppSettingsCtrl.ePage.Masters.QueryString.AppPk,
                "EntitySource": AppSettingsCtrl.ePage.Masters.QueryString.EntitySource,
                "TenantCode": authService.getUserInfo().TenantCode,
                "ModuleCode": AppSettingsCtrl.ePage.Masters.Module.ActiveModule.Key
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.GetColumnValuesWithFilters.Url + AppSettingsCtrl.ePage.Masters.QueryString.AppPk, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource = response.data.Response;
                    if (AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource.length > 0) {
                        OnAppSettingsModuleListClick(AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource[0]);
                    } else {
                        OnAppSettingsModuleListClick();
                    }
                } else {
                    AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource = [];
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource = [];
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = undefined;
                }
            });
        }

        function OnAppSettingsModuleListClick($item) {
            AppSettingsCtrl.ePage.Masters.AppSettingsModule.ActiveAppSettingsModule = $item;

            if ($item) {
                GetAppSettingsList();
            } else {
                AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = {};
                AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.EntitySource = AppSettingsCtrl.ePage.Masters.QueryString.EntitySource;
                AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource = [];
            }
        }

        // ========================Settings List Type End========================

        // ========================Settings List Type List Start========================
        function InitAppSettingsList() {
            AppSettingsCtrl.ePage.Masters.AppSettingsList = {};

            AppSettingsCtrl.ePage.Masters.AppSettingsList.OnAppSettingsListClick = OnAppSettingsListClick;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.Cancel = Cancel;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.Save = Save;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.Edit = Edit;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.DeleteConfirmation = DeleteConfirmation;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.Delete = Delete;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.OpenJsonModal = OpenJsonModal;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.OnRedirectListClick = OnRedirectListClick;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.OnConsolidateClick = OnConsolidateClick;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.AddNew = AddNew;

            AppSettingsCtrl.ePage.Masters.AppSettingsList.SaveBtnText = "OK";
            AppSettingsCtrl.ePage.Masters.AppSettingsList.IsDisableSaveBtn = false;

            AppSettingsCtrl.ePage.Masters.AppSettingsList.DeleteBtnText = "Delete";
            AppSettingsCtrl.ePage.Masters.AppSettingsList.IsDisableDeleteBtn = false;

            if (AppSettingsCtrl.ePage.Masters.QueryString.EntitySource == "ENTITYRESULT") {
                GetRedirectLinkList();
            }
        }

        function GetAppSettingsList() {
            AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource = undefined;
            AppSettingsCtrl.ePage.Masters.AppSettingsModule.DynamicListSource = {};

            var _filter = {
                "SourceEntityRefKey": AppSettingsCtrl.ePage.Masters.AppSettingsModule.ActiveAppSettingsModule,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": AppSettingsCtrl.ePage.Masters.QueryString.AppPk,
                "EntitySource": AppSettingsCtrl.ePage.Masters.QueryString.EntitySource,
                "ModuleCode": AppSettingsCtrl.ePage.Masters.Module.ActiveModule.Key,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + AppSettingsCtrl.ePage.Masters.QueryString.AppPk, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource = response.data.Response;
                    if (AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.length > 0) {
                        OnAppSettingsListClick(AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource[0]);
                    } else {
                        OnAppSettingsListClick();
                    }
                } else {
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource = [];
                }
            });
        }

        function AddNew() {
            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = {};
            Edit();
        }

        function OnAppSettingsListClick($item) {
            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = angular.copy($item);
            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsListCopy = angular.copy($item);
        }

        function OnConsolidateClick($item) {
            var _filterId, _apiUrl;

            var _filter = {
                "AppPk": $item.SAP_FK,
                "AppCode": $item.AppCode,
                "EntitySource": $item.EntitySource,
                "ModuleCode": $item.Key
            };

            if ($item.EntitySource === "LANGUAGE") {
                _filterId = appConfig.Entities.Multilingual.API.DynamicFindAll.FilterID;
                _apiUrl = appConfig.Entities.Multilingual.API.DynamicFindAll.Url;
            } else
            if ($item.EntitySource === "VALIDATION") {
                _filterId = appConfig.Entities.Validation.API.DynamicFindAll.FilterID;
                _apiUrl = appConfig.Entities.Validation.API.DynamicFindAll.Url;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": _filterId
            };

            apiService.post("authAPI", _apiUrl, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    AppSettingsCtrl.ePage.Masters.AppSettingsModule.DynamicListSource = response.data.Response;
                    $item.Value = JSON.stringify(AppSettingsCtrl.ePage.Masters.AppSettingsModule.DynamicListSource);
                }
            });
        }

        function EditModalInstance() {
            return AppSettingsCtrl.ePage.Masters.AppSettingsList.EditModal = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'applicationSettingEdit'"></div>`
            });
        }

        function Edit() {
            AppSettingsCtrl.ePage.Masters.AppSettingsList.SaveBtnText = "OK";
            AppSettingsCtrl.ePage.Masters.AppSettingsList.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (!AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList) {
                AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = angular.copy(AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource[0]);
            } else {
                AppSettingsCtrl.ePage.Masters.AppSettingsList.SaveBtnText = "Please Wait...";
                AppSettingsCtrl.ePage.Masters.AppSettingsList.IsDisableSaveBtn = true;

                var _input = angular.copy(AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList);

                _input.TenantCode = authService.getUserInfo().TenantCode;
                _input.SAP_FK = AppSettingsCtrl.ePage.Masters.QueryString.AppPk;
                _input.EntitySource = AppSettingsCtrl.ePage.Masters.QueryString.EntitySource;
                _input.IsModified = true;
                _input.IsDeleted = false;
                _input.ModuleCode = AppSettingsCtrl.ePage.Masters.Module.ActiveModule.Key;
                _input.AppCode = AppSettingsCtrl.ePage.Masters.QueryString.AppCode;

                apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.Upsert.Url + AppSettingsCtrl.ePage.Masters.QueryString.AppPk, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
                        var _indexTypeCode = AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource.map(function (e) {
                            return e;
                        }).indexOf(_response.SourceEntityRefKey);

                        if (_indexTypeCode !== -1) {
                            AppSettingsCtrl.ePage.Masters.AppSettingsModule.ActiveAppSettingsModule = _response.SourceEntityRefKey;

                            OnAppSettingsModuleListClick(_response.SourceEntityRefKey);

                            $timeout(function () {
                                AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = angular.copy(_response);

                                var _index = AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.map(function (e) {
                                    return e.PK;
                                }).indexOf(_response.PK);

                                if (_index === -1) {
                                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.push(_response);
                                } else {
                                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource[_index] = _response;
                                }

                                AppSettingsCtrl.ePage.Masters.AppSettingsList.EditModal.dismiss('cancel');
                            }, 1000);
                        } else {
                            AppSettingsCtrl.ePage.Masters.AppSettingsModule.ActiveAppSettingsModule = _response.SourceEntityRefKey;
                            AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource.push(_response.SourceEntityRefKey);

                            AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource = [];
                            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = angular.copy(_response);
                            AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.push(_response);

                            AppSettingsCtrl.ePage.Masters.AppSettingsList.EditModal.dismiss('cancel');
                        }
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    AppSettingsCtrl.ePage.Masters.AppSettingsList.SaveBtnText = "OK";
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.IsDisableSaveBtn = false;
                });
            }
        }

        function Cancel() {
            if (!AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList) {
                if (AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.length > 0) {
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = angular.copy(AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource[0]);
                } else {
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = undefined;
                }
            } else if (AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsListCopy) {
                var _index = AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsListCopy.PK);

                if (_index !== -1) {
                    AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = angular.copy(AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource[_index]);
                }
            }
            AppSettingsCtrl.ePage.Masters.AppSettingsList.EditModal.dismiss('cancel');
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete() {
            AppSettingsCtrl.ePage.Masters.AppSettingsList.DeleteBtnText = "Please Wait...";
            AppSettingsCtrl.ePage.Masters.AppSettingsList.IsDisableDeleteBtn = true;

            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.IsModified = true;
            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.IsDeleted = true;

            var _input = [AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList];

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.Upsert.Url + AppSettingsCtrl.ePage.Masters.QueryString.AppPk, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.map(function (e) {
                        return e.PK
                    }).indexOf(AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.PK);

                    if (_index !== -1) {
                        AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.splice(_index, 1);

                        if (AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource.length > 0) {
                            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = angular.copy(AppSettingsCtrl.ePage.Masters.AppSettingsList.ListSource[0]);
                        } else {
                            AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList = undefined;

                            var _typeIndex = AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource.indexOf(AppSettingsCtrl.ePage.Masters.AppSettingsModule.ActiveAppSettingsModule);
                            if (_typeIndex !== -1) {
                                AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource.splice(_typeIndex, 1);
                                AppSettingsCtrl.ePage.Masters.AppSettingsModule.ActiveAppSettingsModule = AppSettingsCtrl.ePage.Masters.AppSettingsModule.ListSource[0];

                                OnAppSettingsModuleListClick(AppSettingsCtrl.ePage.Masters.AppSettingsModule.ActiveAppSettingsModule);
                            }
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                AppSettingsCtrl.ePage.Masters.AppSettingsList.DeleteBtnText = "Delete";
                AppSettingsCtrl.ePage.Masters.AppSettingsList.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal() {
            var _valueJson = AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.Value;
            if (_valueJson !== undefined && _valueJson !== null && _valueJson !== '' && _valueJson !== ' ') {
                try {
                    if (typeof JSON.parse(_valueJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.Value
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.Value = result;
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

        function GetRedirectLinkList() {
            AppSettingsCtrl.ePage.Masters.AppSettingsList.RedirectPagetList = [{
                Code: "RoleAccess",
                Description: "Role Access",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "FITR_ROLE_APP_TNT",
                BreadcrumbTitle: "Filter Role - FITR_ROLE_APP_TNT",
                Type: 1
            }];
        }

        function OnRedirectListClick($item) {
            var _queryString = {
                "AppPk": AppSettingsCtrl.ePage.Masters.QueryString.AppPk,
                "AppCode": AppSettingsCtrl.ePage.Masters.QueryString.AppCode,
                "AppName": AppSettingsCtrl.ePage.Masters.QueryString.AppName
            };

            if ($item.Type === 1) {
                _queryString.DisplayName = AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.Value;
                _queryString.ItemPk = AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.PK;
                _queryString.ItemCode = AppSettingsCtrl.ePage.Masters.AppSettingsList.ActiveAppSettingsList.Key;
                _queryString.ItemName = "FLTR";
                _queryString.MappingCode = $item.AdditionalData;
                _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        Init();
    }
})();
