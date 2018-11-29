(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ZoneController", ZoneController);

    ZoneController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "zoneConfig", "$timeout", "toastr", "appConfig"];

    function ZoneController($location, APP_CONSTANT, authService, apiService, helperService, zoneConfig, $timeout, toastr, appConfig) {

        var ZoneCtrl = this;

        function Init() {

            ZoneCtrl.ePage = {
                "Title": "",
                "Prefix": "Zone",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": zoneConfig.Entities
            };

            ZoneCtrl.ePage.Masters.dataentryName = "OrgZone";
            ZoneCtrl.ePage.Masters.TabList = [];
            ZoneCtrl.ePage.Masters.activeTabIndex = 0;
            ZoneCtrl.ePage.Masters.isNewZoneClicked = false;
            ZoneCtrl.ePage.Masters.IsTabClick = false;
            ZoneCtrl.ePage.Masters.Config = zoneConfig;

            // Remove all Tabs while load shipment
            zoneConfig.TabList = [];

            //functions
            ZoneCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ZoneCtrl.ePage.Masters.AddTab = AddTab;
            ZoneCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ZoneCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ZoneCtrl.ePage.Masters.CreateNewZone = CreateNewZone;
            ZoneCtrl.ePage.Masters.SaveandClose = SaveandClose;

            zoneConfig.ValidationFindall();
        }

        function SaveandClose(index, currentZone) {
            var currentZone = currentZone[currentZone.label].ePage.Entities;
            ZoneCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", ZoneCtrl.ePage.Entities.Header.API.SessionClose.Url + currentZone.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            ZoneCtrl.ePage.Masters.Config.SaveAndClose = false;
            ZoneCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ZoneCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewZone();
            }
        }

        function AddTab(currentZone, isNew) {
            ZoneCtrl.ePage.Masters.currentZone = undefined;

            var _isExist = ZoneCtrl.ePage.Masters.TabList.some(function (value) {
                // if (!isNew) {
                //     return value.label === currentZone.entity.Title;
                // } else {
                //     return false;
                // }
                 if (!isNew) {
                    if (value[value.label].ePage.Entities.Header.Data.PK === currentZone.entity.PK)
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
                ZoneCtrl.ePage.Masters.IsTabClick = true;
                var _currentZone = undefined;
                if (!isNew) {
                    _currentZone = currentZone.entity;
                } else {
                    _currentZone = currentZone;
                }

                zoneConfig.GetTabDetails(_currentZone, isNew).then(function (response) {
                    ZoneCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ZoneCtrl.ePage.Masters.activeTabIndex = ZoneCtrl.ePage.Masters.TabList.length;
                        ZoneCtrl.ePage.Masters.CurrentActiveTab(currentZone.entity.Title);
                        ZoneCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Zone already opened ');
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
            ZoneCtrl.ePage.Masters.currentZone = currentTab;
        }

        function RemoveTab(event, index, currentZone) {
            event.preventDefault();
            event.stopPropagation();
            var currentZone = currentZone[currentZone.label].ePage.Entities;
            ZoneCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewZone() {
            ZoneCtrl.ePage.Masters.isNewZoneClicked = true;

            helperService.getFullObjectUsingGetById(ZoneCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response,
                        data: response.data.Response
                    };
                    ZoneCtrl.ePage.Masters.AddTab(_obj, true);
                    ZoneCtrl.ePage.Masters.isNewZoneClicked = false;
                } else {
                    console.log("Empty New Zone response");
                }
            });
        }

        Init();
    }
})();