(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackShipmentDetailsController", TrackShipmentDetailsController);

    TrackShipmentDetailsController.$inject = ["$timeout", "$location", "apiService", "helperService", "appConfig", "shipmentConfig", "toastr"];

    function TrackShipmentDetailsController($timeout, $location, apiService, helperService, appConfig, shipmentConfig, toastr) {
        /* jshint validthis: true */
        var TrackShipmentDetailsCtrl = this;

        function Init() {
            TrackShipmentDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Shipments_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": shipmentConfig.Entities
            };

            InitTrackShipment();
        }

        function InitTrackShipment() {
            // For list directive
            TrackShipmentDetailsCtrl.ePage.Masters.taskName = "TrackShipments";
            TrackShipmentDetailsCtrl.ePage.Masters.dataentryName = "TrackShipments";
            TrackShipmentDetailsCtrl.ePage.Masters.config = TrackShipmentDetailsCtrl.ePage.Entities;

            TrackShipmentDetailsCtrl.ePage.Masters.TabList = [];
            TrackShipmentDetailsCtrl.ePage.Masters.activeTabIndex = 0;
            TrackShipmentDetailsCtrl.ePage.Masters.IsTabClick = false;
            TrackShipmentDetailsCtrl.ePage.Masters.IsNewShipmentClicked = false;
            TrackShipmentDetailsCtrl.ePage.Masters.AddTab = AddTab;
            TrackShipmentDetailsCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackShipmentDetailsCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackShipmentDetailsCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            shipmentConfig.TabList = [];

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    TrackShipmentDetailsCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    (TrackShipmentDetailsCtrl.ePage.Masters.Entity.IsCreated != "Track Shipments") ? AddTab(TrackShipmentDetailsCtrl.ePage.Masters.Entity, false): false;
                }
            }
        }

        function AddTab(currentShipment, isNew) {
            TrackShipmentDetailsCtrl.ePage.Masters.currentShipment = undefined;

            var _isExist = TrackShipmentDetailsCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentShipment.entity.ShipmentNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TrackShipmentDetailsCtrl.ePage.Masters.IsTabClick = true;
                var _currentShipment = undefined;
                if (!isNew) {
                    _currentShipment = currentShipment.entity;
                } else {
                    _currentShipment = currentShipment;
                }

                shipmentConfig.GetTabDetails(_currentShipment, isNew).then(function (response) {
                    TrackShipmentDetailsCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TrackShipmentDetailsCtrl.ePage.Masters.activeTabIndex = TrackShipmentDetailsCtrl.ePage.Masters.TabList.length;
                        TrackShipmentDetailsCtrl.ePage.Masters.CurrentActiveTab(currentShipment.entity.ShipmentNo);
                        TrackShipmentDetailsCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", TrackShipmentDetailsCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // TrackShipmentDetailsCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            TrackShipmentDetailsCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            TrackShipmentDetailsCtrl.ePage.Masters.currentShipment = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TrackShipmentDetailsCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        Init();
    }
})();