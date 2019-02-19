(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackDeliveryOrderListController", TrackDeliveryOrderListController);

    TrackDeliveryOrderListController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "one_order_listConfig", "toastr"];

    function TrackDeliveryOrderListController($timeout, $location, authService, apiService, helperService, one_order_listConfig, toastr) {
        var TrackDeliveryOrderListCtrl = this;

        function Init() {
            TrackDeliveryOrderListCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Order_General",
                "Masters": {
                    "RoleView": {
                        "roleApi": {},
                        "roleAccess": {},
                        "roleResponse": {}
                    }
                },
                "Meta": helperService.metaBase(),
                "Entities": one_order_listConfig.Entities
            };

            TrackDeliveryOrderListCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId,
                "roleCode": authService.getUserInfo().RoleCode,
                "accessCode": authService.getUserInfo().AccessCode
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            TrackDeliveryOrderListCtrl.ePage.Masters.dataentryName = "BPTrackDeliveryOrder";
            TrackDeliveryOrderListCtrl.ePage.Masters.defaultFilter = {
                "OrderType": "DOR"
            };
            TrackDeliveryOrderListCtrl.ePage.Entities.Header.Data = {};
            TrackDeliveryOrderListCtrl.ePage.Masters.TabList = [];
            TrackDeliveryOrderListCtrl.ePage.Masters.activeTabIndex = 0;
            TrackDeliveryOrderListCtrl.ePage.Masters.IsTabClick = false;
            TrackDeliveryOrderListCtrl.ePage.Masters.IsNewOrderClicked = true;
            TrackDeliveryOrderListCtrl.ePage.Masters.SaveButtonText = "Save";
            TrackDeliveryOrderListCtrl.ePage.Masters.IsDisableSave = false;
            // Remove all Tabs while load shipment
            one_order_listConfig.TabList = [];
            TrackDeliveryOrderListCtrl.ePage.Masters.Configdetails = one_order_listConfig;
            // role access
            switch (TrackDeliveryOrderListCtrl.ePage.Masters.UserProfile.roleCode) {
                default:
                    TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleApi = "Buyer";
                    TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleAccess = "1_1";
                    TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleResponse = "Buyer";
                    break;
            }

            InitOrderFunc();
        }

        function InitOrderFunc() {
            TrackDeliveryOrderListCtrl.ePage.Entities.AddTab = AddTab;
            TrackDeliveryOrderListCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackDeliveryOrderListCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackDeliveryOrderListCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TrackDeliveryOrderListCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            TrackDeliveryOrderListCtrl.ePage.Masters.ActionClose = ActionClose;
            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);
            if (_Entity) {
                if (!_isEmpty) {
                    TrackDeliveryOrderListCtrl.ePage.Masters.DashBoardObj = JSON.parse(helperService.decryptData(_Entity.item));
                    switch (TrackDeliveryOrderListCtrl.ePage.Masters.DashBoardObj.IsCreated) {
                        case "Track Orders":
                            TrackDeliveryOrderListCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                        default:
                            TrackDeliveryOrderListCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                    }
                }
            }
        }

        function CreateNewOrder() {
            var _isExist = TrackDeliveryOrderListCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                TrackDeliveryOrderListCtrl.ePage.Masters.IsNewOrderClicked = false;
                // role access call
                helperService.getFullObjectUsingGetById(one_order_listConfig.Entities.Header[TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleApi + "Order"].API[TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleAccess + "_listgetbyid"].Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response["UIOrder_" + TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleResponse].PAR_AccessCode = TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleAccess;
                        var _obj = {
                            entity: response.data.Response.Response["UIOrder_" + TrackDeliveryOrderListCtrl.ePage.Masters.RoleView.roleResponse],
                            data: response.data.Response.Response
                        };

                        TrackDeliveryOrderListCtrl.ePage.Entities.AddTab(_obj, true);
                        TrackDeliveryOrderListCtrl.ePage.Masters.IsNewOrderClicked = true;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function AddTab(currentOrder, IsNew) {
            TrackDeliveryOrderListCtrl.ePage.Masters.currentOrder = undefined;
            // TrackDeliveryOrderListCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentOrder.entity);
            var _isExist = TrackDeliveryOrderListCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TrackDeliveryOrderListCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;
                }

                one_order_listConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    var _entity = {};
                    TrackDeliveryOrderListCtrl.ePage.Masters.TabList = response;
                    if (TrackDeliveryOrderListCtrl.ePage.Masters.TabList.length > 0) {
                        TrackDeliveryOrderListCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentOrder.entity.OrderCumSplitNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        TrackDeliveryOrderListCtrl.ePage.Masters.activeTabIndex = TrackDeliveryOrderListCtrl.ePage.Masters.TabList.length;
                        TrackDeliveryOrderListCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo, _entity);
                        TrackDeliveryOrderListCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("Order Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentOrder) {
            event.preventDefault();
            event.stopPropagation();

            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;
            // Close Current Shipment
            if (!currentOrder.isNew) {
                apiService.get("eAxisAPI", one_order_listConfig.Entities.Header.BuyerOrder.API.activityclose.Url + _currentOrder.Header.Data.PK).then(function (response) {
                    if (response.data.Status === "Success") {
                        TrackDeliveryOrderListCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                TrackDeliveryOrderListCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label;
            } else {
                currentTab = currentTab;
            }
            TrackDeliveryOrderListCtrl.ePage.Masters.currentOrder = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                $item.data.entity.PAR_AccessCode = "1_1";
                ($item.data.entity.PAR_AccessCode) ? TrackDeliveryOrderListCtrl.ePage.Entities.AddTab($item.data, false): toastr.warning("This Order don't have a access code...");
            } else if ($item.action === "new") {
                var _check = CheckUIControl('CREATE_ORDER');
                (_check) ? CreateNewOrder(): toastr.warning("You don't have a access to create Order(s)..!");
            }
        }

        function ActionClose(type) {
            TrackDeliveryOrderListCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            TrackDeliveryOrderListCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Order Confirmation":
                    TrackDeliveryOrderListCtrl.ePage.Entities.GlobalVar.IsConformationEnable = false;
                    break;
                case "Cargo Readiness":
                    TrackDeliveryOrderListCtrl.ePage.Entities.GlobalVar.IsCargoRedinessEnable = false;
                    break;
                case "Shipment Pre-advice":
                    TrackDeliveryOrderListCtrl.ePage.Entities.GlobalVar.IsPreAdviceEnable = false;
                    break;
                case "Convert As Booking":
                    TrackDeliveryOrderListCtrl.ePage.Entities.GlobalVar.IsConvertAsBookingEnable = false;
                    break;
                case "Order Activation":
                    TrackDeliveryOrderListCtrl.ePage.Entities.GlobalVar.IsActiveOrderEnable = false;
                    break;
                default:
                    break;
            }
        }

        Init();
    }
})();