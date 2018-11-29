(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TenantUserSettingController", TenantUserSettingController);

    TenantUserSettingController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "trustCenterConfig"];

    function TenantUserSettingController($location, authService, apiService, helperService, toastr, trustCenterConfig) {
        /* jshint validthis: true */
        var TenantUserSettingCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TenantUserSettingCtrl.ePage = {
                "Title": "",
                "Prefix": "UserSetting",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TenantUserSettingCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TenantUserSettingCtrl.ePage.Masters.emptyText = "-";

            try {
                TenantUserSettingCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TenantUserSettingCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // region Breadcrumb
        function InitBreadcrumb() {
            TenantUserSettingCtrl.ePage.Masters.Breadcrumb = {};
            TenantUserSettingCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (TenantUserSettingCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + TenantUserSettingCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            TenantUserSettingCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TenantUserSettingCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TenantUserSettingCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TenantUserSettingCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "user",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TenantUserSettingCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TenantUserSettingCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TenantUserSettingCtrl.ePage.Masters.QueryString.AppName,
                },
                IsActive: false
            }, {
                Code: "usersettings",
                Description: "Settings" + _breadcrumbTitle,
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
        // endregion

        // region Application
        function InitApplication() {
            TenantUserSettingCtrl.ePage.Masters.Application = {};
            TenantUserSettingCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TenantUserSettingCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!TenantUserSettingCtrl.ePage.Masters.Application.ActiveApplication) {
                TenantUserSettingCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TenantUserSettingCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TenantUserSettingCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TenantUserSettingCtrl.ePage.Masters.QueryString.AppName
                };
            }

            InitTenantUserSetting();
        }
        // endregion

        // region Tenant User Settings
        function InitTenantUserSetting() {
            TenantUserSettingCtrl.ePage.Masters.SaveTenantUserSettings = ValidateTenantUserSettings;

            TenantUserSettingCtrl.ePage.Masters.OnCompanyChange = OnCompanyChange;
            TenantUserSettingCtrl.ePage.Masters.OnBranchChange = OnBranchChange;
            TenantUserSettingCtrl.ePage.Masters.OnDepartmentChange = OnDepartmentChange;
            TenantUserSettingCtrl.ePage.Masters.OnPartyChange = OnPartyChange;
            TenantUserSettingCtrl.ePage.Masters.OnRoleChange = OnRoleChange;

            TenantUserSettingCtrl.ePage.Masters.SaveBtnTxt = "Save";
            TenantUserSettingCtrl.ePage.Masters.IsDisabledSaveBtn = false;

            GetTenantUserSetting();
            GetDefaultMenuList();
            GetDepartmentList();
            GetCountryList();
        }

        function GetTenantUserSetting() {
            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting = undefined;
            var _filter = {
                "User_FK": TenantUserSettingCtrl.ePage.Masters.QueryString.UserPK,
                "SAP_FK": TenantUserSettingCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Tenant_FK": authService.getUserInfo().TenantPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TenantUserSettings.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.TenantUserSettings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TenantUserSettingCtrl.ePage.Masters.TenantUserSetting = angular.copy(response.data.Response[0]);
                        TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy = angular.copy(response.data.Response[0]);
                    } else {
                        TenantUserSettingCtrl.ePage.Masters.TenantUserSetting = {};
                    }

                    GetCompanyList();
                    GetPartiesList();
                } else {
                    TenantUserSettingCtrl.ePage.Masters.TenantUserSetting = {};
                }
            });
        }

        function GetDefaultMenuList() {
            TenantUserSettingCtrl.ePage.Masters.MenuTypeList = [{
                "Code": "List",
                "Name": "List"
            }, {
                "Code": "Grid",
                "Name": "Grid"
            }]
        }

        function GetCompanyList() {
            TenantUserSettingCtrl.ePage.Masters.CompanyList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpCompany.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpCompany.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TenantUserSettingCtrl.ePage.Masters.CompanyList = angular.copy(response.data.Response);

                    if (TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy) {
                        var _index = TenantUserSettingCtrl.ePage.Masters.CompanyList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy.Company_FK);

                        if (_index != -1) {
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Company_FK = TenantUserSettingCtrl.ePage.Masters.CompanyList[_index].PK;
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.CompanyCode = TenantUserSettingCtrl.ePage.Masters.CompanyList[_index].Code;
                        }
                    }

                    if (TenantUserSettingCtrl.ePage.Masters.CompanyList.length > 0) {
                        var _index = TenantUserSettingCtrl.ePage.Masters.CompanyList.map(function (value1, key1) {
                            return value1.PK;
                        }).indexOf(TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Company_FK);
                        if (_index !== -1) {
                            OnCompanyChange(TenantUserSettingCtrl.ePage.Masters.CompanyList[_index]);
                        } else {
                            OnCompanyChange(TenantUserSettingCtrl.ePage.Masters.CompanyList[0]);
                        }
                    }
                } else {
                    TenantUserSettingCtrl.ePage.Masters.CompanyList = [];
                }
            });
        }

        function OnCompanyChange($item) {
            TenantUserSettingCtrl.ePage.Masters.ActiveCompany = angular.copy($item);

            if (TenantUserSettingCtrl.ePage.Masters.ActiveCompany && TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Company_FK) {
                TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.CompanyCode = TenantUserSettingCtrl.ePage.Masters.ActiveCompany.Code;
                GetBranchList();
            } else {
                TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.CompanyCode = undefined;
                TenantUserSettingCtrl.ePage.Masters.BranchList = [];
            }
        }

        function GetBranchList() {
            TenantUserSettingCtrl.ePage.Masters.BranchList = undefined;
            var _filter = {
                "CMP_FK": TenantUserSettingCtrl.ePage.Masters.ActiveCompany.PK,
                "CMP_Code": TenantUserSettingCtrl.ePage.Masters.ActiveCompany.Code,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpBranch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpBranch.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TenantUserSettingCtrl.ePage.Masters.BranchList = response.data.Response;

                    if (TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy) {
                        var _index = TenantUserSettingCtrl.ePage.Masters.BranchList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy.Branch_FK);

                        if (_index != -1) {
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Branch_FK = TenantUserSettingCtrl.ePage.Masters.BranchList[_index].PK;
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.BranchCode = TenantUserSettingCtrl.ePage.Masters.BranchList[_index].Code;
                        }
                    }
                } else {
                    TenantUserSettingCtrl.ePage.Masters.BranchList = [];
                }
            });
        }

        function OnBranchChange($item) {
            TenantUserSettingCtrl.ePage.Masters.ActiveBranch = angular.copy($item);

            if (TenantUserSettingCtrl.ePage.Masters.ActiveBranch) {
                TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.BranchCode = TenantUserSettingCtrl.ePage.Masters.ActiveBranch.Code;
            }
        }

        function GetDepartmentList() {
            TenantUserSettingCtrl.ePage.Masters.DepartmentList = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TenantUserSettingCtrl.ePage.Masters.DepartmentList = response.data.Response;
                } else {
                    TenantUserSettingCtrl.ePage.Masters.DepartmentList = [];
                }
            });
        }

        function OnDepartmentChange($item) {
            TenantUserSettingCtrl.ePage.Masters.ActiveDepartment = angular.copy($item);

            if (TenantUserSettingCtrl.ePage.Masters.ActiveDepartment) {
                TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.DepartmentCode = TenantUserSettingCtrl.ePage.Masters.ActiveDepartment.Code;
            }
        }

        function GetCountryList() {
            TenantUserSettingCtrl.ePage.Masters.CountryList = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.MstCountry.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MstCountry.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TenantUserSettingCtrl.ePage.Masters.CountryList = response.data.Response;
                } else {
                    TenantUserSettingCtrl.ePage.Masters.CountryList = [];
                }
            });
        }

        function GetPartiesList() {
            TenantUserSettingCtrl.ePage.Masters.PartiesList = undefined;
            var _filter = {
                "UserName": TenantUserSettingCtrl.ePage.Masters.QueryString.UserId,
                "SAP_Code": TenantUserSettingCtrl.ePage.Masters.Application.ActiveApplication.AppCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.GetPartiesByUserApp.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.GetPartiesByUserApp.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TenantUserSettingCtrl.ePage.Masters.PartiesList = response.data.Response;

                    if (TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy) {
                        var _index = TenantUserSettingCtrl.ePage.Masters.PartiesList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy.Party_FK);

                        if (_index != -1) {
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Party_FK = TenantUserSettingCtrl.ePage.Masters.PartiesList[_index].PK;
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.PartyCode = TenantUserSettingCtrl.ePage.Masters.PartiesList[_index].Code;
                        }
                    }

                    if (TenantUserSettingCtrl.ePage.Masters.PartiesList.length > 0) {
                        var _index = TenantUserSettingCtrl.ePage.Masters.PartiesList.map(function (value1, key1) {
                            return value1.PK;
                        }).indexOf(TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Party_FK);
                        if (_index !== -1) {
                            OnPartyChange(TenantUserSettingCtrl.ePage.Masters.PartiesList[_index]);
                        } else {
                            OnPartyChange(TenantUserSettingCtrl.ePage.Masters.PartiesList[0]);
                        }
                    }
                } else {
                    TenantUserSettingCtrl.ePage.Masters.PartiesList = [];
                }
            });
        }

        function OnPartyChange($item) {
            TenantUserSettingCtrl.ePage.Masters.ActiveParty = angular.copy($item);

            if (TenantUserSettingCtrl.ePage.Masters.ActiveParty && TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Party_FK) {
                TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.PartyCode = TenantUserSettingCtrl.ePage.Masters.ActiveParty.Code;
                GetRolesList();
            } else {
                TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.PartyCode = undefined
                TenantUserSettingCtrl.ePage.Masters.RolesList = [];
            }
        }

        function GetRolesList() {
            TenantUserSettingCtrl.ePage.Masters.RolesList = undefined;
            var _filter = {
                "UserName": TenantUserSettingCtrl.ePage.Masters.QueryString.UserId,
                "SAP_Code": TenantUserSettingCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "PartyCode": TenantUserSettingCtrl.ePage.Masters.ActiveParty.Code,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.GetPartiesByUserApp.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.GetRoleByUserApp.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TenantUserSettingCtrl.ePage.Masters.RolesList = response.data.Response;

                    if (TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy) {
                        var _index = TenantUserSettingCtrl.ePage.Masters.RolesList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(TenantUserSettingCtrl.ePage.Masters.TenantUserSettingCopy.Role_Fk);

                        if (_index != -1) {
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Role_Fk = TenantUserSettingCtrl.ePage.Masters.RolesList[_index].PK;
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Role_Code = TenantUserSettingCtrl.ePage.Masters.RolesList[_index].Code;
                        }
                    }
                } else {
                    TenantUserSettingCtrl.ePage.Masters.RolesList = [];
                }
            });
        }

        function OnRoleChange($item) {
            TenantUserSettingCtrl.ePage.Masters.ActiveRole = angular.copy($item);

            if (TenantUserSettingCtrl.ePage.Masters.ActiveRole) {
                TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Role_Code = TenantUserSettingCtrl.ePage.Masters.ActiveRole.Code;
            }
        }

        function ValidateTenantUserSettings() {
            // if (TenantUserSettingCtrl.ePage.Masters.TenantUserSetting) {
            //     if (!TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Party_FK || !TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.Role_Fk || !TenantUserSettingCtrl.ePage.Masters.TenantUserSetting.DefaultMenu) {
            //         toastr.warning("Fill All the Fields...!");
            //     } else {
            //         SaveTenantUserSettings();
            //     }
            // } else {
            //     toastr.warning("Fill All the Fields...!");
            // }

            SaveTenantUserSettings();
        }

        function SaveTenantUserSettings() {
            TenantUserSettingCtrl.ePage.Masters.SaveBtnTxt = "Please Wait...";
            TenantUserSettingCtrl.ePage.Masters.IsDisabledSaveBtn = true;

            var _input = angular.copy(TenantUserSettingCtrl.ePage.Masters.TenantUserSetting);
            _input.User_FK = TenantUserSettingCtrl.ePage.Masters.QueryString.UserPK;
            _input.SAP_FK = TenantUserSettingCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.Tenant_FK = authService.getUserInfo().TenantPK;
            // _input.CompanyCode = TenantUserSettingCtrl.ePage.Masters.ActiveCompany.Code;
            // _input.BranchCode = TenantUserSettingCtrl.ePage.Masters.ActiveBranch.Code;
            // _input.DepartmentCode = TenantUserSettingCtrl.ePage.Masters.ActiveDepartment.Code;
            // _input.PartyCode = TenantUserSettingCtrl.ePage.Masters.ActiveParty.Code;
            // _input.Role_Code = TenantUserSettingCtrl.ePage.Masters.ActiveRole.Code;
            _input.IsModified = true;

            if (_input.PK) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.TenantUserSettings.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        TenantUserSettingCtrl.ePage.Masters.TenantUserSetting = response.data.Response;
                    } else {
                        toastr.error("Could not Update...!");
                    }

                    TenantUserSettingCtrl.ePage.Masters.SaveBtnTxt = "Save";
                    TenantUserSettingCtrl.ePage.Masters.IsDisabledSaveBtn = false;
                });
            } else {
                apiService.post("authAPI", trustCenterConfig.Entities.API.TenantUserSettings.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            TenantUserSettingCtrl.ePage.Masters.TenantUserSetting = response.data.Response[0];
                        }
                    } else {
                        toastr.error("Could not Insert...!");
                    }

                    TenantUserSettingCtrl.ePage.Masters.SaveBtnTxt = "Save";
                    TenantUserSettingCtrl.ePage.Masters.IsDisabledSaveBtn = false;
                });
            }
        }
        // endregion

        Init();
    }
})();
