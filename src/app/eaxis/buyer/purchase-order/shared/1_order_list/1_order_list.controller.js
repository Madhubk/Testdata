(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_order_listController", one_order_listController);

    one_order_listController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "one_order_listConfig", "toastr", "appConfig", "errorWarningService"];

    function one_order_listController($timeout, $location, authService, apiService, helperService, one_order_listConfig, toastr, appConfig, errorWarningService) {
        var one_order_listCtrl = this;

        function Init() {
            one_order_listCtrl.ePage = {
                "Title": "",
                "Prefix": "Buyer_Order_General",
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

            one_order_listCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId,
                "roleCode": authService.getUserInfo().RoleCode
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            one_order_listCtrl.ePage.Masters.dataentryName = "OrderHeaderBuyer";
            one_order_listCtrl.ePage.Entities.Header.Data = {};
            one_order_listCtrl.ePage.Masters.TabList = [];
            one_order_listCtrl.ePage.Masters.activeTabIndex = 0;
            one_order_listCtrl.ePage.Masters.IsTabClick = false;
            one_order_listCtrl.ePage.Masters.IsNewOrderClicked = true;
            one_order_listCtrl.ePage.Masters.SaveButtonText = "Save";
            one_order_listCtrl.ePage.Masters.IsDisableSave = false;
            // Remove all Tabs while load shipment
            one_order_listConfig.TabList = [];
            one_order_listCtrl.ePage.Masters.Configdetails = one_order_listConfig;
            // error warning service
            one_order_listCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // role access
            switch (one_order_listCtrl.ePage.Masters.UserProfile.roleCode) {
                case "BUYER_SHIPMENT_COORDINATOR":
                    one_order_listCtrl.ePage.Masters.RoleView.roleApi = "Buyer";
                    one_order_listCtrl.ePage.Masters.RoleView.roleAccess = "1_1";
                    one_order_listCtrl.ePage.Masters.RoleView.roleResponse = "Buyer";
                    break;
                case "BUYER_SUPPLIER_SHIPMENT_COORDINATOR":
                    one_order_listCtrl.ePage.Masters.RoleView.roleApi = "BuyerSupplier";
                    one_order_listCtrl.ePage.Masters.RoleView.roleAccess = "1_2";
                    one_order_listCtrl.ePage.Masters.RoleView.roleResponse = "Buyer_Supplier";
                    break;
                case "BUYER_EXPORT_CS":
                    one_order_listCtrl.ePage.Masters.RoleView.roleApi = "BuyerForwarder";
                    one_order_listCtrl.ePage.Masters.RoleView.roleAccess = "1_3";
                    one_order_listCtrl.ePage.Masters.RoleView.roleResponse = "Buyer_Forwarder";
                    break;
                default:
                    one_order_listCtrl.ePage.Masters.RoleView.roleApi = "BuyerForwarder";
                    one_order_listCtrl.ePage.Masters.RoleView.roleAccess = "1_3";
                    one_order_listCtrl.ePage.Masters.RoleView.roleResponse = "Buyer_Forwarder";
                    break;
            }

            InitOrderFunc();
        }

        function InitOrderFunc() {
            one_order_listCtrl.ePage.Entities.AddTab = AddTab;
            one_order_listCtrl.ePage.Masters.RemoveTab = RemoveTab;
            one_order_listCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            one_order_listCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            one_order_listCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            one_order_listCtrl.ePage.Masters.ActionClose = ActionClose;
            one_order_listCtrl.ePage.Masters.CheckUIControl = CheckUIControl;
            // freight dashboard
            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    one_order_listCtrl.ePage.Masters.DashBoardObj = JSON.parse(helperService.decryptData(_Entity.item));
                    switch (one_order_listCtrl.ePage.Masters.DashBoardObj.IsCreated) {
                        case "New":
                            one_order_listCtrl.ePage.Masters.DefaultFilter = {};
                            CreateNewOrder();
                            break;
                        case "Cargo Ready Date":
                            one_order_listCtrl.ePage.Masters.DefaultFilter = one_order_listCtrl.ePage.Masters.DashBoardObj;
                            break;
                        case "Open Orders":
                            one_order_listCtrl.ePage.Masters.DefaultFilter = one_order_listCtrl.ePage.Masters.DashBoardObj;
                            break;
                        case "Track Orders":
                            one_order_listCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                        default:
                            one_order_listCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                    }
                }
            }
            GetUIControlList();
        }

        function GetUIControlList() {
            one_order_listCtrl.ePage.Masters.UIControlList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "USR_FK": authService.getUserInfo().UserPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CompUserRoleAccess.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.CompUserRoleAccess.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _controlList = [];
                    if (_response.length > 0) {
                        _response.map(function (value, key) {
                            if (value.SOP_Code) {
                                _controlList.push(value.SOP_Code);
                            }
                        });
                    }
                    one_order_listCtrl.ePage.Masters.UIControlList = _controlList;
                } else {
                    one_order_listCtrl.ePage.Masters.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(one_order_listCtrl.ePage.Masters.UIControlList, controlId);
        }

        function CreateNewOrder() {
            var _isExist = one_order_listCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                one_order_listCtrl.ePage.Masters.IsNewOrderClicked = false;
                // role access call
                helperService.getFullObjectUsingGetById(one_order_listConfig.Entities.Header[one_order_listCtrl.ePage.Masters.RoleView.roleApi + "Order"].API[one_order_listCtrl.ePage.Masters.RoleView.roleAccess + "_listgetbyid"].Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response["UIOrder_" + one_order_listCtrl.ePage.Masters.RoleView.roleResponse].PAR_AccessCode = one_order_listCtrl.ePage.Masters.RoleView.roleAccess;
                        var _obj = {
                            entity: response.data.Response.Response["UIOrder_" + one_order_listCtrl.ePage.Masters.RoleView.roleResponse],
                            data: response.data.Response.Response
                        };

                        one_order_listCtrl.ePage.Entities.AddTab(_obj, true);
                        one_order_listCtrl.ePage.Masters.IsNewOrderClicked = true;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function AddTab(currentOrder, IsNew) {
            one_order_listCtrl.ePage.Masters.currentOrder = undefined;
            // one_order_listCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentOrder.entity);
            var _isExist = one_order_listCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                one_order_listCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;
                }

                one_order_listConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    var _entity = {};
                    one_order_listCtrl.ePage.Masters.TabList = response;
                    if (one_order_listCtrl.ePage.Masters.TabList.length > 0) {
                        one_order_listCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentOrder.entity.OrderCumSplitNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        one_order_listCtrl.ePage.Masters.activeTabIndex = one_order_listCtrl.ePage.Masters.TabList.length;
                        one_order_listCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo, _entity);
                        one_order_listCtrl.ePage.Masters.IsTabClick = false;
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
                        one_order_listCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                one_order_listCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label;
            } else {
                currentTab = currentTab;
            }
            one_order_listCtrl.ePage.Masters.currentOrder = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ($item.data.entity.PAR_AccessCode) ? one_order_listCtrl.ePage.Entities.AddTab($item.data, false): toastr.warning("This Order don't have a access code...");
            } else if ($item.action === "new") {
                var _check = CheckUIControl('CREATE_ORDER');
                (_check) ? CreateNewOrder(): toastr.warning("You don't have a access to create Order(s)..!");
            }
        }

        function ActionClose(type) {
            one_order_listCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            one_order_listCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Order Confirmation":
                    one_order_listCtrl.ePage.Entities.GlobalVar.IsConformationEnable = false;
                    break;
                case "Cargo Readiness":
                    one_order_listCtrl.ePage.Entities.GlobalVar.IsCargoRedinessEnable = false;
                    break;
                case "Shipment Pre-advice":
                    one_order_listCtrl.ePage.Entities.GlobalVar.IsPreAdviceEnable = false;
                    break;
                case "Convert As Booking":
                    one_order_listCtrl.ePage.Entities.GlobalVar.IsConvertAsBookingEnable = false;
                    break;
                case "Order Activation":
                    one_order_listCtrl.ePage.Entities.GlobalVar.IsActiveOrderEnable = false;
                    break;
                default:
                    break;
            }
        }

        Init();
    }
})();