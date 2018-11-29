(function () {
    "use strict";

    angular
        .module("Application")
        .controller("orderActionController", OrderActionController);

    OrderActionController.$inject = ["$scope", "$injector", "$uibModal", "$state", "apiService", "helperService", "appConfig", "confirmation", "toastr"];

    function OrderActionController($scope, $injector, $uibModal, $state, apiService, helperService, appConfig, confirmation, toastr) {
        /* jshint validthis: true */
        var OrderActionCtrl = this;

        function Init() {
            var curObject = OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities;
            OrderActionCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": curObject
            };
            if (OrderActionCtrl.input) {
                InitEvent();
            }
        }

        function InitEvent() {
            OrderActionCtrl.ePage.Masters.Action = {};
            OrderActionCtrl.ePage.Masters.Action.ActionMenuClick = ActionMenuClick;
            // order action
            OrderActionCtrl.ePage.Masters.State = $state;
            if (OrderActionCtrl.ePage.Masters.State.current.url == "/po-order/:taskNo" || OrderActionCtrl.ePage.Masters.State.current.url == "/order" || OrderActionCtrl.ePage.Masters.State.current.url == "/order/:orderId") {
                OrderActionCtrl.ePage.Masters.ConfigName = $injector.get('orderConfig');
            } else {
                OrderActionCtrl.ePage.Masters.ConfigName = $injector.get('poBatchUploadConfig');
            }
            // OrderActionCtrl.ePage.Masters.ConfigName = $injector.get('orderConfig');
            OrderActionCtrl.ePage.Masters.ConfigName.CopyOrder = CopyOrder;
            OrderActionCtrl.ePage.Masters.ConfigName.CancelOrder = CancelOrder;
            OrderActionCtrl.ePage.Masters.ConfigName.MakeIsActiveOrder = MakeIsActiveOrder;
            OrderActionCtrl.ePage.Masters.ConfigName.SplitOrder = SplitOrder;
        }

        $scope.$watch('OrderActionCtrl.input', function (oldValue, NewValue) {
            if (!OrderActionCtrl.input.isNew) {
                if (!OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIPorOrderHeader) {
                    if (OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities.Header.Data.IsValid) {
                        OrderActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        OrderActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                } else {
                    if (OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIPorOrderHeader.IsValid) {
                        OrderActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        OrderActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                }
            }
        });

        function ActionMenuClick(type) {
            if (OrderActionCtrl.ePage.Masters.State.current.url == "/order" || OrderActionCtrl.ePage.Masters.State.current.url == "/po-order/:taskNo" || OrderActionCtrl.ePage.Masters.State.current.url == "/order/:orderId") {
                var configObj = $injector.get('orderConfig');
            } else {
                var configObj = $injector.get('poBatchUploadConfig');
            }
            // var configObj = $injector.get('orderConfig');
            if (type == 'copy') {
                configObj.CopyOrder(OrderActionCtrl.input, 'UIPorOrderHeader', configObj);
            } else if (type == 'cancel') {
                configObj.CancelOrder(OrderActionCtrl.input, 'UIPorOrderHeader', configObj);
            } else if (type == 'active') {
                if (OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK && OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK != '00000000-0000-0000-0000-000000000000' && !OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIShipmentHeader.IsBooking) {
                    toastr.warning("Order already attached with " + OrderActionCtrl.input[OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIPorOrderHeader.ShipmentNo);
                } else {
                    configObj.MakeIsActiveOrder(OrderActionCtrl.input, 'UIPorOrderHeader', configObj);
                }
            } else if (type == 'split') {
                configObj.SplitOrder(OrderActionCtrl.input, 'UIPorOrderHeader', configObj);
            }
        }

        function CopyOrder(_obj, keyObject, _config) {
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Order Copy?',
                bodyText: 'Would you like to copy this order? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.OrderCopy.Url + _obj[_obj.label].ePage.Entities.Header.Data.PK).then(function (response) {
                        var __obj = {
                            entity: response.data.Response[keyObject],
                            data: response.data.Response
                        };

                        // OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                        if (OrderActionCtrl.ePage.Masters.State.current.url == "/order" || OrderActionCtrl.ePage.Masters.State.current.url == "/po-order/:taskNo") {
                            OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                        } else {
                            OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true, true, 'OrderNo');
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function CancelOrder(_obj, keyObject, _config) {
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Cancel?',
                bodyText: 'Would you like to cancel this order? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    var __input = [{
                        "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                        "Properties": [{
                            "PropertyName": "POH_IsCancelled",
                            "PropertyNewValue": true,
                        }]
                    }];
                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            toastr.success(_obj.label + " Cancelled Successfully...!");
                            OrderActionCtrl.ePage.Masters.IsStandardMenu = false;
                            helperService.refreshGrid();
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function MakeIsActiveOrder(_obj, keyObject, _config) {
            if (_obj[_obj.label].ePage.Entities.Header.Data[keyObject]) {
                var __isValid = _obj[_obj.label].ePage.Entities.Header.Data[keyObject].IsValid;
                var _label = __isValid ? "Inactive" : "Active"
            } else {
                var __isValid = _obj[_obj.label].ePage.Entities.Header.Data.IsValid;
                var _label = __isValid ? "Inactive" : "Active"
            }

            if (__isValid) {
                var _isValid = false;
            } else {
                _isValid = true;
            }
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Active/InActive?',
                bodyText: 'Are You Sure Want To' + _label + "? " + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (_obj[_obj.label].ePage.Entities.Header.Data[keyObject]) {
                        var __input = [{
                            "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data[keyObject].PK,
                            "Properties": [{
                                "PropertyName": "POH_IsValid",
                                "PropertyNewValue": _isValid,
                            }]
                        }];
                    } else {
                        var __input = [{
                            "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                            "Properties": [{
                                "PropertyName": "POH_IsValid",
                                "PropertyNewValue": _isValid,
                            }]
                        }];
                    }

                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            if (__isValid) {
                                toastr.success(_obj.label + " Inactive Successfully...!");
                            } else {
                                toastr.success(_obj.label + " Active Successfully...!");
                            }
                            OrderActionCtrl.ePage.Masters.IsStandardMenu = false;
                            helperService.refreshGrid();
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function SplitOrder(_obj, keyObject, _config) {
            var tempArray = [];
            if (_obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderLines != undefined) {
                if (_obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Split Order?',
                        bodyText: 'Would you like to split the Order? ' + _obj.label
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.SplitOrderByOrderPk.Url + _obj[_obj.label].ePage.Entities.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                                var __obj = {
                                    entity: response.data.Response[keyObject],
                                    data: response.data.Response
                                };
                                if (OrderActionCtrl.ePage.Masters.State.current.url == "/order" || OrderActionCtrl.ePage.Masters.State.current.url == "/po-order/:taskNo") {
                                    OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                                } else {
                                    OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true, true, 'OrderNo');
                                }
                                // OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                            });
                        }, function () {
                            console.log("Cancelled");
                        });
                } else {
                    toastr.warning("Can't Split Here...")
                }
                // pop-up modal 
            } else {
                toastr.warning("Can't Split Here...")
            }
        }

        Init();
    }
})();