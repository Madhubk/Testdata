(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackOrderController", TrackOrderController);

    TrackOrderController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "toastr", "orderConfig"];

    function TrackOrderController($timeout, $location, authService, apiService, helperService, toastr, orderConfig) {
        var TrackOrderCtrl = this;

        function Init() {
            TrackOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Orders",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
            };

            TrackOrderCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitTrackOrder();            
        }

        function InitTrackOrder() {
            TrackOrderCtrl.ePage.Masters.dataentryName = "TrackOrder";
            TrackOrderCtrl.ePage.Masters.taskName = "TrackOrder";
            TrackOrderCtrl.ePage.Masters.config = TrackOrderCtrl.ePage.Entities;
            TrackOrderCtrl.ePage.Masters.TabList = [];
            TrackOrderCtrl.ePage.Masters.activeTabIndex = 0;
            TrackOrderCtrl.ePage.Masters.IsTabClick = false;
            TrackOrderCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackOrderCtrl.ePage.Entities.AddTab = AddTab;
            TrackOrderCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackOrderCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);
            if(_Entity){
                if (!_isEmpty) {
                    TrackOrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    AddTab(TrackOrderCtrl.ePage.Masters.Entity, false);
                }
            }
        }

        function RemoveTab(event, index, currentOrder) {
            event.preventDefault();
            event.stopPropagation();

            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;
            // Close Current Shipment
            if (!currentOrder.isNew) {
                apiService.get("eAxisAPI", TrackOrderCtrl.ePage.Entities.Header.API.OrderHeaderActivityClose.Url + _currentOrder.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                    if (response.data.Status === "Success") {
                        TrackOrderCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                TrackOrderCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            TrackOrderCtrl.ePage.Masters.currentOrder = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TrackOrderCtrl.ePage.Entities.AddTab($item.data, false);
            }
        }
        
        function AddTab(currentOrder, IsNew) {
            TrackOrderCtrl.ePage.Masters.currentOrder = undefined;

            var _isExist = TrackOrderCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TrackOrderCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;

                }

                orderConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    TrackOrderCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TrackOrderCtrl.ePage.Masters.activeTabIndex = TrackOrderCtrl.ePage.Masters.TabList.length;
                        
                        TrackOrderCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo);
                        TrackOrderCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("Order Already Opened...!");
            }
        }
        
        Init();
    }
})();
