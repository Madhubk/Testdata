(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ItemController", ItemController);

    ItemController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "itemConfig", "$timeout", "toastr", "appConfig"];

    function ItemController($location, APP_CONSTANT, authService, apiService, helperService, itemConfig, $timeout, toastr, appConfig) {

        var ItemCtrl = this;

        function Init() {

            ItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": itemConfig.Entities
            };

            ItemCtrl.ePage.Masters.dataentryName = "TransportItem";
            ItemCtrl.ePage.Masters.TabList = [];
            ItemCtrl.ePage.Masters.activeTabIndex = 0;
            ItemCtrl.ePage.Masters.isNewItemClicked = false;
            ItemCtrl.ePage.Masters.IsTabClick = false;

            //functions
            ItemCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ItemCtrl.ePage.Masters.AddTab = AddTab;
            ItemCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ItemCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ItemCtrl.ePage.Masters.CreateNewItem = CreateNewItem;
            ItemCtrl.ePage.Masters.SaveandClose = SaveandClose;

            ItemCtrl.ePage.Masters.Config = itemConfig;

            // Remove all Tabs while load shipment
            itemConfig.TabList = [];

            itemConfig.ValidationFindall();
        }

        function SaveandClose(index, currentItem) {
            var currentItem = currentItem[currentItem.label].ePage.Entities;
            ItemCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", ItemCtrl.ePage.Entities.Header.API.SessionClose.Url + currentItem.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            ItemCtrl.ePage.Masters.Config.SaveAndClose = false;
            ItemCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                ItemCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewItem();
            }
        }

        function AddTab(currentItem, isNew) {
            ItemCtrl.ePage.Masters.currentItem = undefined;

            var _isExist = ItemCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentItem.entity.ItemCode)
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
                ItemCtrl.ePage.Masters.IsTabClick = true;
                var _currentItem = undefined;
                if (!isNew) {
                    _currentItem = currentItem.entity;
                } else {
                    _currentItem = currentItem;
                }

                itemConfig.GetTabDetails(_currentItem, isNew).then(function (response) {
                    ItemCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ItemCtrl.ePage.Masters.activeTabIndex = ItemCtrl.ePage.Masters.TabList.length;
                        ItemCtrl.ePage.Masters.CurrentActiveTab(currentItem.entity.ItemCode);
                        ItemCtrl.ePage.Masters.IsTabClick = false;
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
            ItemCtrl.ePage.Masters.currentItem = currentTab;
        }

        function RemoveTab(event, index, currentItem) {
            event.preventDefault();
            event.stopPropagation();
            var currentItem = currentItem[currentItem.label].ePage.Entities;
            ItemCtrl.ePage.Masters.TabList.splice(index, 1);

            // apiService.get("eAxisAPI", ItemCtrl.ePage.Entities.Header.API.SessionClose.Url + currentItem.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
        }

        function CreateNewItem() {
            var _isExist = ItemCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                ItemCtrl.ePage.Masters.isNewItemClicked = true;
                helperService.getFullObjectUsingGetById(ItemCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsItemHeader,
                            data: response.data.Response
                        };
                        ItemCtrl.ePage.Masters.AddTab(_obj, true);
                        ItemCtrl.ePage.Masters.isNewItemClicked = false;
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