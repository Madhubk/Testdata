(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationVisibilityController", OrganizationVisibilityController);

    OrganizationVisibilityController.$inject = ["$rootScope", "authService", "apiService", "appConfig", "helperService"];

    function OrganizationVisibilityController($rootScope, authService, apiService, appConfig, helperService) {
        var OrganizationVisibilityCtrl = this;

        $rootScope.GetUserList = GetUserList;

        function Init() {
            var currentOrganization = OrganizationVisibilityCtrl.currentOrganization[OrganizationVisibilityCtrl.currentOrganization.label].ePage.Entities;

            OrganizationVisibilityCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Visibility",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            InitTenant();
            InitUser();
        }

        function InitTenant() {
            OrganizationVisibilityCtrl.ePage.Masters.Tenant = {};
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant = {};
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal = {};

            OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Save";

            OrganizationVisibilityCtrl.ePage.Masters.Tenant.Save = TenantSave;

            if (OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_FK) {
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_Code;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantName = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_FK;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_Code;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = true;
            } else {
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantName = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = false;
            }
        }

        function TenantSave() {
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = true;
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Please Wait...";

            var _input = OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal;
            _input.BaseTenantCode = "TBASE";
            _input.IsModified = true;

            apiService.post("authAPI", appConfig.Entities.SecTenant.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant = response.data.Response[0];

                        UpdateOrgHeader();
                        AppTenantMapping();
                    }
                }

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Save";
            });
        }

        function AppTenantMapping() {
            var _input = {
                ItemCode: authService.getUserInfo().AppCode,
                ItemName: "APP",
                Item_FK: authService.getUserInfo().AppPK,
                MappingCode: "SECAPP_SECTENANT",
                SAP_Code: authService.getUserInfo().AppCode,
                SAP_FK: authService.getUserInfo().AppPK,
                TNT_FK: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                TenantCode: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                TenantName: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantName
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        SetDefaultAccessToTenant();
                    }
                }
            });
        }

        function SetDefaultAccessToTenant() {
            var _input = {
                AppCode: authService.getUserInfo().AppCode,
                FromTenant: "TBASE",
                ToTenant: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode
            };

            apiService.post("authAPI", appConfig.Entities.SecTenant.API.CopyBaseTenantBehavior.Url, _input).then(function (response) {
                if (response.data.Response) {}
            });
        }

        function UpdateOrgHeader() {
            var _input = OrganizationVisibilityCtrl.ePage.Entities.Header.Data;
            _input.OrgHeader.ProxyTenant_FK = OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK;
            _input.OrgHeader.ProxyTenant_Code = OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode;
            _input.OrgHeader.IsModified = true;

            apiService.post("eAxisAPI", OrganizationVisibilityCtrl.ePage.Entities.Header.API.UpdateOrganization.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader = response.data.Response.OrgHeader;

                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = true;
                }

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Save";
            });
        }

        // =============== User ==================
        function InitUser() {
            OrganizationVisibilityCtrl.ePage.Masters.User = {};
            OrganizationVisibilityCtrl.ePage.Masters.User.UserList = [];

            OrganizationVisibilityCtrl.ePage.Masters.User.Save = SaveUser;

            GetUserList();
            GetRoleList();
        }

        function GetUserList() {
            OrganizationVisibilityCtrl.ePage.Masters.User.UserList = angular.copy(OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact);

            OrganizationVisibilityCtrl.ePage.Masters.User.UserList.map(function (value, key) {
                if (value.USER_FK) {
                    value.IsUserViewMode = true;
                } else {
                    value.IsUserViewMode = false;
                    value.UserName = value.Email;
                }

                value.SaveBtnClick = false;
            });
        }

        function GetRoleList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationVisibilityCtrl.ePage.Masters.User.RoleList = response.data.Response;
                } else {
                    OrganizationVisibilityCtrl.ePage.Masters.User.RoleList = [];
                }
            });
        }

        function SaveUser($item) {
            if ($item.UserName) {
                $item.IsSaveBtnClick = true;
                var _input = {
                    "FirstName": $item.ContactName,
                    "DisplayName": $item.ContactName,
                    "UserName": $item.UserName,
                    "Password": "Welcome",
                    "Email": $item.Email,
                    "UserType": "Regular",
                    "IsModified": true,
                    "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode
                };

                apiService.post("authAPI", appConfig.Entities.UserExtended.API.Insert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        $item.USER_FK = response.data.Response.Id;
                        UserRoleMapping($item);
                    } else {
                        $item.IsSaveBtnClick = false;
                    }
                });
            }
        }

        function UserRoleMapping(user) {
            var _input = {
                "AccessCode": user.AccessCode,
                "AccessTo": "ROLE",
                "Access_FK": user.Access_FK,
                "ItemCode": user.UserName,
                "ItemName": "USER",
                "Item_FK": user.USER_FK,
                "MappingCode": "USER_ROLE_APP_TNT",
                "SAP_FK": authService.getUserInfo().AppPK,
                "SAP_Code": authService.getUserInfo().AppCode,
                "TNT_FK": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                "IsModified": true
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    UpdateOrgContact(user);
                } else {
                    user.IsSaveBtnClick = false;
                }
            });
        }

        function UpdateOrgContact(user) {
            user.IsModified = true;
            if (user.PK) {
                var _index = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact.map(function (value, key) {
                    return value.PK;
                }).indexOf(user.PK);

                if (_index !== -1) {
                    OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact[_index] = user;
                }
            } else {
                OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact.push(user);
            }

            var _input = OrganizationVisibilityCtrl.ePage.Entities.Header.Data;

            apiService.post("eAxisAPI", OrganizationVisibilityCtrl.ePage.Entities.Header.API.UpdateOrganization.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GetUserList();
                }
                user.IsSaveBtnClick = true;
            });
        }

        Init();
    }
})();
