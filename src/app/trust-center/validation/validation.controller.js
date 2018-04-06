(function () {
    'use strict'

    angular
        .module("Application")
        .controller("ValidationController", ValidationController);

    ValidationController.$inject = ["authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "$location", "toastr", "confirmation"];

    function ValidationController(authService, apiService, helperService, appConfig, APP_CONSTANT, $location, toastr, confirmation) {
        /* jshint validthis: true */
        var ValidationCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ValidationCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Validation",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ValidationCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                ValidationCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ValidationCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitModule();
                    InitValidation();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ValidationCtrl.ePage.Masters.Breadcrumb = {};
            ValidationCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            ValidationCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Code: "validation",
                Description: "Validation",
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

        // ========================Module Start========================

        function InitModule() {
            ValidationCtrl.ePage.Masters.Module = {};
            ValidationCtrl.ePage.Masters.Module.OnModuleChange = OnModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            ValidationCtrl.ePage.Masters.Module.ListSource = undefined;
            var _filter = {
                TypeCode: "MODULE_MASTER"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + ValidationCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    ValidationCtrl.ePage.Masters.Module.ListSource = response.data.Response;

                    if (ValidationCtrl.ePage.Masters.Module.ListSource.length > 0) {
                        OnModuleChange(ValidationCtrl.ePage.Masters.Module.ListSource[0])
                    } else {
                        OnModuleChange();
                    }
                } else {
                    ValidationCtrl.ePage.Masters.Module.ListSource = [];
                }
            });
        }

        function OnModuleChange($item) {
            ValidationCtrl.ePage.Masters.Module.ActiveModule = angular.copy($item);

            if (ValidationCtrl.ePage.Masters.Module.ActiveModule) {
                GetValidationList();
            }
        }

        // ========================Module End========================

        function InitValidation() {
            ValidationCtrl.ePage.Masters.Validation = {}

            ValidationCtrl.ePage.Masters.Validation.AddNew = AddNew;
            ValidationCtrl.ePage.Masters.Validation.Save = Save;
            ValidationCtrl.ePage.Masters.Validation.Delete = Delete;
            ValidationCtrl.ePage.Masters.Validation.RedirectToAppSetting = RedirectToAppSetting;
        }

        function GetValidationList() {
            ValidationCtrl.ePage.Masters.Validation.ListSource = undefined;
            var _filter = {
                "SAP_FK": ValidationCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
                "ModuleCode": ValidationCtrl.ePage.Masters.Module.ActiveModule.Module
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ValidationCtrl.ePage.Masters.Validation.ListSource = response.data.Response;
                } else {
                    ValidationCtrl.ePage.Masters.Validation.ListSource = [];
                }
            });
        }

        function AddNew() {
            var _obj = {};
            ValidationCtrl.ePage.Masters.Validation.ListSource.push(_obj);
        }

        function Save($item, $index) {
            var _input = angular.copy($item);
            _input.ModuleCode = ValidationCtrl.ePage.Masters.Module.ActiveModule.Module;
            _input.IsModified = true;

            apiService.post("authAPI", appConfig.Entities.Validation.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    ValidationCtrl.ePage.Masters.Validation.ListSource[$index] = response.data.Response[0];
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Failed to Save...!");
                }
            });
        }

        function Delete($item, $index) {
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
                    console.log("Cancelled");
                });
        }

        function RemoveRecord($item, $index) {
            if ($item.PK) {
                $item.IsDeleted = true;
                $item.IsModified = true;
                var _input = [$item];
                apiService.post("authAPI", appConfig.Entities.Validation.API.Upsert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ValidationCtrl.ePage.Masters.Validation.ListSource.splice($index, 1);
                    }
                });
            } else {
                ValidationCtrl.ePage.Masters.Validation.ListSource.splice($index, 1);
            }
        }

        function RedirectToAppSetting() {
            var _queryString = ValidationCtrl.ePage.Masters.QueryString;
            _queryString.EntitySource = "VALIDATION";
            _queryString.ModuleCode = ValidationCtrl.ePage.Masters.Module.ActiveModule.Module;
            _queryString.BreadcrumbTitle = "Validation";
            _queryString.Type = "Type2";

            $location.path("TC/application-settings" + "/" + helperService.encryptData(_queryString));
        }

        Init();
    }
})();
