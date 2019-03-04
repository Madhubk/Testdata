(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCApplicationController", TCApplicationController);

    TCApplicationController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "jsonEditModal", "trustCenterConfig"];

    function TCApplicationController($scope, $location, $uibModal, authService, apiService, helperService, toastr, jsonEditModal, trustCenterConfig) {
        /* jshint validthis: true */
        var TCApplicationCtrl = this;

        function Init() {
            TCApplicationCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Applictions",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                TCApplicationCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
                InitBreadcrumb();
                InitApplication();
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCApplicationCtrl.ePage.Masters.Breadcrumb = {};
            TCApplicationCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCApplicationCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "application",
                Description: "Application",
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

        // ========================Application Start========================

        function InitApplication() {
            TCApplicationCtrl.ePage.Masters.Application = {};
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = {};

            TCApplicationCtrl.ePage.Masters.Application.Cancel = Cancel;
            TCApplicationCtrl.ePage.Masters.Application.Save = Save;
            TCApplicationCtrl.ePage.Masters.Application.Edit = Edit;
            TCApplicationCtrl.ePage.Masters.Application.OnApplicationClick = OnApplicationClick;
            TCApplicationCtrl.ePage.Masters.Application.OpenJsonModal = OpenJsonModal;
            TCApplicationCtrl.ePage.Masters.Application.OnRedirectListClick = OnRedirectListClick;
            TCApplicationCtrl.ePage.Masters.Application.AddNew = AddNew;
            TCApplicationCtrl.ePage.Masters.Application.AddNewExternalUrl = AddNewExternalUrl;
            TCApplicationCtrl.ePage.Masters.Application.RemoveExternalUrl = RemoveExternalUrl;

            TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
            TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;

            $scope.OnLogoChange = OnLogoChange;

            GetRedirectPagetList();
            GetApplicationList();
        }

        function GetApplicationList() {
            TCApplicationCtrl.ePage.Masters.Application.ApplicationList = undefined;

            var _filter = {
                "PageSize": 100,
                "PageNumber": 1,
                "SortColumn": "SAP_AppCode",
                "SortType": "ASC"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecApp.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecApp.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCApplicationCtrl.ePage.Masters.Application.ApplicationList = response.data.Response;

                    if (TCApplicationCtrl.ePage.Masters.Application.ApplicationList.length > 0) {
                        OnApplicationClick(TCApplicationCtrl.ePage.Masters.Application.ApplicationList[0]);
                    } else {
                        OnApplicationClick();
                    }
                } else {
                    TCApplicationCtrl.ePage.Masters.Application.ApplicationList = [];
                }
            });
        }

        function AddNew() {
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = {};
            Edit();
        }

        function OnApplicationClick($item) {
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy = angular.copy($item);

            StringifyOtherConfig();

            if ($item) {
                if (!TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr) {
                    GetLogo();
                }

                GetExtenalUrlList();
            }

            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication) {
                TCApplicationCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SecApp",
                    ObjectId: TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK
                };
                TCApplicationCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function GetExtenalUrlList() {
            TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList = undefined;

            var _filter = {
                "AppCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecAppUrl.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppUrl.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList = response.data.Response;
                } else {
                    TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList = [];
                }
            });
        }

        function EditModalInstance() {
            return TCApplicationCtrl.ePage.Masters.Application.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'applicationEdit'"></div>`
            });
        }

        function Edit() {
            TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
            TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function AddNewExternalUrl() {
            var _obj = {
                "InternalUrl": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.InternalUrl,
                "IsActive": true,
                "IsModified": true,
                "IsDeleted": false,
                "SAP_FK": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "AppName": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppName
            };

            TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList.push(_obj);
        }

        function RemoveExternalUrl($item, $index) {
            $item.IsDeleted = true;
            $item.IsModified = true;
        }

        function Save() {
            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK) {
                UpdateApplication();
            } else {
                InsertApplication();
            }
        }

        function InsertApplication() {
            TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "Please Wait...";
            TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = true;

            var _input = angular.copy(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication);

            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.IsModified) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.SecApp.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(_response);
                        var _index = TCApplicationCtrl.ePage.Masters.Application.ApplicationList.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCApplicationCtrl.ePage.Masters.Application.ApplicationList.push(_response);
                        } else {
                            TCApplicationCtrl.ePage.Masters.Application.ApplicationList[_index] = _response;
                        }
                        StringifyOtherConfig();

                        OnApplicationClick(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication);
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
                    TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;
                    // TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
                });
            }
        }

        function UpdateApplication() {
            TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "Please Wait...";
            TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = true;

            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK) {
                if (TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList.length > 0) {
                    TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList.map(function (value, key) {
                        if (value.IsModified && value.ExternalUrl) {
                            SaveExternalUrl(value);
                        }
                    });
                }
            }

            var _input = angular.copy(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication);

            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.IsModified) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.SecApp.API.Update.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _response = response.data.Response;
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(_response);
                        var _index = TCApplicationCtrl.ePage.Masters.Application.ApplicationList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);
                        if (_index === -1) {
                            TCApplicationCtrl.ePage.Masters.Application.ApplicationList.push(_response);
                        } else {
                            TCApplicationCtrl.ePage.Masters.Application.ApplicationList[_index] = _response;
                        }
                        StringifyOtherConfig();

                        OnApplicationClick(_response);
                    } else {
                        toastr.error("Could not Update...!");
                    }

                    TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
                    TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;
                    // TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
                });
            }
        }

        function SaveExternalUrl($item) {
            if ($item.PK) {
                UpdateExternalUrl($item);
            } else {
                InsertExternalUrl($item);
            }
        }

        function InsertExternalUrl($item) {
            var _input = angular.copy($item);

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppUrl.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {} else {
                    toastr.error("Could not Save...!");
                }

                if (!TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.IsModified) {
                    TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
                    TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;
                    // TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
                }
            });
        }

        function UpdateExternalUrl($item) {
            var _input = angular.copy($item);

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppUrl.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {} else {
                    toastr.error("Could not Update...!");
                }

                if (!TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.IsModified) {
                    TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
                    TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;
                    // TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
                }
            });
        }

        function Cancel() {
            if (!TCApplicationCtrl.ePage.Masters.Application.ActiveApplication) {
                if (TCApplicationCtrl.ePage.Masters.Application.ApplicationList.length > 0) {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(TCApplicationCtrl.ePage.Masters.Application.ApplicationList[0]);
                } else {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = undefined;
                }
            } else if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy) {
                TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy);
            }

            StringifyOtherConfig();
            TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
        }

        function OpenJsonModal() {
            var _attributeJson = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig = result;
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

        function StringifyOtherConfig() {
            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication) {
                if (typeof TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig == "object") {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig = JSON.stringify(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig);
                }
            }
        }

        function GetRedirectPagetList() {
            TCApplicationCtrl.ePage.Masters.Application.RedirectPagetList = [{
                Code: "Parties",
                Description: "Parties",
                Icon: "fa fa-connectdevelop",
                Link: "TC/parties",
                Color: "#36ad97",
            }, {
                Code: "ProvideTrustCenterHomePageAccess",
                Description: "Provide Trust Center Home Page Access",
                Icon: "fa fa fa-sign-in",
                Link: "TC/app-trust-app-tenant",
                Color: "#bd081c",
            }, {
                Code: "TenantAccess",
                Description: "Tenant Access",
                Icon: "fa fa fa-sign-in",
                Link: "TC/sec-app-sec-tenant",
                Color: "#bd081c",
            }];
        }

        function OnRedirectListClick($item) {
            var _queryString = {
                "AppPk": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "AppName": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppName
            };

            _queryString.DisplayName = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppName;
            _queryString.ItemPk = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _queryString.ItemCode = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode;

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        function OnLogoChange(event, input) {
            var maxSize = input.dataset.maxSize / 1024; // in bytes to KB
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = undefined;
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = undefined;

            if (input.files.length > 0) {
                var fileSize = input.files[0].size / 1024;

                if (fileSize > maxSize) {
                    toastr.warning('File size should not be more then ' + maxSize + ' KB');
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.Logo.Logo;
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.Logo.Logo;
                    return false;
                } else {
                    var ext = input.files[0]['name'].substring(input.files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
                    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
                        helperService.getImageBase64Str(input.files[0]).then(function (response) {
                            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = angular.copy(response);
                            TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = angular.copy(response);
                            SaveLogo();
                        }, function (error) {
                            console.log(error);
                        });
                    }
                }
            }
        }

        function GetLogo() {
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = undefined;
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = undefined;
            var _filter = {
                "EntitySource": "SAP_LOGO",
                "EntityRefKey": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "EntityRefCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecLogo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = response.data.Response[0].Logo;
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.Logo = response.data.Response[0];
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = response.data.Response[0].Logo;
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.Logo = response.data.Response[0];
                    }
                }
            });
        }

        function SaveLogo() {
            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.Logo) {
                UpdateLogo();
            } else {
                InsertLogo();
            }
        }

        function InsertLogo() {
            var _input = {
                "EntitySource": "SAP_LOGO",
                "EntityRefKey": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "EntityRefCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "Logo": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr,
                "IsModified": true
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.Insert.Url, [_input]).then(function (response) {
                TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = undefined;
                TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = undefined;
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.Logo = response.data.Response[0];
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = response.data.Response[0].Logo;
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.Logo = response.data.Response[0];
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = response.data.Response[0].Logo;
                    }
                } else {
                    toastr.error("Couldn't Upload Logo...!");
                }
            });
        }

        function UpdateLogo() {
            var _input = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.Logo;
            _input.Logo = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.Update.Url, _input).then(function (response) {
                TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = undefined;
                TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = undefined;
                if (response.data.Response) {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.Logo = response.data.Response;
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = response.data.Response.Logo;
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.Logo = response.data.Response;
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.LogoStr = response.data.Response.Logo;
                } else {
                    toastr.error("Couldn't Upload Logo...!");
                }
            });
        }
        // ========================Application End========================

        Init();
    }
})();
