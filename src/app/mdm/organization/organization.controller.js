(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationController", OrganizationController);

    OrganizationController.$inject = ["$timeout", "apiService", "authService", "appConfig", "helperService", "organizationConfig", "toastr"];

    function OrganizationController($timeout, apiService, authService, appConfig, helperService, organizationConfig, toastr) {
        var OrganizationCtrl = this;

        function Init() {
            OrganizationCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": organizationConfig.Entities
            };

            // For list directive
            OrganizationCtrl.ePage.Masters.taskName = "organization";
            OrganizationCtrl.ePage.Masters.dataEntryName = "OrganizationList";
            debugger
            // OrganizationCtrl.ePage.Masters.OrderData = [];
            OrganizationCtrl.ePage.Masters.TabList = [];
            OrganizationCtrl.ePage.Masters.activeTabIndex = 0;
            OrganizationCtrl.ePage.Masters.IsTabClick = false;
            OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;
            OrganizationCtrl.ePage.Masters.SaveButtonText = "Save";
            OrganizationCtrl.ePage.Masters.IsDisableSave = false;
            OrganizationCtrl.ePage.Masters.EnableSearchResult = false;
            OrganizationCtrl.ePage.Masters.AddTab = AddTab;
            OrganizationCtrl.ePage.Masters.RemoveTab = RemoveTab;
            OrganizationCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OrganizationCtrl.ePage.Masters.Logout = Logout;
            OrganizationCtrl.ePage.Masters.CreateNewOrganization = CreateNewOrganization;
            OrganizationCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            OrganizationCtrl.ePage.Masters.TopMenuToggle = TopMenuToggle;
            OrganizationCtrl.ePage.Masters.config = organizationConfig;

            OrganizationCtrl.ePage.Masters.config.ValidationFindall();
            OrganizationCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
            GetNewOrganization();
        }
        
        function GetNewOrganization() {
            if (OrganizationCtrl.ePage.Entities.Header.Message == true) {
                CreateNewOrganization();
            }
        }

        function CreateNewOrganization() {
            var _isExist = OrganizationCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                OrganizationCtrl.ePage.Masters.IsNewOrgClicked = true;
                helperService.getFullObjectUsingGetById(OrganizationCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.OrgHeader,
                            data: response.data.Response
                        };
                        OrganizationCtrl.ePage.Masters.AddTab(_obj, true);
                        OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;
                    } else {
                        console.log("Empty New Organization response");
                    }
                });
            }else {
                toastr.info("New Record Already Opened...!");
            }
        }
        
        function RemoveTab(event, index, currentOrganization) {
            event.preventDefault();
            event.stopPropagation();
            var currentOrganization = currentOrganization[currentOrganization.label].ePage.Entities;
            OrganizationCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", OrganizationCtrl.ePage.Entities.Header.API.SessionClose.Url + currentOrganization.Header.Data.OrgHeader.PK).then(function(response){
                if (response.data.Response === "Successfully Cleared") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function AddTab(currentOrganization, isNew) {
            OrganizationCtrl.ePage.Masters.currentOrganization = undefined;

            var _isExist = OrganizationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentOrganization.entity.Code)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });
            
            if (!_isExist) {
                OrganizationCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrganization = undefined;
                if (!isNew) {
                    _currentOrganization = currentOrganization.entity;
                } else {
                    _currentOrganization = currentOrganization;
                }

                organizationConfig.GetTabDetails(_currentOrganization, isNew).then(function (response) {
                    OrganizationCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        OrganizationCtrl.ePage.Masters.activeTabIndex = OrganizationCtrl.ePage.Masters.TabList.length;
                        OrganizationCtrl.ePage.Masters.CurrentActiveTab(currentOrganization.entity.Code);
                        OrganizationCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Organization already opened');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            OrganizationCtrl.ePage.Masters.currentOrganization = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OrganizationCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewOrganization();
            }
        }

        function Logout() {
            apiService.logout();
        }

        function TopMenuToggle() {
            $(".eaxis-tab-box > .nav-tabs").slideToggle("slow");
            $(".eaxis-tab-box-2 > .nav-tabs").css({
                "display": "none"
            });
        }

        Init();
    }
})();
