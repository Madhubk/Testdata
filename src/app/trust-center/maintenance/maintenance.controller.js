(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCMaintenanceController", TCMaintenanceController);

    TCMaintenanceController.$inject = ["$location", "authService", "apiService", "helperService", "trustCenterConfig", "toastr"];

    function TCMaintenanceController($location, authService, apiService, helperService, trustCenterConfig, toastr) {
        /* jshint validthis: true */
        var TCMaintenanceCtrl = this;

        function Init() {
            TCMaintenanceCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Maintenance",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCMaintenanceCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                InitBreadcrumb();
                InitMaintenance();
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCMaintenanceCtrl.ePage.Masters.Breadcrumb = {};
            TCMaintenanceCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCMaintenanceCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "maintenance",
                Description: "Maintenance",
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

        function InitMaintenance() {
            TCMaintenanceCtrl.ePage.Masters.Maintenance = {};

            TCMaintenanceCtrl.ePage.Masters.GenerateScriptInput = {
                ObjectName: "",
                ObjectId: ""
            };
            TCMaintenanceCtrl.ePage.Masters.GenerateScriptConfig = {
                IsEnableTable: true,
                IsEnablePK: true,
                IsEnableTenant: true
            };

            InitPublish();
        }

        function InitPublish() {
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish = {};

            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.GetUserList = GetUserList;
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.GetRoleList = GetRoleList;

            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt = {};
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.Model = {};
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.Publish = PublishUserAppTnt;
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.PublishBtnTxt = "Publish";
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.IsDisablePublishBtn = false;

            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt = {};
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.Model = {};
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.Publish = PublishRoleAppTnt;
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.PublishBtnTxt = "Publish";
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.IsDisablePublishBtn = false;

            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User = {};
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.Model = {};
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.Publish = PublishUser;
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.PublishBtnTxt = "Publish";
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.IsDisablePublishBtn = false;

            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers = {};
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers.Publish = PublishAllUsers;
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers.PublishBtnTxt = "Publish";
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers.IsDisablePublishBtn = false;

            GetApplicationList();
            GetTenantList();
        }

        function GetApplicationList() {
            TCMaintenanceCtrl.ePage.Masters.Maintenance.ApplicationList = undefined;

            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecApp.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecApp.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.ApplicationList = response.data.Response;
                } else {
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.ApplicationList = [];
                }
            });
        }

        function GetTenantList() {
            TCMaintenanceCtrl.ePage.Masters.Maintenance.TenantList = undefined;

            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecTenant.API.MasterFindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecTenant.API.MasterFindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.TenantList = response.data.Response;
                } else {
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.TenantList = [];
                }
            });
        }

        function GetUserList($viewValue) {
            var _filter = {}
            if ($viewValue != "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserExtended.API.FindAll.FilterID
            };

            return apiService.post("authAPI", trustCenterConfig.Entities.API.UserExtended.API.FindAll.Url, _input).then(function (response) {
                return response.data.Response;
            });
        }

        function GetRoleList($viewValue) {
            var _filter = {}
            if ($viewValue != "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecRole.API.FindAll.FilterID
            };

            return apiService.post("authAPI", trustCenterConfig.Entities.API.SecRole.API.FindAll.Url, _input).then(function (response) {
                return response.data.Response;
            });
        }

        function PublishUserAppTnt() {
            var _input = angular.copy(TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.Model);

            if (_input.userName && _input.AppCode && _input.TNTCode) {
                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.PublishBtnTxt = "Please Wait...";
                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.IsDisablePublishBtn = true;

                apiService.post("authAPI", trustCenterConfig.Entities.API.UserPrivileges.API.PublishPrivilegesByUser.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _response = response.data.Response;

                        if (_response.Images) {
                            _response.Images = JSON.parse(_response.Images);
                        }
                        if (_response.Value1) {
                            _response.Value1 = JSON.parse(_response.Value1);
                        }
                        if (_response.Value2) {
                            _response.Value2 = JSON.parse(_response.Value2);
                        }
                        if (_response.Value3) {
                            _response.Value3 = JSON.parse(_response.Value3);
                        }

                        _response = JSON.stringify(_response, undefined, 2);

                        TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.PublishedResponse = _response;
                    } else {
                        toastr.error("Failed to Publish...!");
                    }

                    TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.PublishBtnTxt = "Publish";
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.UserAppTnt.IsDisablePublishBtn = false;
                });
            }
        }

        function PublishRoleAppTnt() {
            var _input = angular.copy(TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.Model);

            if (_input.Role_Code && _input.AppCode && _input.TNTCode) {
                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.PublishBtnTxt = "Please Wait...";
                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.IsDisablePublishBtn = true;

                apiService.post("authAPI", trustCenterConfig.Entities.API.UserPrivileges.API.AppTenantRolePublish.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _response = response.data.Response;
                        TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.PublishedResponse = _response;
                    } else {
                        toastr.error("Failed to Publish...!");
                    }

                    TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.PublishBtnTxt = "Publish";
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.RoleAppTnt.IsDisablePublishBtn = false;
                });
            }
        }

        function PublishUser() {
            var _filter = angular.copy(TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.Model);
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserPrivileges.API.PublishAllUsers.FilterID
            };

            if (_filter.UserName) {
                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.PublishBtnTxt = "Please Wait...";
                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.IsDisablePublishBtn = true;

                apiService.post("authAPI", trustCenterConfig.Entities.API.UserPrivileges.API.PublishAllUsers.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _response = response.data.Response;
                        TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.PublishedResponse = _response;
                    } else {
                        toastr.error("Failed to Publish...!");
                    }

                    TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.PublishBtnTxt = "Publish";
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.User.IsDisablePublishBtn = false;
                });
            }
        }

        function PublishAllUsers() {
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers.PublishBtnTxt = "Please Wait...";
            TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers.IsDisablePublishBtn = true;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserPrivileges.API.PublishAllUsers.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserPrivileges.API.PublishAllUsers.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.PublishedResponse = _response;
                } else {
                    toastr.error("Failed to Publish...!");
                }

                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers.PublishBtnTxt = "Publish";
                TCMaintenanceCtrl.ePage.Masters.Maintenance.Publish.AllUsers.IsDisablePublishBtn = false;
            });
        }

        Init();
    }
})();
