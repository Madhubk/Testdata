(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackContainerController", TrackContainerController);

    TrackContainerController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "toastr", "trackContainerConfig"];

    function TrackContainerController($timeout, $location, authService, apiService, helperService, toastr, trackContainerConfig) {
        var TrackContainerCtrl = this;

        function Init() {
            TrackContainerCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Containers",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": trackContainerConfig.Entities
            };

            TrackContainerCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitTrackContainer();
        }

        function InitTrackContainer() {
            TrackContainerCtrl.ePage.Masters.dataentryName = "TrackContainer";
            TrackContainerCtrl.ePage.Masters.taskName = "TrackContainer";
            TrackContainerCtrl.ePage.Masters.config = TrackContainerCtrl.ePage.Entities;
            TrackContainerCtrl.ePage.Masters.TabList = [];
            TrackContainerCtrl.ePage.Masters.activeTabIndex = 0;
            TrackContainerCtrl.ePage.Masters.IsTabClick = false;
            TrackContainerCtrl.ePage.Masters.IsNewShipmentClicked = false;
            TrackContainerCtrl.ePage.Masters.AddTab = AddTab;
            TrackContainerCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackContainerCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackContainerCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            trackContainerConfig.TabList = [];

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    TrackContainerCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    AddTab(TrackContainerCtrl.ePage.Masters.Entity, false);
                }
            }
        }

        function AddTab(currentContainer, isNew) {
            TrackContainerCtrl.ePage.Masters.currentContainer = undefined;

            var _isExist = TrackContainerCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentContainer.entity.ContainerNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TrackContainerCtrl.ePage.Masters.IsTabClick = true;
                var _currentContainer = undefined;
                if (!isNew) {
                    _currentContainer = currentContainer.entity;
                } else {
                    _currentContainer = currentContainer;
                }

                trackContainerConfig.GetTabDetails(_currentContainer, isNew).then(function (response) {
                    TrackContainerCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TrackContainerCtrl.ePage.Masters.activeTabIndex = TrackContainerCtrl.ePage.Masters.TabList.length;
                        TrackContainerCtrl.ePage.Masters.CurrentActiveTab(currentContainer.entity.ContainerNo);
                        TrackContainerCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Shipment Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentContainer) {
            event.preventDefault();
            event.stopPropagation();
            var _currentContainer = currentContainer[currentContainer.label].ePage.Entities;

            // Close Current Shipment
            apiService.get("eAxisAPI", TrackContainerCtrl.ePage.Entities.Header.API.ContainerActivityClose.Url + _currentContainer.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    TrackContainerCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            TrackContainerCtrl.ePage.Masters.currentContainer = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TrackContainerCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        Init();
    }
})();