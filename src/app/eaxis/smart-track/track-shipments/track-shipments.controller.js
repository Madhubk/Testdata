(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackShipmentController", TrackShipmentController);

    TrackShipmentController.$inject = ["$timeout", "$location", "apiService", "helperService", "appConfig", "shipmentConfig", "toastr"];

    function TrackShipmentController($timeout, $location, apiService, helperService, appConfig, shipmentConfig, toastr) {
        /* jshint validthis: true */
        var TrackShipmentCtrl = this;

        function Init() {
            TrackShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Shipments",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": shipmentConfig.Entities
            };

            InitTrackShipment();
        }

        function InitTrackShipment() {
            // For list directive
            TrackShipmentCtrl.ePage.Masters.taskName = "TrackShipments";
            TrackShipmentCtrl.ePage.Masters.dataentryName = "TrackShipments";
            TrackShipmentCtrl.ePage.Masters.config = TrackShipmentCtrl.ePage.Entities;

            TrackShipmentCtrl.ePage.Masters.TabList = [];
            TrackShipmentCtrl.ePage.Masters.activeTabIndex = 0;
            TrackShipmentCtrl.ePage.Masters.IsTabClick = false;
            TrackShipmentCtrl.ePage.Masters.IsNewShipmentClicked = false;
            TrackShipmentCtrl.ePage.Masters.AddTab = AddTab;
            TrackShipmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackShipmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackShipmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    TrackShipmentCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    AddTab(TrackShipmentCtrl.ePage.Masters.Entity, false);
                }
            }
        }

        function AddTab(currentShipment, isNew) {
            TrackShipmentCtrl.ePage.Masters.currentShipment = undefined;

            var _isExist = TrackShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentShipment.entity.ShipmentNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TrackShipmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentShipment = undefined;
                if (!isNew) {
                    _currentShipment = currentShipment.entity;
                } else {
                    _currentShipment = currentShipment;
                }

                shipmentConfig.GetTabDetails(_currentShipment, isNew).then(function (response) {
                    TrackShipmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TrackShipmentCtrl.ePage.Masters.activeTabIndex = TrackShipmentCtrl.ePage.Masters.TabList.length;
                        TrackShipmentCtrl.ePage.Masters.CurrentActiveTab(currentShipment.entity.ShipmentNo);
                        TrackShipmentCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Shipment Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentShipment) {
            event.preventDefault();
            event.stopPropagation();
            var _currentShipment = currentShipment[currentShipment.label].ePage.Entities;
            // Close Current Shipment
            apiService.get("eAxisAPI", TrackShipmentCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // TrackShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            TrackShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            TrackShipmentCtrl.ePage.Masters.currentShipment = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TrackShipmentCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        Init();
    }
})();
