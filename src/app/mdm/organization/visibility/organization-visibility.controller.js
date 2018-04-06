(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationVisibilityController", OrganizationVisibilityController);

    OrganizationVisibilityController.$inject = ["$rootScope", "authService", "apiService", "appConfig", "organizationConfig", "helperService", "toastr"];

    function OrganizationVisibilityController($rootScope, authService, apiService, appConfig, organizationConfig, helperService, toastr) {
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
            _input.IsModified = true;
            _input.IsDeleted = false;

            apiService.post("authAPI", appConfig.Entities.SecTenant.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant = response.data.Response[0];

                    UpdateOrgHeader();
                }

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Save";
            });
        }

        function UpdateOrgHeader() {
            var _input = OrganizationVisibilityCtrl.ePage.Entities.Header.Data;
            _input.OrgHeader.ProxyTenant_FK = OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK;
            _input.OrgHeader.ProxyTenant_Code = OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode;
            _input.OrgHeader.IsModified = true;

            apiService.post("eAxisAPI", OrganizationVisibilityCtrl.ePage.Entities.Header.API.UpdateOrganization.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader = response.data.Response.Response.OrgHeader;

                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = true;
                }

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Save";
            });
        }

        function InitUser() {
            OrganizationVisibilityCtrl.ePage.Masters.User = {};
            OrganizationVisibilityCtrl.ePage.Masters.User.UserList = [];

            OrganizationVisibilityCtrl.ePage.Masters.User.Save = SaveUser;

            GetUserList();
            GetUserRole();
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

        function GetUserRole() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode
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
                    "Password": "Welcome",
                    "UserName": $item.UserName,
                    "Email": $item.Email,
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

            // OrganizationVisibilityCtrl.ePage.Masters.User.IsDisableSaveBtn = true;
            // OrganizationVisibilityCtrl.ePage.Masters.User.SaveBtnText = "Please Wait...";

            // OrganizationVisibilityCtrl.ePage.Masters.User.UserList.map(function (value, key) {
            //     if (value.UserName) {
            //         var _input = {
            //             "FirstName": value.ContactName,
            //             "DisplayName": value.ContactName,
            //             "Password": "Welcome",
            //             "UserName": value.UserName,
            //             "Email": value.Email,
            //             "IsModified": true,
            //             "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode
            //         }

            //         apiService.post("authAPI", appConfig.Entities.UserExtended.API.Insert.Url, _input).then(function (response) {
            //             if (response.data.Response) {
            //                 value.USER_FK = response.data.Response.Id;
            //                 UserRoleMapping(value);
            //             } else {
            //                 OrganizationVisibilityCtrl.ePage.Masters.User.IsDisableSaveBtn = false;
            //                 OrganizationVisibilityCtrl.ePage.Masters.User.SaveBtnText = "Save";
            //             }
            //         });
            //     }
            // });
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
                    console.log(response);

                    GetUserList();
                }
                user.IsSaveBtnClick = true;
            });
        }

        Init();
    }
})();
