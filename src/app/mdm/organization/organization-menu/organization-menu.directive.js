(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationMenu", OrganizationMenu);

    function OrganizationMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/organization/organization-menu/organization-menu.html",
            controller: "OrganizationMenuController",
            controllerAs: "OrganizationMenuCtrl",
            scope: {
                currentTab: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationMenuController", OrganizationMenuController);

    OrganizationMenuController.$inject = ["$rootScope", "apiService", "authService", "organizationConfig", "helperService", "appConfig", "toastr"];

    function OrganizationMenuController($rootScope, apiService, authService, organizationConfig, helperService, appConfig, toastr) {
        var OrganizationMenuCtrl = this;

        function Init() {
            var currentTab = OrganizationMenuCtrl.currentTab[OrganizationMenuCtrl.currentTab.label].ePage.Entities;
            OrganizationMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "OrganizationMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTab
            };

            try {
                OrganizationMenuCtrl.ePage.Masters.OrganizationMenu = {};
                OrganizationMenuCtrl.ePage.Masters.Config = organizationConfig;

                OrganizationMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
                OrganizationMenuCtrl.ePage.Masters.TabSelected = TabSelected;

                GetMenuList();
            } catch (ex) {
                console.log(ex);
            }
        }

        function GetMenuList() {
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "TabMenu",
                "ParentMenu": "Organization"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = angular.copy(response.data.Response);

                    if (OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.length > 0) {
                        OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.map(function (value, key) {
                            if (value.Icon) {
                                value.Icon = JSON.parse(value.Icon);
                            }
                            if (value.OtherConfig) {
                                value.OtherConfig = JSON.parse(value.OtherConfig);
                            }
                        });

                        // if (!OrganizationMenuCtrl.ePage.Entities.Header.Data.OrgHeader.IsConsignee) {
                        //     var _consigneeIndex = OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.map(function (value, key) {
                        //         return value.MenuName;
                        //     }).indexOf("Consignee");

                        //     if (_consigneeIndex != -1) {
                        //         OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.splice(_consigneeIndex, 1);
                        //     }
                        // }

                        // if (!OrganizationMenuCtrl.ePage.Entities.Header.Data.OrgHeader.IsConsignor) {
                        //     var _consignorIndex = OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.map(function (value, key) {
                        //         return value.MenuName;
                        //     }).indexOf("Consignor");

                        //     if (_consignorIndex != -1) {
                        //         OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.splice(_consignorIndex, 1);
                        //     }
                        // }
                    }
                } else {
                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = [];
                }
            });
        }

        function TabSelected(tab, $index, $event) {
            if (OrganizationMenuCtrl.currentTab.isNew) {
                $event.preventDefault();
                toastr.warning("Please Save General Details First...!");
            }
        }

        function OnMenuClick($item) {
            if ($item.MenuName == "General") {
                $rootScope.UpdateGeneralPage();
            } else if ($item.MenuName == "Visibility") {
                $rootScope.UpdateVisibilityPage();
            }
        }

        Init();
    }
})();
