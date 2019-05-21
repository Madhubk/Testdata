(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackingTabController", TrackingTabController);

    TrackingTabController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "$http", "$timeout","dmsManifestConfig"];

    function TrackingTabController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr, $http, $timeout,dmsManifestConfig) {

        var TrackingTabCtrl = this;

        function Init() {
            var currentManifest = TrackingTabCtrl.currentManifest[TrackingTabCtrl.currentManifest.label].ePage.Entities;
            TrackingTabCtrl.ePage = {
                "Title": "",
                "Prefix": "Tracking_Tab",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest
            };

            GetMenuList();
        }

        function GetMenuList() {
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "TabMenu",
                "ParentMenu": "Tracking Menu"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": TrackingTabCtrl.ePage.Entities.Header.API.CfxMenus.FilterID
            };

            apiService.post("eAxisAPI", TrackingTabCtrl.ePage.Entities.Header.API.CfxMenus.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackingTabCtrl.ePage.Masters.ListSource = angular.copy(response.data.Response);

                    if (TrackingTabCtrl.ePage.Masters.ListSource.length > 0) {
                        TrackingTabCtrl.ePage.Masters.ListSource.map(function (value, key) {
                            if (value.Icon) {
                                value.Icon = JSON.parse(value.Icon);
                            }
                            if (value.OtherConfig) {
                                value.OtherConfig = JSON.parse(value.OtherConfig);
                            }

                            value.ParentRef = value.MenuName;
                            value.GParentRef = value.MenuName;
                        });
                    }
                } else {
                    TrackingTabCtrl.ePage.Masters.ListSource = [];
                }
            });
        }

        Init();
    }

})();