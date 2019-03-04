(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCTenantController", TCTenantController);

    TCTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "trustCenterConfig"];

    function TCTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, trustCenterConfig) {
        /* jshint validthis: true */
        var TCTenantCtrl = this;

        function Init() {
            TCTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Tenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            InitBreadcrumb();
            InitTenant();
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "tenant",
                Description: "Tenant",
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

        // ========================Tenant Start========================

        function InitTenant() {
            TCTenantCtrl.ePage.Masters.Tenant = {};
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = {};

            TCTenantCtrl.ePage.Masters.Tenant.Cancel = Cancel;
            TCTenantCtrl.ePage.Masters.Tenant.Save = Save;
            TCTenantCtrl.ePage.Masters.Tenant.Edit = Edit;
            TCTenantCtrl.ePage.Masters.Tenant.OnTenantClick = OnTenantClick;
            TCTenantCtrl.ePage.Masters.Tenant.AddNew = AddNew;

            TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "OK";
            TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;

            $scope.OnLogoChange = OnLogoChange;

            GetTenantList();
        }

        function GetTenantList() {
            var _filter = {
                "pageSize": 100,
                "currentPage": 1,
                "SortColumn": "TenantCode",
                "SortType": "desc"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecTenant.API.MasterFindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecTenant.API.MasterFindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCTenantCtrl.ePage.Masters.Tenant.TenantList = response.data.Response;

                    if (TCTenantCtrl.ePage.Masters.Tenant.TenantList.length > 0) {
                        OnTenantClick(TCTenantCtrl.ePage.Masters.Tenant.TenantList[0]);
                    } else {
                        OnTenantClick();
                    }
                } else {
                    TCTenantCtrl.ePage.Masters.Tenant.TenantList = [];
                }
            });
        }

        function AddNew() {
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = {};
            Edit();
        }

        function OnTenantClick($item) {
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy($item);
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy = angular.copy($item);

            if ($item) {
                if (!TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr) {
                    GetLogo();
                }
            }
            if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant) {
                TCTenantCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SecTenant",
                    ObjectId: TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.PK
                };
                TCTenantCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function EditModalInstance() {
            return TCTenantCtrl.ePage.Masters.Tenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'tenantEdit'"></div>`
            });
        }

        function Edit() {
            TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "OK";
            TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.PK) {
                UpdateTenant();
            } else {
                InsertTenant();
            }
        }

        function InsertTenant() {
            TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "Please Wait...";
            TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = true;

            var _input = TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant;
            _input.IsModified = true;
            _input.BaseTenantCode = "TBASE";

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecTenant.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy(_response);
                    var _index = TCTenantCtrl.ePage.Masters.Tenant.TenantList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCTenantCtrl.ePage.Masters.Tenant.TenantList.push(_response);
                    } else {
                        TCTenantCtrl.ePage.Masters.Tenant.TenantList[_index] = _response;
                    }

                    OnTenantClick(TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "OK";
                TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                TCTenantCtrl.ePage.Masters.Tenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateTenant() {
            TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "Please Wait...";
            TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = true;

            var _input = TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant;
            _input.IsModified = true;
            _input.BaseTenantCode = "TBASE";

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecTenant.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy(_response);
                    var _index = TCTenantCtrl.ePage.Masters.Tenant.TenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCTenantCtrl.ePage.Masters.Tenant.TenantList.push(_response);
                    } else {
                        TCTenantCtrl.ePage.Masters.Tenant.TenantList[_index] = _response;
                    }

                    OnTenantClick(_response);
                } else {
                    toastr.error("Could not Update...!");
                }

                TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "OK";
                TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                TCTenantCtrl.ePage.Masters.Tenant.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant) {
                if (TCTenantCtrl.ePage.Masters.Tenant.TenantList.length > 0) {
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy(TCTenantCtrl.ePage.Masters.Tenant.TenantList[0]);
                } else {
                    TCTenantCtrl.ePage.Masters.Tenant.TenantList = undefined;
                }
            } else if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy) {
                TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy(TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy);
            }

            TCTenantCtrl.ePage.Masters.Tenant.EditModal.dismiss('cancel');
        }

        function OnLogoChange(event, input) {
            var maxSize = input.dataset.maxSize / 1024; // in bytes to KB
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = undefined;
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = undefined;

            if (input.files.length > 0) {
                var fileSize = input.files[0].size / 1024;

                if (fileSize > maxSize) {
                    toastr.warning('File size should not be more then ' + maxSize + ' KB');
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.Logo.Logo;
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.Logo.Logo;
                    return false;
                } else {
                    var ext = input.files[0]['name'].substring(input.files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
                    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
                        helperService.getImageBase64Str(input.files[0]).then(function (response) {
                            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = angular.copy(response);
                            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = angular.copy(response);
                            SaveLogo();
                        }, function (error) {
                            console.log(error);
                        });
                    }
                }
            }
        }

        function GetLogo() {
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = undefined;
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = undefined;
            var _filter = {
                "EntitySource": "TNT_LOGO",
                "EntityRefKey": TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                "EntityRefCode": TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecLogo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = response.data.Response[0].Logo;
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.Logo = response.data.Response[0];
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = response.data.Response[0].Logo;
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.Logo = response.data.Response[0];
                    }
                }
            });
        }

        function SaveLogo() {
            if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.Logo) {
                UpdateLogo();
            } else {
                InsertLogo();
            }
        }

        function InsertLogo() {
            var _input = {
                "EntitySource": "TNT_LOGO",
                "EntityRefKey": TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                "EntityRefCode": TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                "Logo": TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr,
                "IsModified": true
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.Insert.Url, [_input]).then(function (response) {
                TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = undefined;
                TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = undefined;
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.Logo = response.data.Response[0];
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = response.data.Response[0].Logo;
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.Logo = response.data.Response[0];
                        TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = response.data.Response[0].Logo;
                    }
                } else {
                    toastr.error("Couldn't Upload Logo...!");
                }
            });
        }

        function UpdateLogo() {
            var _input = TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.Logo;
            _input.Logo = TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.Update.Url, _input).then(function (response) {
                TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = undefined;
                TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = undefined;
                if (response.data.Response) {
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.Logo = response.data.Response;
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = response.data.Response.Logo;
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.Logo = response.data.Response;
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.LogoStr = response.data.Response.Logo;
                } else {
                    toastr.error("Couldn't Upload Logo...!");
                }
            });
        }

        // ========================Tenant End========================

        Init();
    }
})();