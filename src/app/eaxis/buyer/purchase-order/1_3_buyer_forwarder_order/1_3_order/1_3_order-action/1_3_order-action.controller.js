(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_orderActionController", one_three_orderActionController);

    one_three_orderActionController.$inject = ["$scope", "$injector", "$uibModal", "$state", "apiService", "helperService", "appConfig", "confirmation", "toastr"];

    function one_three_orderActionController($scope, $injector, $uibModal, $state, apiService, helperService, appConfig, confirmation, toastr) {
        /* jshint validthis: true */
        var one_three_OrderActionCtrl = this;

        function Init() {
            var curObject = one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities;
            one_three_OrderActionCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": curObject
            };
            if (one_three_OrderActionCtrl.input) {
                InitEvent();
            }
        }

        function InitEvent() {
            one_three_OrderActionCtrl.ePage.Masters.Action = {};
            one_three_OrderActionCtrl.ePage.Masters.Action.ActionMenuClick = ActionMenuClick;
            // order action
            one_three_OrderActionCtrl.ePage.Masters.ConfigName = $injector.get('one_order_listConfig');
            one_three_OrderActionCtrl.ePage.Masters.ConfigName.CopyOrder = CopyOrder;
            one_three_OrderActionCtrl.ePage.Masters.ConfigName.CancelOrder = CancelOrder;
            one_three_OrderActionCtrl.ePage.Masters.ConfigName.MakeIsActiveOrder = MakeIsActiveOrder;
            one_three_OrderActionCtrl.ePage.Masters.ConfigName.SplitOrder = SplitOrder;
        }

        $scope.$watch('one_three_OrderActionCtrl.input', function (oldValue, NewValue) {
            if (!one_three_OrderActionCtrl.input.isNew) {
                if (!one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder) {
                    if (one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.IsValid) {
                        one_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        one_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                } else {
                    if (one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.IsValid) {
                        one_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        one_three_OrderActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                }
            }
        });

        function ActionMenuClick(type) {
            var configObj = $injector.get('one_order_listConfig');
            if (type == 'copy') {
                configObj.CopyOrder(one_three_OrderActionCtrl.input, 'UIOrder_Buyer_Forwarder', configObj);
            } else if (type == 'cancel') {
                configObj.CancelOrder(one_three_OrderActionCtrl.input, 'UIOrder_Buyer_Forwarder', configObj);
            } else if (type == 'active') {
                if (one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK && one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK != '00000000-0000-0000-0000-000000000000' && !one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIShipment_Buyer_Forwarder.IsBooking) {
                    toastr.warning("Order already attached with " + one_three_OrderActionCtrl.input[one_three_OrderActionCtrl.input.label].ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ShipmentNo);
                } else {
                    configObj.MakeIsActiveOrder(one_three_OrderActionCtrl.input, 'UIOrder_Buyer_Forwarder', configObj);
                }
            } else if (type == 'split') {
                configObj.SplitOrder(one_three_OrderActionCtrl.input, 'UIOrder_Buyer_Forwarder', configObj);
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
                        one_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
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
                            one_three_OrderActionCtrl.ePage.Masters.IsStandardMenu = false;
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
                            one_three_OrderActionCtrl.ePage.Masters.IsStandardMenu = false;
                            helperService.refreshGrid();
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function SplitOrder(_obj, keyObject, _config) {
            var tempArray = [];
            if (_obj[_obj.label].ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder != undefined) {
                if (_obj[_obj.label].ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.length > 0) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Split Order?',
                        bodyText: 'Would you like to split the Order? ' + _obj.label
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.SplitOrderByOrderPk.Url + _obj[_obj.label].ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.PK).then(function (response) {
                                var __obj = {
                                    entity: response.data.Response[keyObject],
                                    data: response.data.Response
                                };

                                one_three_OrderActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
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