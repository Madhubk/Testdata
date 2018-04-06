(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackOrderLineController", TrackOrderLineController);

    TrackOrderLineController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "toastr", "orderLinesConfig"];

    function TrackOrderLineController($timeout, $location, authService, apiService, helperService, toastr, orderLinesConfig) {
        var TrackOrderLineCtrl = this;

        function Init() {
            TrackOrderLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_OrderLines",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderLinesConfig.Entities
            };

            TrackOrderLineCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitTrackOrderLine();
        }

        function InitTrackOrderLine() {
            TrackOrderLineCtrl.ePage.Masters.taskName = "PorOrderLine";
            TrackOrderLineCtrl.ePage.Masters.dataentryName = "PorOrderLine";
            TrackOrderLineCtrl.ePage.Masters.config = TrackOrderLineCtrl.ePage.Entities;
            TrackOrderLineCtrl.ePage.Masters.TabList = [];
            TrackOrderLineCtrl.ePage.Masters.activeTabIndex = 0;
            TrackOrderLineCtrl.ePage.Masters.IsTabClick = false;
            TrackOrderLineCtrl.ePage.Masters.IsNewShipmentClicked = false;
            
            TrackOrderLineCtrl.ePage.Masters.AddTab = AddTab;
            TrackOrderLineCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackOrderLineCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackOrderLineCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // routing for container
            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);
            if (_Entity) {
                if(!_isEmpty){
                    TrackOrderLineCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    AddTab(TrackOrderLineCtrl.ePage.Masters.Entity, false);
                }
            }
        }

        function AddTab(CurrentOrdLine, IsNew) {
            TrackOrderLineCtrl.ePage.Masters.CurrentOrdLine = undefined;

            var _isExist = TrackOrderLineCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === CurrentOrdLine.entity.OrderNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TrackOrderLineCtrl.ePage.Masters.IsTabClick = true;
                var _CurrentOrdLine = undefined;
                if (!IsNew) {
                    _CurrentOrdLine = CurrentOrdLine.entity;
                } else {
                    _CurrentOrdLine = CurrentOrdLine;

                }

                orderLinesConfig.GetTabDetails(_CurrentOrdLine, IsNew).then(function (response) {
                    TrackOrderLineCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TrackOrderLineCtrl.ePage.Masters.activeTabIndex = TrackOrderLineCtrl.ePage.Masters.TabList.length;
                        TrackOrderLineCtrl.ePage.Masters.CurrentActiveTab(CurrentOrdLine.entity.OrderNo);
                        TrackOrderLineCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("OrderLines Already Opened...!");
            }
        }

        function RemoveTab(event, index, CurrentOrdLine) {
            event.preventDefault();
            event.stopPropagation();
            var _CurrentOrdLine = CurrentOrdLine[CurrentOrdLine.label].ePage.Entities;

            // Close Current OrderLine
            apiService.get("eAxisAPI", TrackOrderLineCtrl.ePage.Entities.Header.API.OrderHeaderActivityClose.Url + _CurrentOrdLine.Header.Data.UIPorOrderLines.PK).then(function (response) {
                if (response.data.Response === "Success") {

                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            TrackOrderLineCtrl.ePage.Masters.TabList.splice(index, 1);
        }
        
        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            TrackOrderLineCtrl.ePage.Masters.CurrentOrdLine = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TrackOrderLineCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }
        
        Init();
    }
})();
