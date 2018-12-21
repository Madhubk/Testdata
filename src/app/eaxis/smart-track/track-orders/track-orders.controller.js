(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackOrderController", TrackOrderController);

    TrackOrderController.$inject = ["$timeout", "authService", "apiService", "helperService", "one_order_listConfig", "toastr", "appConfig", "errorWarningService"];

    function TrackOrderController($timeout, authService, apiService, helperService, one_order_listConfig, toastr, appConfig, errorWarningService) {
        var TrackOrderCtrl = this;

        function Init() {
            TrackOrderCtrl.ePage = {
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

            TrackOrderCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId,
                "roleCode": authService.getUserInfo().RoleCode,
                "accessCode": authService.getUserInfo().AccessCode
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            TrackOrderCtrl.ePage.Masters.dataentryName = "TrackOrder";
            TrackOrderCtrl.ePage.Entities.Header.Data = {};
            TrackOrderCtrl.ePage.Masters.TabList = [];
            TrackOrderCtrl.ePage.Masters.activeTabIndex = 0;
            TrackOrderCtrl.ePage.Masters.IsTabClick = false;
            TrackOrderCtrl.ePage.Masters.IsNewOrderClicked = true;
            TrackOrderCtrl.ePage.Masters.SaveButtonText = "Save";
            TrackOrderCtrl.ePage.Masters.IsDisableSave = false;
            // Remove all Tabs while load shipment
            one_order_listConfig.TabList = [];
            TrackOrderCtrl.ePage.Masters.Configdetails = one_order_listConfig;
            // error warning service
            TrackOrderCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // role access
            switch (TrackOrderCtrl.ePage.Masters.UserProfile.roleCode) {
                default:
                    TrackOrderCtrl.ePage.Masters.RoleView.roleApi = "Buyer";
                    TrackOrderCtrl.ePage.Masters.RoleView.roleAccess = "1_1";
                    TrackOrderCtrl.ePage.Masters.RoleView.roleResponse = "Buyer";
                    break;
            }

            InitOrderFunc();
        }

        function InitOrderFunc() {
            TrackOrderCtrl.ePage.Entities.AddTab = AddTab;
            TrackOrderCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TrackOrderCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TrackOrderCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TrackOrderCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            TrackOrderCtrl.ePage.Masters.ActionClose = ActionClose;
        }

        function CreateNewOrder() {
            var _isExist = TrackOrderCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                TrackOrderCtrl.ePage.Masters.IsNewOrderClicked = false;
                // role access call
                helperService.getFullObjectUsingGetById(one_order_listConfig.Entities.Header[TrackOrderCtrl.ePage.Masters.RoleView.roleApi + "Order"].API[TrackOrderCtrl.ePage.Masters.RoleView.roleAccess + "_listgetbyid"].Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response["UIOrder_" + TrackOrderCtrl.ePage.Masters.RoleView.roleResponse].PAR_AccessCode = TrackOrderCtrl.ePage.Masters.RoleView.roleAccess;
                        var _obj = {
                            entity: response.data.Response.Response["UIOrder_" + TrackOrderCtrl.ePage.Masters.RoleView.roleResponse],
                            data: response.data.Response.Response
                        };

                        TrackOrderCtrl.ePage.Entities.AddTab(_obj, true);
                        TrackOrderCtrl.ePage.Masters.IsNewOrderClicked = true;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function AddTab(currentOrder, IsNew) {
            TrackOrderCtrl.ePage.Masters.currentOrder = undefined;
            // TrackOrderCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentOrder.entity);
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

                one_order_listConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    var _entity = {};
                    TrackOrderCtrl.ePage.Masters.TabList = response;
                    if (TrackOrderCtrl.ePage.Masters.TabList.length > 0) {
                        TrackOrderCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentOrder.entity.OrderCumSplitNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        TrackOrderCtrl.ePage.Masters.activeTabIndex = TrackOrderCtrl.ePage.Masters.TabList.length;
                        TrackOrderCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo, _entity);
                        TrackOrderCtrl.ePage.Masters.IsTabClick = false;
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
                        TrackOrderCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                TrackOrderCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label;
            } else {
                currentTab = currentTab;
            }
            TrackOrderCtrl.ePage.Masters.currentOrder = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                $item.data.entity.PAR_AccessCode = "1_1";
                ($item.data.entity.PAR_AccessCode) ? TrackOrderCtrl.ePage.Entities.AddTab($item.data, false): toastr.warning("This Order don't have a access code...");
            } else if ($item.action === "new") {
                var _check = CheckUIControl('CREATE_ORDER');
                (_check) ? CreateNewOrder(): toastr.warning("You don't have a access to create Order(s)..!");
            }
        }

        function ActionClose(type) {
            TrackOrderCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            TrackOrderCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Order Confirmation":
                    TrackOrderCtrl.ePage.Entities.GlobalVar.IsConformationEnable = false;
                    break;
                case "Cargo Readiness":
                    TrackOrderCtrl.ePage.Entities.GlobalVar.IsCargoRedinessEnable = false;
                    break;
                case "Shipment Pre-advice":
                    TrackOrderCtrl.ePage.Entities.GlobalVar.IsPreAdviceEnable = false;
                    break;
                case "Convert As Booking":
                    TrackOrderCtrl.ePage.Entities.GlobalVar.IsConvertAsBookingEnable = false;
                    break;
                case "Order Activation":
                    TrackOrderCtrl.ePage.Entities.GlobalVar.IsActiveOrderEnable = false;
                    break;
                default:
                    break;
            }
        }

        Init();
    }
})();