(function () {
    'use strict'

    angular
        .module("Application")
        .controller("LanguageController", LanguageController);

    LanguageController.$inject = ["authService", "apiService", "helperService", "$location", "confirmation", "toastr", "trustCenterConfig"];

    function LanguageController(authService, apiService, helperService, $location, confirmation, toastr, trustCenterConfig) {
        /* jshint validthis: true */
        var LanguageCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            LanguageCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Language",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            LanguageCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                LanguageCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (LanguageCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitModule();
                    InitLanguage();
                    InitLanguageCode();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            LanguageCtrl.ePage.Masters.Breadcrumb = {};
            LanguageCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            LanguageCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": LanguageCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": LanguageCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": LanguageCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "language",
                Description: "Language",
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        //=========================Application Start=====================
        function InitApplication() {
            LanguageCtrl.ePage.Masters.Application = {};
            LanguageCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            LanguageCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!LanguageCtrl.ePage.Masters.Application.ActiveApplication) {
                LanguageCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": LanguageCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": LanguageCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": LanguageCtrl.ePage.Masters.QueryString.AppName
                };
            }

            if (LanguageCtrl.ePage.Masters.Module.ActiveModule) {
             
                GetLanguageList();
            } 
        }
        // ========================Module Start========================

        function InitModule() {
            LanguageCtrl.ePage.Masters.Module = {};
            LanguageCtrl.ePage.Masters.Module.OnModuleChange = OnModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            LanguageCtrl.ePage.Masters.Module.ListSource = undefined;
            var _filter = {
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    LanguageCtrl.ePage.Masters.Module.ListSource = response.data.Response;

                    // if (LanguageCtrl.ePage.Masters.Module.ListSource.length > 0) {
                    //     OnModuleChange(LanguageCtrl.ePage.Masters.Module.ListSource[0])
                    // } else {
                    //     OnModuleChange();
                    // }
                    LanguageCtrl.ePage.Masters.Language.ListSource = [];
                } else {
                    LanguageCtrl.ePage.Masters.Module.ListSource = [];
                    LanguageCtrl.ePage.Masters.Language.ListSource = [];
                }
            });
        }

        function OnModuleChange($item) {
            LanguageCtrl.ePage.Masters.Module.ActiveModule = angular.copy($item);

            if (LanguageCtrl.ePage.Masters.Module.ActiveModule) {
                GetLanguageList();
                LanguageCtrl.ePage.Masters.LanguageCode.IsLanguageCodeChanged = true;
            }


        }

        // ========================Module End========================

        // ========================Language Code Start========================

        function InitLanguageCode() {
            LanguageCtrl.ePage.Masters.LanguageCode = {};
            LanguageCtrl.ePage.Masters.LanguageCode.OnLanguageCodeChange = OnLanguageCodeChange;
            LanguageCtrl.ePage.Masters.LanguageCode.IsLanguageCodeChanged = false;

            GetLanguageCodeList();
        }

        function GetLanguageCodeList() {
            var _filter = {
                "TypeCode": "LANGUAGE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    LanguageCtrl.ePage.Masters.LanguageCode.ListSource = response.data.Response;

                    if (LanguageCtrl.ePage.Masters.LanguageCode.ListSource.length > 0) {
                        OnLanguageCodeChange(LanguageCtrl.ePage.Masters.LanguageCode.ListSource[0])
                    } else {
                        OnLanguageCodeChange();
                    }
                } else {
                    LanguageCtrl.ePage.Masters.LanguageCode.ListSource = [];
                }
            });
        }

        function OnLanguageCodeChange($item) {
            LanguageCtrl.ePage.Masters.LanguageCode.ActiveLanguageCode = angular.copy($item);
            if (LanguageCtrl.ePage.Masters.LanguageCode.ActiveLanguageCode) {
                var _key = angular.copy(LanguageCtrl.ePage.Masters.LanguageCode.ActiveLanguageCode.Key);
                var _keyCopy = _key;
                if (_key.indexOf("-") !== -1) {
                    _keyCopy = _key.split("-").join("_");
                }

                LanguageCtrl.ePage.Masters.LanguageCode.ActiveLanguageCode.LanguageCodeCopy = _keyCopy;
            }
        }

        // ========================Language Code End========================

        function InitLanguage() {
            LanguageCtrl.ePage.Masters.Language = {};

            LanguageCtrl.ePage.Masters.Language.AddNew = AddNew;
            LanguageCtrl.ePage.Masters.Language.Save = Save;
            LanguageCtrl.ePage.Masters.Language.Delete = Delete;
            LanguageCtrl.ePage.Masters.Language.OnModuleChange = OnModuleChange;
            LanguageCtrl.ePage.Masters.Language.RedirectToAppSetting = RedirectToAppSetting;
        }

        function GetLanguageList() {
            LanguageCtrl.ePage.Masters.Language.ListSource = undefined;
            var _filter = {
                "SAP_FK": LanguageCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "ModuleCode": LanguageCtrl.ePage.Masters.Module.ActiveModule.Key
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.Multilingual.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.Multilingual.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    LanguageCtrl.ePage.Masters.Language.ListSource = response.data.Response;
                } else {
                    LanguageCtrl.ePage.Masters.Language.ListSource = [];
                }
            });
        }

        function AddNew() {
            if (LanguageCtrl.ePage.Masters.LanguageCode.ActiveLanguageCode.Key) {
                var _obj = {
                    LanguageCode: LanguageCtrl.ePage.Masters.LanguageCode.ActiveLanguageCode.Key
                };

                LanguageCtrl.ePage.Masters.Language.ListSource.push(_obj);
            }
        }

        function Save($item, $index) {
            $item.IsDisableSave = true;
            var _input = angular.copy($item);
            _input.ModuleCode = LanguageCtrl.ePage.Masters.Module.ActiveModule.Module;
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.Multilingual.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    LanguageCtrl.ePage.Masters.Language.ListSource[$index] = response.data.Response[0];
                    $item.IsDisableSave = false;
                    toastr.success("Saved Successfully...!");
                } else {
                    $item.IsDisableSave = false;
                    toastr.error("Failed to Save...!");
                }
            });
        }

        function Delete($item, $index) {
            $item.IsDisableDelete = true;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    RemoveRecord($item, $index);
                }, function () {
                    $item.IsDisableDelete = false;
                });
        }

        function RemoveRecord($item, $index) {
            if ($item.PK) {
                var _input = angular.copy($item);
                _input.IsDeleted = true;

                apiService.post("authAPI", trustCenterConfig.Entities.API.Multilingual.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        LanguageCtrl.ePage.Masters.Language.ListSource.splice($index, 1);
                        $item.IsDisableDelete = false;
                    }
                });
            } else {
                LanguageCtrl.ePage.Masters.Language.ListSource.splice($index, 1);
                $item.IsDisableDelete = false;
            }
        }

        function RedirectToAppSetting() {
            if (LanguageCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": LanguageCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": LanguageCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": LanguageCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = LanguageCtrl.ePage.Masters.QueryString;
            }

            _queryString.EntitySource = "LANGUAGE";
            _queryString.ModuleCode = LanguageCtrl.ePage.Masters.Module.ActiveModule.Module;
            _queryString.BreadcrumbTitle = "Language";
            _queryString.Type = "Type2";

            $location.path("TC/application-settings" + "/" + helperService.encryptData(_queryString));
        }

        Init();
    }
})();