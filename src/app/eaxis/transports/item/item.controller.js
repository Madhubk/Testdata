(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdminItemController", AdminItemController);

    AdminItemController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "adminItemConfig", "$timeout", "toastr", "appConfig"];

    function AdminItemController($location, APP_CONSTANT, authService, apiService, helperService, adminItemConfig, $timeout, toastr, appConfig) {

        var AdminItemCtrl = this;

        function Init() {

            AdminItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": adminItemConfig.Entities
            };

            AdminItemCtrl.ePage.Masters.dataentryName = "Item";
            AdminItemCtrl.ePage.Masters.TabList = [];
            AdminItemCtrl.ePage.Masters.activeTabIndex = 0;
            AdminItemCtrl.ePage.Masters.isNewItemClicked = false;
            AdminItemCtrl.ePage.Masters.IsTabClick = false;

            //functions
            AdminItemCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AdminItemCtrl.ePage.Masters.AddTab = AddTab;
            AdminItemCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            AdminItemCtrl.ePage.Masters.RemoveTab = RemoveTab;
            AdminItemCtrl.ePage.Masters.CreateNewItem = CreateNewItem;
            AdminItemCtrl.ePage.Masters.SaveandClose = SaveandClose;

            AdminItemCtrl.ePage.Masters.Config = adminItemConfig;

            // Remove all Tabs while load shipment
            adminItemConfig.TabList = [];

            adminItemConfig.ValidationFindall();
        }

        function SaveandClose(index, currentItem) {
            var currentItem = currentItem[currentItem.label].ePage.Entities;
            AdminItemCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", AdminItemCtrl.ePage.Entities.Header.API.SessionClose.Url + currentItem.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            AdminItemCtrl.ePage.Masters.Config.SaveAndClose = false;
            AdminItemCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                AdminItemCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewItem();
            }
        }

        function AddTab(currentItem, isNew) {
            AdminItemCtrl.ePage.Masters.currentItem = undefined;
            var _isExist = AdminItemCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentItem.entity.ItemCode)
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
                AdminItemCtrl.ePage.Masters.IsTabClick = true;
                var _currentItem = undefined;
                if (!isNew) {
                    _currentItem = currentItem.entity;
                } else {
                    _currentItem = currentItem;
                }

                adminItemConfig.GetTabDetails(_currentItem, isNew).then(function (response) {
                    AdminItemCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        AdminItemCtrl.ePage.Masters.activeTabIndex = AdminItemCtrl.ePage.Masters.TabList.length;
                        AdminItemCtrl.ePage.Masters.CurrentActiveTab(currentItem.entity.ItemCode);
                        AdminItemCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Item already opened ');
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
            AdminItemCtrl.ePage.Masters.currentItem = currentTab;
        }

        function RemoveTab(event, index, currentItem) {
            event.preventDefault();
            event.stopPropagation();
            var currentItem = currentItem[currentItem.label].ePage.Entities;
            AdminItemCtrl.ePage.Masters.TabList.splice(index, 1);

            // apiService.get("eAxisAPI", AdminItemCtrl.ePage.Entities.Header.API.SessionClose.Url + currentItem.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
        }

        function CreateNewItem() {
            var _isExist = AdminItemCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                AdminItemCtrl.ePage.Masters.isNewItemClicked = true;
                helperService.getFullObjectUsingGetById(AdminItemCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsItemHeader,
                            data: response.data.Response
                        };
                        AdminItemCtrl.ePage.Masters.AddTab(_obj, true);
                        AdminItemCtrl.ePage.Masters.isNewItemClicked = false;
                    } else {
                        console.log("Empty New Item response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }
        Init();
    }
})();