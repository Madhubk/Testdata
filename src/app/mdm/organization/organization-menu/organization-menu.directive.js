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
        .directive("orgTabMenu", OrgTabMenu);

    function OrgTabMenu($compile) {        
        let exports = {
            restrict: "EA",
            scope: {
                tab: "=",
                entity: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            let _tabName = scope.tab.Code.split("EA_TAB_MENU_ORG_").pop().split("_").join("-").toLowerCase();
            let _template = '<organization-' + _tabName + ' current-organization="entity"/>'
            let _view = $compile(angular.element(_template))(scope);
            ele.replaceWith(_view);
        }
    }

    angular
        .module("Application")
        .controller("OrganizationMenuController", OrganizationMenuController);

    OrganizationMenuController.$inject = ["$rootScope", "$filter", "$timeout", "apiService", "authService", "organizationConfig", "helperService", "toastr", "errorWarningService"];

    function OrganizationMenuController($rootScope, $filter, $timeout, apiService, authService, organizationConfig, helperService, toastr, errorWarningService) {
        var OrganizationMenuCtrl = this;

        function Init() {
            let currentTab = OrganizationMenuCtrl.currentTab[OrganizationMenuCtrl.currentTab.code].ePage.Entities;
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

                $timeout(() => {
                    OrganizationMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                    OrganizationMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Organization.Entity[OrganizationMenuCtrl.currentTab.code];
                    OrganizationMenuCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Organization.Entity[OrganizationMenuCtrl.currentTab.code].GlobalErrorWarningList;
                });

                if(OrganizationMenuCtrl.ePage.Masters.Config.Entities.MenuList.length === 0){
                    GetMenuList();
                } else {
                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = angular.copy(OrganizationMenuCtrl.ePage.Masters.Config.Entities.MenuList);

                    let _index = OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.findIndex(x => x.MenuName == "General");
                    OnMenuClick(OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource[_index], _index);
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        function GetMenuList() {
            let _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "TabMenu",
                "ParentMenu": "Organization"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CfxMenus.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CfxMenus.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    response.data.Response.map(value => {
                        if (value.Icon && typeof value.Icon == "string") {
                            value.Icon = JSON.parse(value.Icon);
                        }
                        if (value.OtherConfig && typeof value.OtherConfig == "string") {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                        }

                        value.ParentRef = value.MenuName;
                        value.GParentRef = value.MenuName;
                    });

                    OrganizationMenuCtrl.ePage.Masters.Config.Entities.MenuList = $filter('orderBy')(response.data.Response, "DisplayOrder");

                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = angular.copy(OrganizationMenuCtrl.ePage.Masters.Config.Entities.MenuList);

                    let _index = OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.findIndex(x => x.MenuName == "General");
                    OnMenuClick(OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource[_index], _index);
                } else {
                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = [];
                }
            });
        }

        function TabSelected(tab, $index, $event) {
            // if (OrganizationMenuCtrl.ePage.Masters.ActiveTabIndex != $index && OrganizationMenuCtrl.currentTab.isNew) {
            //     $event.preventDefault();
            //     toastr.warning("Please Save General Details First...!");
            // }
        }

        function OnMenuClick($item, $index) {
            OrganizationMenuCtrl.ePage.Masters.ActiveTabIndex = $index;
            if (OrganizationMenuCtrl.currentTab.isNew) {
                if ($item.MenuName == "General") {
                    $item.IsVisited = true;
                } else {
                    let _index = OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.findIndex(x => x.MenuName == "General");
                    OrganizationMenuCtrl.ePage.Masters.ActiveTabIndex = (_index != -1) ? _index : 0;
                    toastr.warning("Please Save General Details...!");
                }
            } else {
                $item.IsVisited = true;

                $timeout(() =>{
                    if ($item.MenuName == "General") {
                        $rootScope.UpdateGeneralPage();
                    } else if ($item.MenuName == "Visibility") {
                        $rootScope.UpdateVisibilityPage();
                    }
                });
            }
        }

        function HideErrorWarningModal() {
            $("#errorWarningContainerOrganization" + OrganizationMenuCtrl.currentTab.code).removeClass("open");
        }

        Init();
    }
})();
