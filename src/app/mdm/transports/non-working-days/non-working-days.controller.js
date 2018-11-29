(function () {
    "use strict";

    angular
        .module("Application")
        .controller("NonWorkingDaysController", NonWorkingDaysController);

    NonWorkingDaysController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "nonWorkingDaysConfig", "$timeout", "toastr", "appConfig"];

    function NonWorkingDaysController($location, APP_CONSTANT, authService, apiService, helperService, nonWorkingDaysConfig, $timeout, toastr, appConfig) {

        var NWDaysCtrl = this;

        function Init() {

            NWDaysCtrl.ePage = {
                "Title": "",
                "Prefix": "Non_Working_Days",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": nonWorkingDaysConfig.Entities
            };

            NWDaysCtrl.ePage.Masters.dataentryName = "NonWorkingDays";
            NWDaysCtrl.ePage.Masters.TabList = [];
            NWDaysCtrl.ePage.Masters.activeTabIndex = 0;
            NWDaysCtrl.ePage.Masters.isNewNWDaysClicked = false;
            NWDaysCtrl.ePage.Masters.IsTabClick = false;
            NWDaysCtrl.ePage.Masters.Config = nonWorkingDaysConfig;

            // Remove all Tabs while load shipment
            nonWorkingDaysConfig.TabList = [];

            //functions
            NWDaysCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            NWDaysCtrl.ePage.Masters.AddTab = AddTab;
            NWDaysCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            NWDaysCtrl.ePage.Masters.RemoveTab = RemoveTab;
            NWDaysCtrl.ePage.Masters.CreateNewNWDays = CreateNewNWDays;
            NWDaysCtrl.ePage.Masters.SaveandClose = SaveandClose;

            nonWorkingDaysConfig.ValidationFindall();
        }

        function SaveandClose(index, currentNWDays) {
            var currentNWDays = currentNWDays[currentNWDays.label].ePage.Entities;
            NWDaysCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", NWDaysCtrl.ePage.Entities.Header.API.SessionClose.Url + currentNWDays.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            NWDaysCtrl.ePage.Masters.Config.SaveAndClose = false;
            NWDaysCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                NWDaysCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewNWDays();
            }
        }

        function AddTab(currentNWDays, isNew) {
            NWDaysCtrl.ePage.Masters.currentNWDays = undefined;

            var _isExist = NWDaysCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentNWDays.entity.Title;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                NWDaysCtrl.ePage.Masters.IsTabClick = true;
                var _currentNWDays = undefined;
                if (!isNew) {
                    _currentNWDays = currentNWDays.entity;
                } else {
                    _currentNWDays = currentNWDays;
                }

                nonWorkingDaysConfig.GetTabDetails(_currentNWDays, isNew).then(function (response) {
                    NWDaysCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        NWDaysCtrl.ePage.Masters.activeTabIndex = NWDaysCtrl.ePage.Masters.TabList.length;
                        NWDaysCtrl.ePage.Masters.CurrentActiveTab(currentNWDays.entity.Title);
                        NWDaysCtrl.ePage.Masters.IsTabClick = false;
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
            NWDaysCtrl.ePage.Masters.currentNWDays = currentTab;
        }

        function RemoveTab(event, index, currentNWDays) {
            event.preventDefault();
            event.stopPropagation();
            var currentNWDays = currentNWDays[currentNWDays.label].ePage.Entities;
            NWDaysCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewNWDays() {
            NWDaysCtrl.ePage.Masters.isNewNWDaysClicked = true;

            helperService.getFullObjectUsingGetById(NWDaysCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response,
                        data: response.data.Response
                    };
                    NWDaysCtrl.ePage.Masters.AddTab(_obj, true);
                    NWDaysCtrl.ePage.Masters.isNewNWDaysClicked = false;
                } else {
                    console.log("Empty New response");
                }
            });
        }

        Init();
    }
})();