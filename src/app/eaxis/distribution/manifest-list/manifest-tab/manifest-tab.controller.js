(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestTabController", ManifestTabController);

    ManifestTabController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "$http", "$timeout","dmsManifestConfig"];

    function ManifestTabController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr, $http, $timeout,dmsManifestConfig) {

        var ManifestTabCtrl = this;

        function Init() {
            var currentManifest = ManifestTabCtrl.currentManifest[ManifestTabCtrl.currentManifest.label].ePage.Entities;
            ManifestTabCtrl.ePage = {
                "Title": "",
                "Prefix": "GatePass_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest
            };
            // ManifestTabCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            ManifestTabCtrl.ePage.Masters.TabSelected = TabSelected;
            GetMenuList();
        }

        function GetMenuList() {
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "TabMenu",
                "ParentMenu": "Manifest List"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestTabCtrl.ePage.Entities.Header.API.CfxMenus.FilterID
            };

            apiService.post("eAxisAPI", ManifestTabCtrl.ePage.Entities.Header.API.CfxMenus.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ManifestTabCtrl.ePage.Masters.ListSource = angular.copy(response.data.Response);

                    if (ManifestTabCtrl.ePage.Masters.ListSource.length > 0) {
                        ManifestTabCtrl.ePage.Masters.ListSource.map(function (value, key) {
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
                    ManifestTabCtrl.ePage.Masters.ListSource = [];
                }
            });
        }

        function TabSelected(tab, $index, $event) {
            if (ManifestTabCtrl.ePage.Masters.ActiveTabIndex != $index) {
                if (ManifestTabCtrl.currentManifest.isNew) {
                    $event.preventDefault();
                    toastr.warning("Please Save the Manifest Details...!");
                }
            }
        }
        
        // function OnMenuClick($item) {
        //     if ($item.MenuName == "Manifest") {
        //         $rootScope.UpdateGeneralPage();
        //     }
        // }

        Init();
    }

})();