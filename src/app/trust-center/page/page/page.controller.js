(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PageController", PageController);

    PageController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function PageController($scope, $location, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
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
                    InitModule();
                    InitPage();
                }
            } catch (error) {
                console.log(error)
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
                Code: "configuration",
                Description: "Configuration",
                Link: "TC/dashboard/" + helperService.encryptData('{"Type":"Configuration", "BreadcrumbTitle": "Configuration"}'),
                IsRequireQueryString: false,
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

        // ========================Module Start========================

        function InitModule() {
            PageCtrl.ePage.Masters.Module = {};
            PageCtrl.ePage.Masters.SubModule = {};
            PageCtrl.ePage.Masters.Module.OnModuleChange = OnModuleChange;
            PageCtrl.ePage.Masters.SubModule.OnSubModuleChange = OnSubModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            var _filter = {
                SortColumn:"TYP_Sequence",
                SortType:"ASC",
                PageNumber:"1",
                PageSize:"1000",
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + PageCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    PageCtrl.ePage.Masters.Module.ListSource = response.data.Response;
                    if (PageCtrl.ePage.Masters.Module.ListSource.length > 0) {
                        OnModuleChange(PageCtrl.ePage.Masters.Module.ListSource[0])
                    }
                }
            });
        }

        function OnModuleChange($item) {
            PageCtrl.ePage.Masters.Module.ActiveModule = angular.copy($item);

            GetSubModuleList();
        }

        function GetSubModuleList() {
            PageCtrl.ePage.Masters.SubModule.ListSource = undefined;

            var _filter = {
                "PropertyName": "DEM_Type",
                "Group": PageCtrl.ePage.Masters.Module.ActiveModule.Key,
                "SAP_FK": PageCtrl.ePage.Masters.QueryString.AppPk
               // "IsAccessBased":"false"
               
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntryMaster.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.GetColumnValuesWithFilters.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PageCtrl.ePage.Masters.SubModule.ListSource = response.data.Response;
                    if (PageCtrl.ePage.Masters.SubModule.ListSource.length > 0) {
                        OnSubModuleChange(PageCtrl.ePage.Masters.SubModule.ListSource[0])
                    } else {
                        PageCtrl.ePage.Masters.SubModule.ListSource = [];
                        PageCtrl.ePage.Masters.SubModule.ActiveSubModule = undefined;
                        PageCtrl.ePage.Masters.Page.PageList = [];
                        PageCtrl.ePage.Masters.Page.ActivePage = undefined;
                    }
                } else {
                    PageCtrl.ePage.Masters.SubModule.ListSource = [];
                    PageCtrl.ePage.Masters.SubModule.ActiveSubModule = undefined;
                    PageCtrl.ePage.Masters.Page.PageList = [];
                    PageCtrl.ePage.Masters.Page.ActivePage = undefined;
                }
            });
        }

        function OnSubModuleChange($item) {
            PageCtrl.ePage.Masters.SubModule.ActiveSubModule = angular.copy($item);

            GetPageList();
        }

        // ========================Module End========================

        // ========================Page Start========================

        function InitPage() {
            PageCtrl.ePage.Masters.Page = {};
            PageCtrl.ePage.Masters.Page.ActivePage = {};
            PageCtrl.ePage.Masters.Page.Edit = Edit;
            PageCtrl.ePage.Masters.Page.Copy = Copy;
            PageCtrl.ePage.Masters.Page.AddNew = AddNew;
            PageCtrl.ePage.Masters.Page.OnPageClick = OnPageClick;
            PageCtrl.ePage.Masters.Page.DeleteConfirmation = DeleteConfirmation;

            PageCtrl.ePage.Masters.Page.DeleteBtnText = "Delete";
            PageCtrl.ePage.Masters.Page.IsDisableDeleteBtn = false;
        }

        function GetPageList() {
            PageCtrl.ePage.Masters.Page.PageList = undefined;
            var _filter = {
                "Group": PageCtrl.ePage.Masters.Module.ActiveModule.Key,
                "Type": PageCtrl.ePage.Masters.SubModule.ActiveSubModule,
                "SAP_FK": PageCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
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

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
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

        function AddOrEditPage() {
            var _queryString = PageCtrl.ePage.Masters.QueryString;

            if (PageCtrl.ePage.Masters.Page.ActivePage) {
                _queryString.PagePk = PageCtrl.ePage.Masters.Page.ActivePage.DataEntry_PK;
                _queryString.PageName = PageCtrl.ePage.Masters.Page.ActivePage.DataEntryName;
                _queryString.BreadcrumbTitle = PageCtrl.ePage.Masters.Page.ActivePage.DataEntryName;
                _queryString.Mode = PageCtrl.ePage.Masters.Page.Mode;
                _queryString.Module = PageCtrl.ePage.Masters.Module.ActiveModule.Key;
                _queryString.SubModule = PageCtrl.ePage.Masters.SubModule.ActiveSubModule;
            }

            if (PageCtrl.ePage.Masters.ActiveApplication == 'TC') {
                $location.path("TC/page/edit/" + helperService.encryptData(_queryString));
            } else if (PageCtrl.ePage.Masters.ActiveApplication == 'EA') {
                $location.path("EA/admin/page/edit/" + helperService.encryptData(_queryString));
            }
        }

        // ========================Page End========================

        Init();
    }
})();
