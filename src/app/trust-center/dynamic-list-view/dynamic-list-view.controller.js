(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicListViewController", DynamicListViewController);

    DynamicListViewController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService"];

    function DynamicListViewController($location, APP_CONSTANT, authService, apiService, helperService) {
        /* jshint validthis: true */
        var DynamicListViewCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DynamicListViewCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicPageList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicListViewCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                DynamicListViewCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                
                if (DynamicListViewCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb()
                    InitDynamicListView();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========== BreadCrumb ========== //
        function InitBreadcrumb() {
            DynamicListViewCtrl.ePage.Masters.Breadcrumb = {};
            DynamicListViewCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (DynamicListViewCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + DynamicListViewCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            DynamicListViewCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DynamicListViewCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DynamicListViewCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DynamicListViewCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "dynamiclistview",
                Description: "Dynamic List View" + _breadcrumbTitle,
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

        // ======= Dynamic List View ========== //
        function InitDynamicListView() {
            DynamicListViewCtrl.ePage.Masters.DynamicListView = {};

            var _queryString = $location.search();
            var _location = $location.path().split("/");

            if (_queryString) {
                var _isEmpty = angular.equals({}, _queryString);

                if (!_isEmpty) {
                    var _decrypted = helperService.decryptData(_queryString.item);

                    if (typeof _decrypted == "string") {
                        _decrypted = JSON.parse(_decrypted);
                    }
                    DynamicListViewCtrl.ePage.Masters.defaultFilter = _decrypted;
                }
            }
            
            DynamicListViewCtrl.ePage.Masters.dataentryName = _location[_location.length - 2];

            DynamicListViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function SelectedGridRow($item) {
            var _queryString = DynamicListViewCtrl.ePage.Masters.QueryString;
            _queryString.BreadcrumbTitle = DynamicListViewCtrl.ePage.Masters.DataEntry.Title;

            if ($item.action === "link" || $item.action === "dblClick") {
                var _detailKey = $item.data.entity[$item.dataEntryMaster.GridConfig.DetailKey];
                $location.path("TC/dynamic-details-view/" + DynamicListViewCtrl.ePage.Masters.dataentryName + '/' + helperService.encryptData(_queryString)).search({
                    item: helperService.encryptData(_detailKey)
                });
            } else {
                $location.path("TC/dynamic-details-view/" + DynamicListViewCtrl.ePage.Masters.dataentryName + '/' + helperService.encryptData(_queryString));
            }
        }

        Init();
    }
})();
