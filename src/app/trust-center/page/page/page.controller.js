(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PageController", PageController);

    PageController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function PageController($location, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var PageCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            PageCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PageCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            PageCtrl.ePage.Masters.emptyText = "-";

            try {
                PageCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (PageCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitModule();
                    InitPage();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            PageCtrl.ePage.Masters.Breadcrumb = {};
            PageCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            PageCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": PageCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": PageCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": PageCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "page",
                Description: "Page",
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
        // ========================ApplicationDropdown Start=============

        function InitApplication() {
            PageCtrl.ePage.Masters.Application = {};
            PageCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            PageCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!PageCtrl.ePage.Masters.Application.ActiveApplication) {
                PageCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": PageCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": PageCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": PageCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetRedirectLinkList();

            if (PageCtrl.ePage.Masters.ActiveModule || PageCtrl.ePage.Masters.ActiveSubModule || PageCtrl.ePage.Masters.ActiveEntitySource) {
                GetPageList();
            } else {
                PageCtrl.ePage.Masters.Page.PageList = [];
            }
        }

        // ========================ApplicationDropdown End==========
        // ========================Module Start========================

        function InitModule() {
            PageCtrl.ePage.Masters.OnModuleChange = OnModuleChange;
            PageCtrl.ePage.Masters.OnSubModuleChange = OnSubModuleChange;
            PageCtrl.ePage.Masters.OnEntitySourceChange = OnEntitySourceChange;

            GetEntitySourceList();
            GetModuleList();
        }

        function GetModuleList() {
            PageCtrl.ePage.Masters.ModuleList = undefined;
            var _filter = {
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    PageCtrl.ePage.Masters.ModuleList = response.data.Response;
                }
            });
        }

        function OnModuleChange($item) {
            PageCtrl.ePage.Masters.ActiveModule = angular.copy($item);

            if (PageCtrl.ePage.Masters.ActiveModule) {
                GetSubModuleList();
            } else {
                PageCtrl.ePage.Masters.SubModuleList = [];
            }

            GetPageList();
        }

        function GetSubModuleList() {
            PageCtrl.ePage.Masters.SubModuleList = undefined;

            var _filter = {
                "PropertyName": "DEM_Type",
                "Group": PageCtrl.ePage.Masters.ActiveModule.Key,
                "SAP_FK": PageCtrl.ePage.Masters.Application.ActiveApplication.PK
                // "IsAccessBased":"false"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataEntryMaster.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataEntryMaster.API.GetColumnValuesWithFilters.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PageCtrl.ePage.Masters.SubModuleList = response.data.Response;
                }
            });
        }

        function OnSubModuleChange($item) {
            PageCtrl.ePage.Masters.ActiveSubModule = angular.copy($item);

            GetPageList();
        }

        function GetEntitySourceList() {
            PageCtrl.ePage.Masters.EntitySourceList = ["GENERAL", "ROLE", "TENANT", "ORGANIZATION", "EXPRESSION"];
        }

        function OnEntitySourceChange($item) {
            PageCtrl.ePage.Masters.ActiveEntitySource = $item;
            GetPageList();
        }

        // ========================Module End========================
        // ========================Page Start========================

        function InitPage() {
            PageCtrl.ePage.Masters.Page = {};
            PageCtrl.ePage.Masters.Page.PageList = [];

            PageCtrl.ePage.Masters.Page.Edit = Edit;
            PageCtrl.ePage.Masters.Page.Copy = Copy;
            PageCtrl.ePage.Masters.Page.AddNew = AddNew;
            PageCtrl.ePage.Masters.Page.OnPageClick = OnPageClick;
            PageCtrl.ePage.Masters.Page.OnRelatedLookupClick = OnRelatedLookupClick;
            PageCtrl.ePage.Masters.Page.DeleteConfirmation = DeleteConfirmation;

            PageCtrl.ePage.Masters.Page.Publish = Publish;
            PageCtrl.ePage.Masters.Page.OnRedirectLinkClick = OnRedirectLinkClick;

            PageCtrl.ePage.Masters.Page.DeleteBtnText = "Delete";
            PageCtrl.ePage.Masters.Page.IsDisableDeleteBtn = false;
        }

        function GetPageList() {
            PageCtrl.ePage.Masters.Page.PageList = undefined;
            var _filter = {
                "SAP_FK": PageCtrl.ePage.Masters.Application.ActiveApplication.PK
            };

            if (PageCtrl.ePage.Masters.ActiveModule) {
                _filter.Group = PageCtrl.ePage.Masters.ActiveModule.Key;
            }
            if (PageCtrl.ePage.Masters.ActiveSubModule) {
                _filter.Type = PageCtrl.ePage.Masters.ActiveSubModule;
            }
            if (PageCtrl.ePage.Masters.ActiveEntitySource) {
                _filter.EntitySource = PageCtrl.ePage.Masters.ActiveEntitySource;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataEntryMaster.API.FindAllColumn.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataEntryMaster.API.FindAllColumn.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PageCtrl.ePage.Masters.Page.PageList = response.data.Response;
                    if (PageCtrl.ePage.Masters.Page.PageList.length > 0) {
                        OnPageClick(PageCtrl.ePage.Masters.Page.PageList[0]);
                    } else {
                        OnPageClick();
                    }
                } else {
                    PageCtrl.ePage.Masters.Page.PageList = [];
                }
            });
        }

        function AddNew() {
            PageCtrl.ePage.Masters.Page.ActivePage = {};
            PageCtrl.ePage.Masters.Page.Mode = "New";
            AddOrEditPage();
        }

        function OnPageClick($item) {
            PageCtrl.ePage.Masters.Page.ActivePage = angular.copy($item);

            if (PageCtrl.ePage.Masters.Page.ActivePage) {
                PageCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "DYN_DataEntryMaster",
                    ObjectId: PageCtrl.ePage.Masters.Page.ActivePage.DataEntry_PK
                };
                PageCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function Edit() {
            PageCtrl.ePage.Masters.Page.Mode = "Edit";
            AddOrEditPage();
        }

        function Copy() {
            PageCtrl.ePage.Masters.Page.Mode = "Copy";
            AddOrEditPage();
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
            PageCtrl.ePage.Masters.Page.DeleteBtnText = "Please Wait...";
            PageCtrl.ePage.Masters.Page.IsDisableDeleteBtn = true;

            PageCtrl.ePage.Masters.Page.ActivePage.IsModified = true;
            PageCtrl.ePage.Masters.Page.ActivePage.IsDelete = true;
            PageCtrl.ePage.Masters.Page.ActivePage.TenantCode = authService.getUserInfo().TenantCode;

            var _input = [PageCtrl.ePage.Masters.Page.ActivePage];

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataEntryMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = PageCtrl.ePage.Masters.Page.PageList.map(function (value, key) {
                        return value.DataEntry_PK;
                    }).indexOf(PageCtrl.ePage.Masters.Page.ActivePage.DataEntry_PK);

                    if (_index !== -1) {
                        PageCtrl.ePage.Masters.Page.PageList.splice(_index, 1);
                        if (PageCtrl.ePage.Masters.Page.PageList.length > 0) {
                            PageCtrl.ePage.Masters.Page.ActivePage = angular.copy(PageCtrl.ePage.Masters.Page.PageList[0]);
                        } else {
                            OnPageClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                PageCtrl.ePage.Masters.Page.DeleteBtnText = "Delete";
                PageCtrl.ePage.Masters.Page.IsDisableDeleteBtn = false;
            });
        }

        function GetRedirectLinkList() {
            PageCtrl.ePage.Masters.Page.RedirectPageList = [{
                Code: "RelatedLookup",
                Description: "RelatedLookup",
                Icon: "fa fa-cog",
                Link: "TC/related-lookup",
                Color: "#333333"
            }, {
                Code: "UIRestriction",
                Description: "UI Restriction",
                Icon: "fa fa-cog",
                Link: "TC/page/ui-restriction",
                Color: "#333333"
            }];
        }

        function OnRedirectLinkClick($item) {
            OnRelatedLookupClick($item);
        }

        function AddOrEditPage() {
            if (PageCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": PageCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": PageCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": PageCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = PageCtrl.ePage.Masters.QueryString;
            }

            if (PageCtrl.ePage.Masters.Page.ActivePage) {
                _queryString.PagePk = PageCtrl.ePage.Masters.Page.ActivePage.DataEntry_PK;
                _queryString.PageName = PageCtrl.ePage.Masters.Page.ActivePage.DataEntryName;
                _queryString.BreadcrumbTitle = PageCtrl.ePage.Masters.Page.ActivePage.DataEntryName;
                _queryString.Mode = PageCtrl.ePage.Masters.Page.Mode;
            }

            if (PageCtrl.ePage.Masters.ActiveModule) {
                _queryString.Module = PageCtrl.ePage.Masters.ActiveModule.Key;
            }
            if (PageCtrl.ePage.Masters.ActiveSubModule) {
                _queryString.SubModule = PageCtrl.ePage.Masters.ActiveSubModule;
            }
            if (PageCtrl.ePage.Masters.ActiveEntitySource) {
                _queryString.EntitySource = PageCtrl.ePage.Masters.ActiveEntitySource;
            }

            if (PageCtrl.ePage.Masters.ActiveApplication == 'TC') {
                $location.path("TC/page/edit/" + helperService.encryptData(_queryString));
            } else if (PageCtrl.ePage.Masters.ActiveApplication == 'EA') {
                $location.path("EA/admin/page/edit/" + helperService.encryptData(_queryString));
            }
        }

        function OnRelatedLookupClick($item) {
            if (PageCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": PageCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": PageCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": PageCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = PageCtrl.ePage.Masters.QueryString;
            }
            _queryString.DataEntry_PK = PageCtrl.ePage.Masters.Page.ActivePage.DataEntry_PK;
            _queryString.DataEntryName = PageCtrl.ePage.Masters.Page.ActivePage.DataEntryName;
            _queryString.BreadcrumbTitle = PageCtrl.ePage.Masters.Page.ActivePage.DataEntryName;
            _queryString.EntityRefCode = PageCtrl.ePage.Masters.Page.ActivePage.EntityRefCode;
            _queryString.EntityRefKey = PageCtrl.ePage.Masters.Page.ActivePage.EntityRefKey;
            _queryString.EntitySource = PageCtrl.ePage.Masters.Page.ActivePage.EntitySource;

            $location.path($item.Link + "/" + helperService.encryptData(_queryString));
        }

        function Publish() {
            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataEntryDetails.API.GetPublishDataEntryMasterJson.Url + PageCtrl.ePage.Masters.Page.ActivePage.DataEntry_PK).then(response => {
                toastr.success("Published Successfully...!");
            });
        }

        // ========================Page End========================

        Init();
    }
})();
