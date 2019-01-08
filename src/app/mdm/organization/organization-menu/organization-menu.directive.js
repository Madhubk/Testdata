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

    OrganizationMenuController.$inject = ["$rootScope", "$timeout", "apiService", "authService", "organizationConfig", "helperService", "appConfig", "toastr", "errorWarningService"];

    function OrganizationMenuController($rootScope, $timeout, apiService, authService, organizationConfig, helperService, appConfig, toastr, errorWarningService) {
        var OrganizationMenuCtrl = this;

        function Init() {
            var currentTab = OrganizationMenuCtrl.currentTab[OrganizationMenuCtrl.currentTab.code].ePage.Entities;
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
                OrganizationMenuCtrl.ePage.Masters.HideErrorWarningModal = HideErrorWarningModal;

                $timeout(function () {
                    OrganizationMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                    OrganizationMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Organization.Entity[OrganizationMenuCtrl.currentTab.code];
                    OrganizationMenuCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Organization.Entity[OrganizationMenuCtrl.currentTab.code].GlobalErrorWarningList;
                });

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

                            value.ParentRef = value.MenuName;
                            value.GParentRef = value.MenuName;
                        });
                    }
                } else {
                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = [];
                }
            });
        }

        function TabSelected(tab, $index, $event) {
            if (OrganizationMenuCtrl.ePage.Masters.ActiveTabIndex != $index) {
                if (OrganizationMenuCtrl.currentTab.isNew) {
                    $event.preventDefault();
                    toastr.warning("Please Save General Details First...!");
                }
            }
        }

        function OnMenuClick($item) {
            if ($item.MenuName == "General") {
                $rootScope.UpdateGeneralPage();
            } else if ($item.MenuName == "Visibility") {
                $rootScope.UpdateVisibilityPage();
            }
        }

        function HideErrorWarningModal() {
            $("#errorWarningContainerOrganization" + OrganizationMenuCtrl.currentTab.code).removeClass("open");
        }

        Init();
    }
})();
