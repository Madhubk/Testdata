(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationVisibility", OrganizationVisibility);

    OrganizationVisibility.$inject = [];

    function OrganizationVisibility() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/visibility/organization-visibility.html",
            controller: "OrganizationVisibilityController",
            controllerAs: "OrganizationVisibilityCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationVisibilityController", OrganizationVisibilityController);

    OrganizationVisibilityController.$inject = ["$rootScope", "authService", "apiService", "helperService", "mdmConfig"];

    function OrganizationVisibilityController($rootScope, authService, apiService, helperService, mdmConfig) {
        var OrganizationVisibilityCtrl = this;

        $rootScope.UpdateVisibilityPage = PrepareTenantDetails;

        function Init() {
            var currentOrganization = OrganizationVisibilityCtrl.currentOrganization[OrganizationVisibilityCtrl.currentOrganization.label].ePage.Entities;

            OrganizationVisibilityCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Visibility",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            try {
                InitUser();
                InitTenant();
            } catch (ex) {
                console.log(ex);
            }
        }

        // =============== Tenant ==================
        function InitTenant() {
            OrganizationVisibilityCtrl.ePage.Masters.Tenant = {};
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant = {};
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal = {};

            OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";

            OrganizationVisibilityCtrl.ePage.Masters.Tenant.Save = SaveTenant;

            PrepareTenantDetails();
        }

        function PrepareTenantDetails() {
            if (OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_FK) {
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_Code.substring(0, 5);
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantName = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_FK;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_Code;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = true;
            } else {
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.Code.substring(0, 5);
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantName = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = false;
            }

            PrepareUserList();
        }

        function SaveTenant() {
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = true;
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Please Wait...";

            var _input = OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal;
            _input.TenantCode = _input.TenantCode.replace(/\s/g, '').substring(0, 5);
            _input.BaseTenantCode = "TBASE";
            _input.IsModified = true;

            apiService.post("authAPI", mdmConfig.Entities.SecTenant.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant = response.data.Response[0];

                        UpdateOrgHeader();
                        AppTenantMapping();
                    }
                } else {
                    toastr.error("Could not create...!");
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
                }
            });
        }

        function AppTenantMapping() {
            var _input = {
                ItemCode: authService.getUserInfo().AppCode,
                Item_FK: authService.getUserInfo().AppPK,
                ItemName: "APP",
                SAP_Code: authService.getUserInfo().AppCode,
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                TNT_FK: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                IsModified: true
            };

            apiService.post("authAPI", mdmConfig.Entities.SecAppSecTenant.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    CopyBaseTenantAccessToTenant();
                } else {
                    toastr.error("Could not Create...!");
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
                }
            });
        }

        function CopyBaseTenantAccessToTenant() {
            var _input = {
                AppCode: authService.getUserInfo().AppCode,
                FromTenant: "TBASE",
                ToTenant: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode
            };

            apiService.post("authAPI", mdmConfig.Entities.SecTenant.API.CopyBaseTenantBehavior.Url, _input).then(function (response) {
                if (response.data.Response) {} else {
                    console.log("Could not Copy Base Tenant Behaviour...!")
                }

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
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
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
            });
        }

        // =============== User ==================
        function InitUser() {
            OrganizationVisibilityCtrl.ePage.Masters.User = {};
            OrganizationVisibilityCtrl.ePage.Masters.User.UserList = [];

            OrganizationVisibilityCtrl.ePage.Masters.User.Save = SaveUser;

            GetRoleList();
        }

        function PrepareUserList() {
            OrganizationVisibilityCtrl.ePage.Masters.User.UserList = angular.copy(OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact);

            OrganizationVisibilityCtrl.ePage.Masters.User.UserList.map(function (value, key) {
                if (value.USER_FK) {
                    value.IsUserViewMode = true;
                } else {
                    value.IsUserViewMode = false;
                    value.UserName = value.Email;
                }

                value.IsSaveBtnClick = false;
            });
        }

        function GetRoleList() {
            OrganizationVisibilityCtrl.ePage.Masters.User.RoleList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": mdmConfig.Entities.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", mdmConfig.Entities.SecRole.API.FindAll.Url, _input).then(function (response) {
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
                    "Password": "Cube@123",
                    "Email": $item.Email,
                    "UserType": "Regular",
                    "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                    "IsModified": true
                };

                apiService.post("authAPI", mdmConfig.Entities.UserExtended.API.Insert.Url, _input).then(function (response) {
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
                "SAP_FK": authService.getUserInfo().AppPK,
                "SAP_Code": authService.getUserInfo().AppCode,
                "TNT_FK": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                "IsModified": true
            };

            apiService.post("authAPI", mdmConfig.Entities.UserRole.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    UpdateOrgContact(user);
                } else {
                    user.IsSaveBtnClick = false;
                    toastr.error("Could not Insert...!");
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
                    PrepareUserList();
                }
                user.IsSaveBtnClick = false;
            });
        }

        Init();
    }
})();
