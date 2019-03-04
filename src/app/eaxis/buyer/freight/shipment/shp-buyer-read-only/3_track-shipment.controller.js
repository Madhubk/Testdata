(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_TrackShipmentController", three_TrackShipmentController);

    three_TrackShipmentController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "three_TrackshipmentConfig", "toastr", "freightApiConfig"];

    function three_TrackShipmentController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, three_TrackshipmentConfig, toastr, freightApiConfig) {
        /* jshint validthis: true */
        var three_TrackShipmentCtrl = this;
        var location = $location;

        function Init() {
            three_TrackShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_TrackshipmentConfig.Entities
            };

            // For list directive
            three_TrackShipmentCtrl.ePage.Masters.taskName = "Shipment_BUYER_EXPORT_CS";
            three_TrackShipmentCtrl.ePage.Masters.dataentryName = "Shipment_BUYER_EXPORT_CS";
            three_TrackShipmentCtrl.ePage.Masters.taskHeader = "";
            // three_TrackShipmentCtrl.ePage.Masters.DefaultFilter = {
            //     "IsBooking": "false"
            // };

            // Remove all Tabs while load shipment
            three_TrackshipmentConfig.TabList = [];

            three_TrackShipmentCtrl.ePage.Masters.TabList = [];
            three_TrackShipmentCtrl.ePage.Masters.activeTabIndex = 0;
            three_TrackShipmentCtrl.ePage.Masters.IsTabClick = false;

            // Functions
            three_TrackShipmentCtrl.ePage.Entities.AddTab = AddTab;
            three_TrackShipmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            three_TrackShipmentCtrl.ePage.Masters.RemoveAllTab = RemoveAllTab;
            three_TrackShipmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            three_TrackShipmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;


        }



        function AddTab(currentShipment, isNew) {
            three_TrackShipmentCtrl.ePage.Masters.currentShipment = undefined;

            var _isExist = three_TrackShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentShipment.entity.ShipmentNo)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New") {
                        return true;
                    } else
                        return false;
                }
            });

            if (!_isExist) {
                three_TrackShipmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentShipment = undefined;
                if (!isNew) {
                    _currentShipment = currentShipment.entity;
                } else {
                    _currentShipment = currentShipment;
                }

                three_TrackshipmentConfig.GetTabDetails(_currentShipment, isNew).then(function (response) {
                    var _entity = {};
                    three_TrackShipmentCtrl.ePage.Masters.TabList = response;

                    if (three_TrackShipmentCtrl.ePage.Masters.TabList.length > 0) {
                        three_TrackShipmentCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentShipment.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        three_TrackShipmentCtrl.ePage.Masters.activeTabIndex = three_TrackShipmentCtrl.ePage.Masters.TabList.length;
                        three_TrackShipmentCtrl.ePage.Masters.CurrentActiveTab(currentShipment.entity.ShipmentNo, _entity);
                        three_TrackShipmentCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentShipment) {
            event.preventDefault();
            event.stopPropagation();
            var _currentShipment = currentShipment[currentShipment.label].ePage.Entities;

            // Close Current Shipment
            apiService.get("eAxisAPI", freightApiConfig.Entities["1_3"].API.activityclose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // three_TrackShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            three_TrackShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function RemoveAllTab() {
            event.preventDefault();
            event.stopPropagation();
            three_TrackShipmentCtrl.ePage.Masters.TabList.map(function (value, key) {
                var _currentShipment = value[value.label].ePage.Entities;
                console.log(_currentShipment);
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_3"].API.activityclose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                    if (response.data.Status == "Success") {
                        three_TrackShipmentCtrl.ePage.Masters.TabList.shift();
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            });
            three_TrackShipmentCtrl.ePage.Masters.activeTabIndex = three_TrackShipmentCtrl.ePage.Masters.TabList.length;
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            three_TrackShipmentCtrl.ePage.Masters.currentShipment = currentTab;

        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                three_TrackShipmentCtrl.ePage.Entities.AddTab($item.data, false);
            }
        }
        Init();
    }
})();