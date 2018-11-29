(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RegionController", RegionController);

    RegionController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "regionConfig", "$timeout", "toastr", "appConfig"];

    function RegionController($location, APP_CONSTANT, authService, apiService, helperService, regionConfig, $timeout, toastr, appConfig) {

        var RegionCtrl = this;

        function Init() {

            RegionCtrl.ePage = {
                "Title": "",
                "Prefix": "Region",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": regionConfig.Entities
            };

            RegionCtrl.ePage.Masters.dataentryName = "Region";
            RegionCtrl.ePage.Masters.TabList = [];
            RegionCtrl.ePage.Masters.activeTabIndex = 0;
            RegionCtrl.ePage.Masters.isNewRegionClicked = false;
            RegionCtrl.ePage.Masters.IsTabClick = false;
            RegionCtrl.ePage.Masters.Config = regionConfig;

            // Remove all Tabs while load shipment
            regionConfig.TabList = [];

            //functions
            RegionCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            RegionCtrl.ePage.Masters.AddTab = AddTab;
            RegionCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            RegionCtrl.ePage.Masters.RemoveTab = RemoveTab;
            RegionCtrl.ePage.Masters.CreateNewRegion = CreateNewRegion;
            RegionCtrl.ePage.Masters.SaveandClose = SaveandClose;

            regionConfig.ValidationFindall();
        }

        function SaveandClose(index, currentRegion) {
            var currentRegion = currentRegion[currentRegion.label].ePage.Entities;
            RegionCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", RegionCtrl.ePage.Entities.Header.API.SessionClose.Url + currentRegion.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            RegionCtrl.ePage.Masters.Config.SaveAndClose = false;
            RegionCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                RegionCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewRegion();
            }
        }

        function AddTab(currentRegion, isNew) {
            RegionCtrl.ePage.Masters.currentRegion = undefined;

            var _isExist = RegionCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentRegion.entity.Title;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                RegionCtrl.ePage.Masters.IsTabClick = true;
                var _currentRegion = undefined;
                if (!isNew) {
                    _currentRegion = currentRegion.entity;
                } else {
                    _currentRegion = currentRegion;
                }

                regionConfig.GetTabDetails(_currentRegion, isNew).then(function (response) {
                    RegionCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        RegionCtrl.ePage.Masters.activeTabIndex = RegionCtrl.ePage.Masters.TabList.length;
                        RegionCtrl.ePage.Masters.CurrentActiveTab(currentRegion.entity.Title);
                        RegionCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('This record already opened ');
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
            RegionCtrl.ePage.Masters.currentRegion = currentTab;
        }

        function RemoveTab(event, index, currentRegion) {
            event.preventDefault();
            event.stopPropagation();
            var currentRegion = currentRegion[currentRegion.label].ePage.Entities;
            RegionCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewRegion() {
            RegionCtrl.ePage.Masters.isNewRegionClicked = true;

            helperService.getFullObjectUsingGetById(RegionCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response,
                        data: response.data.Response
                    };
                    RegionCtrl.ePage.Masters.AddTab(_obj, true);
                    RegionCtrl.ePage.Masters.isNewRegionClicked = false;
                } else {
                    console.log("Empty New response");
                }
            });
        }

        Init();
    }
})();