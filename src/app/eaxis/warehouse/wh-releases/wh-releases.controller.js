(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleaseController", ReleaseController);

    ReleaseController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "releaseConfig", "toastr"];

    function ReleaseController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, appConfig, helperService, releaseConfig, toastr) {
        /* jshint validthis: true */
        var ReleaseCtrl = this;

        function Init() {
            ReleaseCtrl.ePage = {
                "Title": "",
                "Prefix": "Release",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": releaseConfig.Entities
            };

            ReleaseCtrl.ePage.Masters.dataentryName = "WarehouseRelease";
            ReleaseCtrl.ePage.Masters.taskName = "WarehouseRelease";
            ReleaseCtrl.ePage.Masters.TabList = [];
            releaseConfig.TabList = [];
            ReleaseCtrl.ePage.Masters.activeTabIndex = 0;
            ReleaseCtrl.ePage.Masters.isNewClicked = false;
            ReleaseCtrl.ePage.Masters.IsTabClick = false;


            //functions
            ReleaseCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ReleaseCtrl.ePage.Masters.AddTab = AddTab;
            ReleaseCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ReleaseCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ReleaseCtrl.ePage.Masters.SaveandClose = SaveandClose;

            ReleaseCtrl.ePage.Masters.Config = releaseConfig;


            releaseConfig.ValidationFindall();
        }

        function SaveandClose(index, currentRelease) {
            var currentRelease = currentRelease[currentRelease.label].ePage.Entities;
            ReleaseCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            apiService.get("eAxisAPI", ReleaseCtrl.ePage.Entities.Header.API.SessionClose.Url + currentRelease.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            ReleaseCtrl.ePage.Masters.Config.SaveAndClose = false;
            ReleaseCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ReleaseCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentRelease, isNew) {
            ReleaseCtrl.ePage.Masters.currentRelease = undefined;

            var _isExist = ReleaseCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentRelease.entity.PickNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                ReleaseCtrl.ePage.Masters.IsTabClick = true;
                var _currentRelease = undefined;
                if (!isNew) {
                    _currentRelease = currentRelease.entity;
                } else {
                    _currentRelease = currentRelease;
                }

                releaseConfig.GetTabDetails(_currentRelease, isNew).then(function (response) {
                    ReleaseCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ReleaseCtrl.ePage.Masters.activeTabIndex = ReleaseCtrl.ePage.Masters.TabList.length;
                        ReleaseCtrl.ePage.Masters.CurrentActiveTab(currentRelease.entity.PickNo);
                        ReleaseCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Pick already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            ReleaseCtrl.ePage.Masters.currentRelease = currentTab;
        }

        function RemoveTab(event, index, currentRelease) {
            event.preventDefault();
            event.stopPropagation();
            var currentRelease = currentRelease[currentRelease.label].ePage.Entities;
            ReleaseCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", ReleaseCtrl.ePage.Entities.Header.API.SessionClose.Url + currentRelease.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }


        Init();
    }
})();
