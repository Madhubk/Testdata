(function() {
    "use strict";

    angular
        .module("Application")
        .controller("AdminConsignmentController", AdminConsignmentController);

    AdminConsignmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "adminConsignmentConfig", "$timeout", "toastr", "appConfig"];

    function AdminConsignmentController($location, APP_CONSTANT, authService, apiService, helperService, adminConsignmentConfig, $timeout, toastr, appConfig) {

        var AdminConsignmentCtrl = this;

        function Init() {

            AdminConsignmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": adminConsignmentConfig.Entities
            };

            AdminConsignmentCtrl.ePage.Masters.taskName = "TransportsConsignment";
            AdminConsignmentCtrl.ePage.Masters.dataentryName = "Consignment";
            AdminConsignmentCtrl.ePage.Masters.TabList = [];
            AdminConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
            AdminConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
            AdminConsignmentCtrl.ePage.Masters.IsTabClick = false;
            AdminConsignmentCtrl.ePage.Masters.Config = adminConsignmentConfig;

            //functions
            AdminConsignmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AdminConsignmentCtrl.ePage.Masters.AddTab = AddTab;
            AdminConsignmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            AdminConsignmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            AdminConsignmentCtrl.ePage.Masters.CreateNewConsignment = CreateNewConsignment;
            AdminConsignmentCtrl.ePage.Masters.SaveandClose = SaveandClose;

            adminConsignmentConfig.ValidationFindall();
        }

        function SaveandClose(index, currentConsignment) {
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            AdminConsignmentCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", AdminConsignmentCtrl.ePage.Entities.Header.API.SessionClose.Url + currentConsignment.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            AdminConsignmentCtrl.ePage.Masters.Config.SaveAndClose = false;
            AdminConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                AdminConsignmentCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewConsignment();
            }
        }

        function AddTab(currentConsignment, isNew) {
            AdminConsignmentCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = AdminConsignmentCtrl.ePage.Masters.TabList.some(function(value) {
                if (!isNew) {
                    if(value.label === currentConsignment.entity.ConsignmentNumber)
                        return true
                    else
                        return false
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                AdminConsignmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!isNew) {
                    _currentConsignment = currentConsignment.entity;
                } else {
                    _currentConsignment = currentConsignment;
                }

                adminConsignmentConfig.GetTabDetails(_currentConsignment, isNew).then(function(response) {
                    AdminConsignmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function() {
                        AdminConsignmentCtrl.ePage.Masters.activeTabIndex = AdminConsignmentCtrl.ePage.Masters.TabList.length;
                        AdminConsignmentCtrl.ePage.Masters.CurrentActiveTab(currentConsignment.entity.ConsignmentNumber);
                        AdminConsignmentCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Consignment already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity;
                } else {
                    currentTab = currentTab;
                }
            }
            AdminConsignmentCtrl.ePage.Masters.currentConsignment = currentTab;
        }

        function RemoveTab(event, index, currentConsignment) {
            event.preventDefault();
            event.stopPropagation();
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            AdminConsignmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewConsignment() {
            var _isExist = AdminConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                AdminConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = true;
                helperService.getFullObjectUsingGetById(AdminConsignmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function(response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsConsignmentHeader,
                            data: response.data.Response
                        };
                        AdminConsignmentCtrl.ePage.Masters.AddTab(_obj, true);
                        AdminConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
                    } else {
                        console.log("Empty New Consignment response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }    
        Init();
    }
})();