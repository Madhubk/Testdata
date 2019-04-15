(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationAccessRights", OrganizationAccessRights);

    OrganizationAccessRights.$inject = ["$templateCache"];

    function OrganizationAccessRights($templateCache) {
        let _template = `<div class="clearfix org-access-rights-container p-0">
            <uib-tabset active="OrganizationAccessRightsCtrl.ePage.Masters.ActiveTabIndex">
                <uib-tab data-ng-repeat="x in OrganizationAccessRightsCtrl.ePage.Masters.TabList" data-ng-click="OrganizationAccessRightsCtrl.ePage.Masters.OnTabClick(x, $index)"
                    deselect="OrganizationAccessRightsCtrl.ePage.Masters.OnTabSelected(x, $selectedIndex, $event);">
                    <uib-tab-heading title="{{x.Title}}">
                        <span data-ng-bind="x.Title"></span>
                    </uib-tab-heading>
                    <div class="clearfix" org-access-rights-tab tab="x" entity="OrganizationAccessRightsCtrl.currentOrganization"
                        data-ng-if="x.IsVisited"></div>
                </uib-tab>
            </uib-tabset>
        </div>`;
        $templateCache.put("OrgAccessRights.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "OrgAccessRights.html",
            controller: "OrganizationAccessRightsController",
            controllerAs: "OrganizationAccessRightsCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .directive("orgAccessRightsTab", OrgAccessRightsTab);

    function OrgAccessRightsTab($compile) {
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
            let _tabName = scope.tab.Code;
            let _template = '<organization-' + _tabName + '-group current-organization="entity"/>'
            let _view = $compile(angular.element(_template))(scope);
            ele.replaceWith(_view);
        }
    }

    angular
        .module("Application")
        .controller("OrganizationAccessRightsController", OrganizationAccessRightsController);

    OrganizationAccessRightsController.$inject = ["helperService"];

    function OrganizationAccessRightsController(helperService) {
        let OrganizationAccessRightsCtrl = this;

        function Init() {
            let currentOrganization = OrganizationAccessRightsCtrl.currentOrganization[OrganizationAccessRightsCtrl.currentOrganization.code].ePage.Entities;

            OrganizationAccessRightsCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Access_Rights",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrganizationAccessRightsCtrl.ePage.Masters.OnTabClick = OnTabClick;
            OrganizationAccessRightsCtrl.ePage.Masters.OnTabSelected = OnTabSelected;

            GetAccessRightsMenus();
        }

        function GetAccessRightsMenus() {
            OrganizationAccessRightsCtrl.ePage.Masters.TabList = [{
                Title: "Event",
                Code: "event"
            }, {
                Title: "Task",
                Code: "task"
            }, {
                Title: "Comment",
                Code: "comment"
            }, {
                Title: "Document",
                Code: "document"
            }, {
                Title: "Exception",
                Code: "exception"
            }, {
                Title: "Email",
                Code: "email"
            }];

            OnTabClick(OrganizationAccessRightsCtrl.ePage.Masters.TabList[0], 0);
        }

        function OnTabClick($item, $index) {
            OrganizationAccessRightsCtrl.ePage.Masters.ActiveTabIndex = $index;
            $item.IsVisited = true;
        }

        function OnTabSelected($item, $index, $event) {

        }

        Init();
    }
})();
