(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackOrderListController", TrackOrderListController);

    TrackOrderListController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "one_order_listConfig", "toastr", "appConfig", "errorWarningService"];

    function TrackOrderListController($timeout, $location, authService, apiService, helperService, one_order_listConfig, toastr, appConfig, errorWarningService) {
        var TrackOrderListCtrl = this;

        function Init() {
            TrackOrderListCtrl.ePage = {
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

            TrackOrderListCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId,
                "roleCode": authService.getUserInfo().RoleCode,
                "accessCode": authService.getUserInfo().AccessCode
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            TrackOrderListCtrl.ePage.Masters.dataentryName = "BPTrackOrder";
            TrackOrderListCtrl.ePage.Masters.defaultFilter = {
                "OrderType": "POR"
            };
            TrackOrderListCtrl.ePage.Entities.Header.Data = {};
            TrackOrderListCtrl.ePage.Masters.TabList = [];
            TrackOrderListCtrl.ePage.Masters.activeTabIndex = 0;
            TrackOrderListCtrl.ePage.Masters.IsTabClick = false;
            TrackOrderListCtrl.ePage.Masters.IsNewOrderClicked = true;
            TrackOrderListCtrl.ePage.Masters.SaveButtonText = "Save";
            TrackOrderListCtrl.ePage.Masters.IsDisableSave = false;
            // Remove all Tabs while load shipment
            one_order_listConfig.TabList = [];
            TrackOrderListCtrl.ePage.Masters.Configdetails = one_order_listConfig;
            // error warning service
            TrackOrderListCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // role access
            switch (TrackOrderListCtrl.ePage.Masters.UserProfile.roleCode) {
                default:
                    TrackOrderListCtrl.ePage.Masters.RoleView.roleApi = "Buyer";
                    TrackOrderListCtrl.ePage.Masters.RoleView.roleAccess = "1_1";
                    TrackOrderListCtrl.ePage.Masters.RoleView.roleResponse = "Buyer";
                    break;
            }

            InitOrderFunc();
        }

        function InitOrderFunc() {
            TrackOrderListCtrl.ePage.Entities.AddTab = AddTab;
            TrackOrderListCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackOrderListCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackOrderListCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TrackOrderListCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            TrackOrderListCtrl.ePage.Masters.ActionClose = ActionClose;
            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);
            if (_Entity) {
                if (!_isEmpty) {
                    TrackOrderListCtrl.ePage.Masters.DashBoardObj = JSON.parse(helperService.decryptData(_Entity.item));
                    switch (TrackOrderListCtrl.ePage.Masters.DashBoardObj.IsCreated) {
                        case "Track Orders":
                            TrackOrderListCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                        default:
                            TrackOrderListCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                    }
                }
            }
        }

        function CreateNewOrder() {
            var _isExist = TrackOrderListCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                TrackOrderListCtrl.ePage.Masters.IsNewOrderClicked = false;
                // role access call
                helperService.getFullObjectUsingGetById(one_order_listConfig.Entities.Header[TrackOrderListCtrl.ePage.Masters.RoleView.roleApi + "Order"].API[TrackOrderListCtrl.ePage.Masters.RoleView.roleAccess + "_listgetbyid"].Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response["UIOrder_" + TrackOrderListCtrl.ePage.Masters.RoleView.roleResponse].PAR_AccessCode = TrackOrderListCtrl.ePage.Masters.RoleView.roleAccess;
                        var _obj = {
                            entity: response.data.Response.Response["UIOrder_" + TrackOrderListCtrl.ePage.Masters.RoleView.roleResponse],
                            data: response.data.Response.Response
                        };

                        TrackOrderListCtrl.ePage.Entities.AddTab(_obj, true);
                        TrackOrderListCtrl.ePage.Masters.IsNewOrderClicked = true;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function AddTab(currentOrder, IsNew) {
            TrackOrderListCtrl.ePage.Masters.currentOrder = undefined;
            // TrackOrderListCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentOrder.entity);
            var _isExist = TrackOrderListCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TrackOrderListCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;
                }

                one_order_listConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    var _entity = {};
                    TrackOrderListCtrl.ePage.Masters.TabList = response;
                    if (TrackOrderListCtrl.ePage.Masters.TabList.length > 0) {
                        TrackOrderListCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentOrder.entity.OrderCumSplitNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        TrackOrderListCtrl.ePage.Masters.activeTabIndex = TrackOrderListCtrl.ePage.Masters.TabList.length;
                        TrackOrderListCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo, _entity);
                        TrackOrderListCtrl.ePage.Masters.IsTabClick = false;
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
                        TrackOrderListCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                TrackOrderListCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label;
            } else {
                currentTab = currentTab;
            }
            TrackOrderListCtrl.ePage.Masters.currentOrder = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                $item.data.entity.PAR_AccessCode = "1_1";
                ($item.data.entity.PAR_AccessCode) ? TrackOrderListCtrl.ePage.Entities.AddTab($item.data, false): toastr.warning("This Order don't have a access code...");
            } else if ($item.action === "new") {
                var _check = CheckUIControl('CREATE_ORDER');
                (_check) ? CreateNewOrder(): toastr.warning("You don't have a access to create Order(s)..!");
            }
        }

        function ActionClose(type) {
            TrackOrderListCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            TrackOrderListCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Order Confirmation":
                    TrackOrderListCtrl.ePage.Entities.GlobalVar.IsConformationEnable = false;
                    break;
                case "Cargo Readiness":
                    TrackOrderListCtrl.ePage.Entities.GlobalVar.IsCargoRedinessEnable = false;
                    break;
                case "Shipment Pre-advice":
                    TrackOrderListCtrl.ePage.Entities.GlobalVar.IsPreAdviceEnable = false;
                    break;
                case "Convert As Booking":
                    TrackOrderListCtrl.ePage.Entities.GlobalVar.IsConvertAsBookingEnable = false;
                    break;
                case "Order Activation":
                    TrackOrderListCtrl.ePage.Entities.GlobalVar.IsActiveOrderEnable = false;
                    break;
                default:
                    break;
            }
        }

        Init();
    }
})();