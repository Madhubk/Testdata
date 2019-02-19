(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVPOOrderController", SRVPOOrderController);

    SRVPOOrderController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "one_order_listConfig", "toastr", "appConfig", "errorWarningService"];

    function SRVPOOrderController($timeout, $location, authService, apiService, helperService, one_order_listConfig, toastr, appConfig, errorWarningService) {
        var SRVPOOrderCtrl = this,
            _queryString = $location.search();
        // Entity = $location.path().split("/").pop();

        function Init() {
            SRVPOOrderCtrl.ePage = {
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

            SRVPOOrderCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId,
                "roleCode": authService.getUserInfo().RoleCode
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            SRVPOOrderCtrl.ePage.Masters.dataentryName = "BPOrderHeaderBuyer";
            SRVPOOrderCtrl.ePage.Entities.Header.Data = {};
            SRVPOOrderCtrl.ePage.Masters.TabList = [];
            SRVPOOrderCtrl.ePage.Masters.activeTabIndex = 0;
            SRVPOOrderCtrl.ePage.Masters.IsTabClick = false;
            SRVPOOrderCtrl.ePage.Masters.IsNewOrderClicked = true;
            SRVPOOrderCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVPOOrderCtrl.ePage.Masters.IsDisableSave = false;
            // Remove all Tabs while load shipment
            one_order_listConfig.TabList = [];
            SRVPOOrderCtrl.ePage.Masters.Configdetails = one_order_listConfig;
            // error warning service
            SRVPOOrderCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // role access
            switch (SRVPOOrderCtrl.ePage.Masters.UserProfile.roleCode) {
                default:
                    SRVPOOrderCtrl.ePage.Masters.RoleView.roleApi = "BuyerForwarder";
                    SRVPOOrderCtrl.ePage.Masters.RoleView.roleAccess = "1_3";
                    SRVPOOrderCtrl.ePage.Masters.RoleView.roleResponse = "Buyer_Forwarder";
                    break;
            }
            InitOrderFunc();
        }

        function InitOrderFunc() {
            SRVPOOrderCtrl.ePage.Entities.AddTab = AddTab;
            SRVPOOrderCtrl.ePage.Masters.RemoveTab = RemoveTab;
            SRVPOOrderCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            SRVPOOrderCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            SRVPOOrderCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            SRVPOOrderCtrl.ePage.Masters.ActionClose = ActionClose;
            SRVPOOrderCtrl.ePage.Masters.CheckUIControl = CheckUIControl;
            // freight dashboard
            GetUIControlList();

            try {
                if (_queryString.q) {
                    SRVPOOrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_queryString.q));
                    (SRVPOOrderCtrl.ePage.Masters.Entity) ? CreateNewOrder(): false;
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        function GetUIControlList() {
            SRVPOOrderCtrl.ePage.Masters.UIControlList = undefined;
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
                    SRVPOOrderCtrl.ePage.Masters.UIControlList = _controlList;
                } else {
                    SRVPOOrderCtrl.ePage.Masters.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(SRVPOOrderCtrl.ePage.Masters.UIControlList, controlId);
        }

        function CreateNewOrder() {
            var _isExist = SRVPOOrderCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                SRVPOOrderCtrl.ePage.Masters.IsNewOrderClicked = false;
                // role access call
                helperService.getFullObjectUsingGetById(one_order_listConfig.Entities.Header[SRVPOOrderCtrl.ePage.Masters.RoleView.roleApi + "Order"].API[SRVPOOrderCtrl.ePage.Masters.RoleView.roleAccess + "_listgetbyid"].Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response["UIOrder_" + SRVPOOrderCtrl.ePage.Masters.RoleView.roleResponse].PAR_AccessCode = SRVPOOrderCtrl.ePage.Masters.RoleView.roleAccess;
                        var _obj = {
                            entity: response.data.Response.Response["UIOrder_" + SRVPOOrderCtrl.ePage.Masters.RoleView.roleResponse],
                            data: response.data.Response.Response
                        };
                        _obj.data.UIOrder_Buyer_Forwarder.OrderType = SRVPOOrderCtrl.ePage.Masters.Entity.OrderType;
                        _obj.data.UIOrder_Buyer_Forwarder.BatchUploadNo = SRVPOOrderCtrl.ePage.Masters.Entity.BatchUploadNo;
                        _obj.data.UIOrder_Buyer_Forwarder.POB_FK = SRVPOOrderCtrl.ePage.Masters.Entity.PK;
                        SRVPOOrderCtrl.ePage.Entities.AddTab(_obj, true);
                        SRVPOOrderCtrl.ePage.Masters.IsNewOrderClicked = true;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function AddTab(currentOrder, IsNew) {
            SRVPOOrderCtrl.ePage.Masters.currentOrder = undefined;
            // SRVPOOrderCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentOrder.entity);
            var _isExist = SRVPOOrderCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVPOOrderCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;
                }

                one_order_listConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    var _entity = {};
                    SRVPOOrderCtrl.ePage.Masters.TabList = response;
                    if (SRVPOOrderCtrl.ePage.Masters.TabList.length > 0) {
                        SRVPOOrderCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentOrder.entity.OrderCumSplitNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        SRVPOOrderCtrl.ePage.Masters.activeTabIndex = SRVPOOrderCtrl.ePage.Masters.TabList.length;
                        SRVPOOrderCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo, _entity);
                        SRVPOOrderCtrl.ePage.Masters.IsTabClick = false;
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
                        SRVPOOrderCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                SRVPOOrderCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label;
            } else {
                currentTab = currentTab;
            }
            SRVPOOrderCtrl.ePage.Masters.currentOrder = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ($item.data.entity.PAR_AccessCode) ? SRVPOOrderCtrl.ePage.Entities.AddTab($item.data, false): toastr.warning("This Order don't have a access code...");
            } else if ($item.action === "new") {
                CreateNewOrder();
            }
        }

        function ActionClose(type) {
            SRVPOOrderCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            SRVPOOrderCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Order Confirmation":
                    SRVPOOrderCtrl.ePage.Entities.GlobalVar.IsConformationEnable = false;
                    break;
                case "Cargo Readiness":
                    SRVPOOrderCtrl.ePage.Entities.GlobalVar.IsCargoRedinessEnable = false;
                    break;
                case "Shipment Pre-advice":
                    SRVPOOrderCtrl.ePage.Entities.GlobalVar.IsPreAdviceEnable = false;
                    break;
                case "Convert As Booking":
                    SRVPOOrderCtrl.ePage.Entities.GlobalVar.IsConvertAsBookingEnable = false;
                    break;
                case "Order Activation":
                    SRVPOOrderCtrl.ePage.Entities.GlobalVar.IsActiveOrderEnable = false;
                    break;
                default:
                    break;
            }
        }

        Init();
    }
})();