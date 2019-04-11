(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDetailsViewController", DynamicDetailsViewController);

    DynamicDetailsViewController.$inject = ["$location", "helperService", "authService"];

    function DynamicDetailsViewController($location, helperService, authService) {
        var DynamicDetailsViewCtrl = this;
        var _queryString = $location.path().split("/").pop();
        var _location = $location.path().split("/");

        function Init() {
            DynamicDetailsViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicDetailsViewCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;;

            DynamicDetailsViewCtrl.ePage.Masters.dataentryName = _location[_location.length - 2];

            try {
                DynamicDetailsViewCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                
                if (DynamicDetailsViewCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitDynamicDetailsView();
                }
            } catch (error) {
                console.log(error);
            }

        }
        // ======= Breadcrumb List ====== //
        function InitBreadcrumb() {
            DynamicDetailsViewCtrl.ePage.Masters.Breadcrumb = {};
            DynamicDetailsViewCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (DynamicDetailsViewCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + DynamicDetailsViewCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            DynamicDetailsViewCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": DynamicDetailsViewCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": DynamicDetailsViewCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": DynamicDetailsViewCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, 
            // {
            //     Code: "dynamiclistview",
            //     Description: "Dynamic List View",
            //     Link: "TC/dynamic-list-view/" + DynamicDetailsViewCtrl.ePage.Masters.dataentryName + "/" + helperService.encryptData(DynamicDetailsViewCtrl.ePage.Masters.QueryString),
            //     IsRequireQueryString: false,
            //     IsActive: false
            // }, 
            {
                Code: "dynamicdetailsview",
                Description: "Dynamic Details View" + _breadcrumbTitle,
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link).search({});
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj)).search({});
            }
        }
        // ======== Dynamic Details View ========= //
        function InitDynamicDetailsView() {
            var _isEmpty = angular.equals({}, $location.search());
            if (!_isEmpty) {
                DynamicDetailsViewCtrl.ePage.Masters.Pkey = helperService.decryptData($location.search().key);
                DynamicDetailsViewCtrl.ePage.Masters.Item = helperService.decryptData($location.search().item);
            }
        }

        Init();
    }
})();
