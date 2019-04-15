(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackdamagedSKUController", TrackdamagedSKUController);

    TrackdamagedSKUController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "trackDamageSkuConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function TrackdamagedSKUController($location, APP_CONSTANT, authService, apiService, helperService, trackDamageSkuConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {

        var TrackdamagedSKUCtrl = this,
            location = $location;

        function Init() {
            TrackdamagedSKUCtrl.ePage = {
                "Title": "",
                "Prefix": "PickUp_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": trackDamageSkuConfig.Entities
            };

            TrackdamagedSKUCtrl.ePage.Masters.dataentryName = "TrackDamagedSKU";
            TrackdamagedSKUCtrl.ePage.Masters.TabList = [];
            trackDamageSkuConfig.TabList = [];
            TrackdamagedSKUCtrl.ePage.Masters.activeTabIndex = 0;
            TrackdamagedSKUCtrl.ePage.Masters.isNewClicked = false;
            TrackdamagedSKUCtrl.ePage.Masters.IsTabClick = false;
            TrackdamagedSKUCtrl.ePage.Masters.Config = trackDamageSkuConfig;

            //functions
            TrackdamagedSKUCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TrackdamagedSKUCtrl.ePage.Masters.AddTab = AddTab;
            TrackdamagedSKUCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackdamagedSKUCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackdamagedSKUCtrl.ePage.Masters.SaveandClose = SaveandClose;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TrackdamagedSKUCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentTrackDamage, isNew) {
            TrackdamagedSKUCtrl.ePage.Masters.currentTrackDamage = undefined;

            var _isExist = TrackdamagedSKUCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentTrackDamage.entity.PickupLineRefNo)
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
                TrackdamagedSKUCtrl.ePage.Masters.IsTabClick = true;
                var _currentTrackDamage = undefined;
                if (!isNew) {
                    _currentTrackDamage = currentTrackDamage.entity;
                } else {
                    _currentTrackDamage = currentTrackDamage;
                }

                trackDamageSkuConfig.GetTabDetails(_currentTrackDamage, isNew).then(function (response) {
                    TrackdamagedSKUCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TrackdamagedSKUCtrl.ePage.Masters.activeTabIndex = TrackdamagedSKUCtrl.ePage.Masters.TabList.length;
                        TrackdamagedSKUCtrl.ePage.Masters.CurrentActiveTab(currentTrackDamage.entity.PickupLineRefNo);
                        TrackdamagedSKUCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('PickUp Line already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            TrackdamagedSKUCtrl.ePage.Masters.currentTrackDamage = currentTab;
        }


        function RemoveTab(event, index, currentTrackDamage) {
            event.preventDefault();
            event.stopPropagation();
            var currentTrackDamage = currentTrackDamage[currentTrackDamage.label].ePage.Entities;
            TrackdamagedSKUCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function SaveandClose(index, currentTrackDamage) {
            var currentTrackDamage = currentTrackDamage[currentTrackDamage.label].ePage.Entities;
            TrackdamagedSKUCtrl.ePage.Masters.TabList.splice(index - 1, 1);
            TrackdamagedSKUCtrl.ePage.Masters.Config.SaveAndClose = false;
            TrackdamagedSKUCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }

})();
