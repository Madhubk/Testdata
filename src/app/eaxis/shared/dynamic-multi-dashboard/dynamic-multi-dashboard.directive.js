(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicMultiDashboard", DynamicMultiDashboard);

    DynamicMultiDashboard.$inject = [];

    function DynamicMultiDashboard() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/shared/dynamic-multi-dashboard/dynamic-multi-dashboard.html",
            controller: "DynMultiDashboardController",
            controllerAs: "DynMultiDashboardCtrl",
            scope: {
                pageType: "=",
                parentMenu: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("DynMultiDashboardController", DynMultiDashboardController);

    DynMultiDashboardController.$inject = ["helperService", "authService", "apiService", "eaxisConfig"];

    function DynMultiDashboardController(helperService, authService, apiService, eaxisConfig) {
        /* jshint validthis: true */
        var DynMultiDashboardCtrl = this;

        function Init() {
            DynMultiDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Multiple_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitTab();
        }

        function InitTab() {
            DynMultiDashboardCtrl.ePage.Masters.Tab = {};

            if (DynMultiDashboardCtrl.pageType && DynMultiDashboardCtrl.parentMenu) {
                GetTabList();
            }
        }

        function GetTabList() {
            DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = undefined;
            var _filter = {
                "PageType": DynMultiDashboardCtrl.pageType,
                "ParentMenu": DynMultiDashboardCtrl.parentMenu,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": eaxisConfig.Entities.CfxMenus.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = response.data.Response;
                    if (response.data.Response.length > 0) {
                        DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource.map(function (value, key) {
                            if (value.OtherConfig) {
                                if (typeof value.OtherConfig == "string") {
                                    value.OtherConfig = JSON.parse(value.OtherConfig);
                                }
                            }
                        });
                    }
                } else {
                    DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = [];
                }
            });
        }

        Init();
    }
})();
