(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackDeliveryLineController", TrackDeliveryLineController);

    TrackDeliveryLineController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "deliveryLineConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function TrackDeliveryLineController($location, APP_CONSTANT, authService, apiService, helperService, deliveryLineConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {

        var TrackDeliveryLineCtrl = this,
            location = $location;

        function Init() {
            TrackDeliveryLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": deliveryLineConfig.Entities
            };

            TrackDeliveryLineCtrl.ePage.Masters.dataentryName = "DeliveryLine";
            TrackDeliveryLineCtrl.ePage.Masters.TabList = [];
            deliveryLineConfig.TabList = [];
            TrackDeliveryLineCtrl.ePage.Masters.activeTabIndex = 0;
            TrackDeliveryLineCtrl.ePage.Masters.isNewClicked = false;
            TrackDeliveryLineCtrl.ePage.Masters.IsTabClick = false;
            TrackDeliveryLineCtrl.ePage.Masters.Config = deliveryLineConfig;

            //functions
            TrackDeliveryLineCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TrackDeliveryLineCtrl.ePage.Masters.AddTab = AddTab;
            TrackDeliveryLineCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackDeliveryLineCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackDeliveryLineCtrl.ePage.Masters.SaveandClose = SaveandClose;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TrackDeliveryLineCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentDelivery, isNew) {
            TrackDeliveryLineCtrl.ePage.Masters.currentDelivery = undefined;

            var _isExist = TrackDeliveryLineCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentDelivery.entity.DeliveryLineRefNo)
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
                TrackDeliveryLineCtrl.ePage.Masters.IsTabClick = true;
                var _currentDelivery = undefined;
                if (!isNew) {
                    _currentDelivery = currentDelivery.entity;
                } else {
                    _currentDelivery = currentDelivery;
                }

                deliveryLineConfig.GetTabDetails(_currentDelivery, isNew).then(function (response) {
                    TrackDeliveryLineCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TrackDeliveryLineCtrl.ePage.Masters.activeTabIndex = TrackDeliveryLineCtrl.ePage.Masters.TabList.length;
                        TrackDeliveryLineCtrl.ePage.Masters.CurrentActiveTab(currentDelivery.entity.DeliveryLineRefNo);
                        TrackDeliveryLineCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Delivery Line already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            TrackDeliveryLineCtrl.ePage.Masters.currentDelivery = currentTab;
        }


        function RemoveTab(event, index, currentDelivery) {
            event.preventDefault();
            event.stopPropagation();
            var currentDelivery = currentDelivery[currentDelivery.label].ePage.Entities;
            TrackDeliveryLineCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function SaveandClose(index, currentDelivery) {
            var currentDelivery = currentDelivery[currentDelivery.label].ePage.Entities;
            TrackDeliveryLineCtrl.ePage.Masters.TabList.splice(index - 1, 1);
            TrackDeliveryLineCtrl.ePage.Masters.Config.SaveAndClose = false;
            TrackDeliveryLineCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }

})();
