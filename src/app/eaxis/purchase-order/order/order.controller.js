(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderController", OrderController);

    OrderController.$inject = ["$scope", "$state", "$timeout", "$location", "authService", "apiService", "appConfig", "helperService", "orderConfig", "toastr", "$uibModal"];

    function OrderController($scope, $state, $timeout, $location, authService, apiService, appConfig, helperService, orderConfig, toastr, $uibModal) {
        var OrderCtrl = this;

        function Init() {
            //var currentOrder = OrderCtrl.currentOrder[OrderCtrl.currentOrder.label].ePage.Entities;
            OrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
            };

            OrderCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            OrderCtrl.ePage.Masters.dataentryName = "OrderHeader";
            OrderCtrl.ePage.Masters.taskName = "OrderHeader";
            OrderCtrl.ePage.Masters.config = OrderCtrl.ePage.Entities;
            OrderCtrl.ePage.Entities.Header.Data = {};
            OrderCtrl.ePage.Masters.TabList = [];
            OrderCtrl.ePage.Masters.activeTabIndex = 0;
            OrderCtrl.ePage.Masters.IsTabClick = false;
            OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
            OrderCtrl.ePage.Masters.SaveButtonText = "Save";
            OrderCtrl.ePage.Masters.IsDisableSave = false;
            OrderCtrl.ePage.Masters.NotShowing = false;
            OrderCtrl.ePage.Masters.ShowButtons = false;

            InitOrderFunc();
        }

        function InitOrderFunc() {
            OrderCtrl.ePage.Entities.AddTab = AddTab;
            OrderCtrl.ePage.Masters.RemoveTab = RemoveTab;
            OrderCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OrderCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            OrderCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            OrderCtrl.ePage.Masters.Copy = Copy;
            OrderCtrl.ePage.Masters.Split = Split;
            OrderCtrl.ePage.Masters.BackToOrder = BackToOrder;
            OrderCtrl.ePage.Masters.Reload = Reload;
            OrderCtrl.ePage.Masters.Save = Save;

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    OrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    switch (OrderCtrl.ePage.Masters.Entity.IsCreated) {
                        case "New":
                            OrderCtrl.ePage.Masters.DefaultFilter = {};
                            CreateNewOrder();
                            break;
                        case "Cargo Ready Date":
                            OrderCtrl.ePage.Masters.DefaultFilter = OrderCtrl.ePage.Masters.Entity;
                            OrderCtrl.ePage.Masters.NotShowing = true;
                            OrderCtrl.ePage.Masters.ButtonValue = "Update Cargo Ready Date";
                            break;
                        case "Open Orders":
                            OrderCtrl.ePage.Masters.DefaultFilter = OrderCtrl.ePage.Masters.Entity;
                            break;
                        case "Track Orders":
                            OrderCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                        default:
                            OrderCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                    }
                }
            }
        }

        function Reload() {
            OrderCtrl.ePage.Masters.NotShowing = false;
        }

        function BackToOrder() {
            OrderCtrl.ePage.Masters.NotShowing = false;
        }

        function CreateNewOrder() {
            OrderCtrl.ePage.Masters.IsNewOrderClicked = true;
            helperService.getFullObjectUsingGetById(OrderCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIPorOrderHeader,
                        data: response.data.Response.Response
                    };

                    OrderCtrl.ePage.Entities.AddTab(_obj, true);
                    OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function AddTab(currentOrder, IsNew) {
            OrderCtrl.ePage.Masters.currentOrder = undefined;

            var _isExist = OrderCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                OrderCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;

                }

                orderConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    OrderCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        OrderCtrl.ePage.Masters.activeTabIndex = OrderCtrl.ePage.Masters.TabList.length;

                        OrderCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo);
                        OrderCtrl.ePage.Masters.IsTabClick = false;
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
                apiService.get("eAxisAPI", OrderCtrl.ePage.Entities.Header.API.OrderHeaderActivityClose.Url + _currentOrder.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                    if (response.data.Status === "Success") {
                        OrderCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                OrderCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            OrderCtrl.ePage.Masters.currentOrder = currentTab;
        }

        function Copy(currentOrder) {
            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;

            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.OrderCopy.Url + _currentOrder.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                OrderCtrl.ePage.Masters.IsNewOrderClicked = true;

                var _obj = {
                    entity: response.data.Response.UIPorOrderHeader,
                    data: response.data.Response
                };

                OrderCtrl.ePage.Entities.AddTab(_obj, true);
                OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
            });
        }

        function Split(currentOrder, indexOf) {
            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;

            OrderCtrl.ePage.Masters.IsNewOrderClicked = true;
            var _url = OrderCtrl.ePage.Entities.Header.API.CheckNextSplitOrderNumber.Url + encodeURIComponent(currentOrder.label);

            apiService.get("eAxisAPI", _url).then(function (response) {
                var _obj = {
                    entity: _currentOrder.Header.Data,
                    data: _currentOrder.Header.Data
                }

                if (_obj.entity.OrderNo.indexOf("-") !== -1) {
                    _obj.entity.OrderNo = _obj.entity.OrderNo.split("-")[0];

                } else {
                    _obj.entity.OrderNo = _obj.entity.OrderNo
                };

                _obj.entity.OrderNo = _obj.entity.OrderNo + "-" + _obj.entity.OrderNoSplit;
                _obj.entity.OrderNoSplit++;

                OrderCtrl.ePage.Entities.AddTab(_obj, true);
                OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
            });

        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OrderCtrl.ePage.Entities.AddTab($item.data, false);
            } else {
                CreateNewOrder();
            }
        }

        function Save($item) {
            if ($item.isNew) {
                if ($item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.map(function (val, key) {
                        val.POH_FK = $item[$item.label].ePage.Entities.Header.Data.PK
                    });
                }
                SaveOnly($item)
            } else {
                var tempArray = [];
                if ($item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.map(function (val, key) {
                        if (parseInt(val.Quantity) - parseInt(val.RecievedQuantity) > 0) {
                            tempArray.push(val);
                        }
                    });
                    if (tempArray.length == 0) {
                        SaveOnly($item)
                    } else {
                        ActionPopup($item)
                    }
                } else {
                    SaveOnly($item)
                }
            }
        }

        function SaveOnly($item) {
            OrderCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrderCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            // Push addresslist to jobaddress
            var _array = [];
            for (var i in _Data.Header.Data.UIAddressContactList) {
                if (i !== "CfxTypeList") {
                    _array.push(_Data.Header.Data.UIAddressContactList[i]);
                }
            }
            _Data.Header.Data.UIJobAddress = [];
            _array.map(function (value, key) {
                _Data.Header.Data.UIJobAddress.push(value);
            });

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }

            if ($item.isNew) {
                _input.UIPorOrderHeader.PK = _input.PK;
                _input.UICustomEntity.IsNewInsert = true;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Order').then(function (response) {
                if (response.Status === "success") {
                    orderConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == OrderCtrl.ePage.Masters.currentOrder) {
                                value.label = OrderCtrl.ePage.Masters.currentOrder;
                                value[OrderCtrl.ePage.Masters.currentOrder] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = orderConfig.TabList.map(function (value, key) {
                        return value.label
                    }).indexOf(OrderCtrl.ePage.Masters.currentOrder);

                    if (_index !== -1) {
                        orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        response.Data.UIJobAddress.map(function (val, key) {
                            orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        orderConfig.TabList[_index].isNew = false;
                        // Refresh grid
                        if ($state.current.url == "/order") {
                            helperService.refreshGrid();
                        }
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
                OrderCtrl.ePage.Masters.SaveButtonText = "Save";
                OrderCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function ActionPopup($item) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "action-modal",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/purchase-order/order/order-menu/action-modal/action-modal.html",
                controller: 'ActionModalController',
                controllerAs: "ActionModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    SaveOnly(response);
                },
                function (response) {}
            );
        }

        Init();
    }
})();