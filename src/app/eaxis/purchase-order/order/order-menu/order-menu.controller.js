(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderMenuController", OrderMenuController);

    OrderMenuController.$inject = ["$scope", "$rootScope", "$state", "orderConfig", "appConfig", "helperService", "toastr", "confirmation"];

    function OrderMenuController($scope, $rootScope, $state, orderConfig, appConfig, helperService, toastr, confirmation) {
        var OrderMenuCtrl = this;

        function Init() {
            var currentOrder = OrderMenuCtrl.currentOrder[OrderMenuCtrl.currentOrder.label].ePage.Entities;
            OrderMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderMenu();
        }
        function InitOrderMenu() {
            
            OrderMenuCtrl.ePage.Masters.OrderMenu = {};
            // Menu list from configuration
            OrderMenuCtrl.ePage.Masters.OrderMenu.ListSource = OrderMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            
            OrderMenuCtrl.ePage.Masters.Save = Save;
            OrderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            OrderMenuCtrl.ePage.Masters.IsDisableSave = false;
            OrderMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            $rootScope.OnAddressEdit = OnAddressEdit;
            $rootScope.OnAddressEditBack = OnAddressEditBack;
        }
        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEditNavType(selectedItem, addressType, type);
            OrderMenuCtrl.ePage.Masters.TabIndex = 8;
        }

        function OnAddressEditBack(selectedItem, addressType, type) {
            OrderMenuCtrl.ePage.Masters.TabIndex = 0;
        }

        function TabSelected(tab, $index, $event) {
            var _index = orderConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(OrderMenuCtrl.currentOrder[OrderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (orderConfig.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'Yes',
                            headerText: 'Save before tab change..',
                            bodyText: 'Do you want to save?'
                        };
                        confirmation.showModal({}, modalOptions).then(function (result) {
                            OrderMenuCtrl.ePage.Masters.Save(OrderMenuCtrl.currentOrder);
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
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
            OrderMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrderMenuCtrl.ePage.Masters.IsDisableSave = true;

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
                            if (value.code == OrderMenuCtrl.currentOrder.code) {
                                value.label = OrderMenuCtrl.currentOrder.code;
                                value[OrderMenuCtrl.currentOrder.code] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = orderConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(OrderMenuCtrl.currentOrder[OrderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        response.Data.UIJobAddress.map(function (val, key) {
                            orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        orderConfig.TabList[_index].isNew = false;
                        // refresh grid
                        if ($state.current.url == "/order") {
                            helperService.refreshGrid();
                        }
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
                OrderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                OrderMenuCtrl.ePage.Masters.IsDisableSave = false;
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
                function (response) {
                }
            );
        }

        Init();
    }
})();