(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrderActionController", three_three_OrderActionController);

    three_three_OrderActionController.$inject = ["$scope", "$injector", "apiService", "helperService", "appConfig", "confirmation", "toastr"];

    function three_three_OrderActionController($scope, $injector, apiService, helperService, appConfig, confirmation, toastr) {
        /* jshint validthis: true */
        var three_three_OrderActionCtrl = this;

        function Init() {
            var curObject = three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities;
            three_three_OrderActionCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": curObject
            };
            if (three_three_OrderActionCtrl.input) {
                InitEvent();
            }
        }

        function InitEvent() {
            three_three_OrderActionCtrl.ePage.Masters.Action = {};
            three_three_OrderActionCtrl.ePage.Masters.Action.ActionMenuClick = ActionMenuClick;
            // order action
            three_three_OrderActionCtrl.ePage.Masters.ConfigName = $injector.get('three_order_listConfig');
            three_three_OrderActionCtrl.ePage.Masters.ConfigName.CopyOrder = CopyOrder;
            three_three_OrderActionCtrl.ePage.Masters.ConfigName.CancelOrder = CancelOrder;
            three_three_OrderActionCtrl.ePage.Masters.ConfigName.MakeIsActiveOrder = MakeIsActiveOrder;
            three_three_OrderActionCtrl.ePage.Masters.ConfigName.SplitOrder = SplitOrder;
        }

        $scope.$watch('three_three_OrderActionCtrl.input', function (oldValue, NewValue) {
            if (!three_three_OrderActionCtrl.input.isNew) {
                if (!three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Forwarder) {
                    if (three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.IsValid) {
                        three_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        three_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                } else {
                    if (three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Forwarder.IsValid) {
                        three_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        three_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                }
            }
        });

        function ActionMenuClick(type) {
            var configObj = $injector.get('three_order_listConfig');
            if (type == 'copy') {
                configObj.CopyOrder(three_three_OrderActionCtrl.input, 'UIOrder_Forwarder', configObj);
            } else if (type == 'cancel') {
                configObj.CancelOrder(three_three_OrderActionCtrl.input, 'UIOrder_Forwarder', configObj);
            } else if (type == 'active') {
                if (three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK && three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK != '00000000-0000-0000-0000-000000000000' && !three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIShipment_Forwarder.IsBooking) {
                    toastr.warning("Order already attached with " + three_three_OrderActionCtrl.input[three_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Forwarder.ShipmentNo);
                } else {
                    configObj.MakeIsActiveOrder(three_three_OrderActionCtrl.input, 'UIOrder_Forwarder', configObj);
                }
            } else if (type == 'split') {
                configObj.SplitOrder(three_three_OrderActionCtrl.input, 'UIOrder_Forwarder', configObj);
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
                    apiService.get("eAxisAPI", appConfig.Entities.ForwarderOrder.API.ordercopy.Url + _obj[_obj.label].ePage.Entities.Header.Data.PK).then(function (response) {
                        var __obj = {
                            entity: response.data.Response[keyObject],
                            data: response.data.Response
                        };

                        three_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                        // if (three_three_OrderActionCtrl.ePage.Masters.State.current.url == "/order" || three_three_OrderActionCtrl.ePage.Masters.State.current.url == "/po-order/:taskNo") {
                        //     three_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                        // } else {
                        //     three_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true, true, 'OrderNo');
                        // }
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
                            three_three_OrderActionCtrl.ePage.Masters.IsStandardMenu = false;
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
                            three_three_OrderActionCtrl.ePage.Masters.IsStandardMenu = false;
                            helperService.refreshGrid();
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function SplitOrder(_obj, keyObject, _config) {
            var tempArray = [];
            if (_obj[_obj.label].ePage.Entities.Header.Data.UIOrderLine_Forwarder != undefined) {
                if (_obj[_obj.label].ePage.Entities.Header.Data.UIOrderLine_Forwarder.length > 0) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Split Order?',
                        bodyText: 'Would you like to split the Order? ' + _obj.label
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            apiService.get("eAxisAPI", appConfig.Entities.ForwarderOrder.API.split.Url + _obj[_obj.label].ePage.Entities.Header.Data.UIOrder_Forwarder.PK).then(function (response) {
                                var __obj = {
                                    entity: response.data.Response[keyObject],
                                    data: response.data.Response
                                };
                                // if (three_three_OrderActionCtrl.ePage.Masters.State.current.url == "/order" || three_three_OrderActionCtrl.ePage.Masters.State.current.url == "/po-order/:taskNo") {
                                //     three_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                                // } else {
                                //     three_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true, true, 'OrderNo');
                                // }
                                three_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                            });
                        }, function () {
                            console.log("Cancelled");
                        });
                } else {
                    toastr.warning("Can't Split Here...");
                }
                // pop-up modal 
            } else {
                toastr.warning("Can't Split Here...");
            }
        }

        Init();
    }
})();