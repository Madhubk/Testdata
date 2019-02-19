(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeShipmentOrderController", oneThreeShipmentOrderController);

    oneThreeShipmentOrderController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_shipmentConfig", "helperService", "toastr", "confirmation", "orderApiConfig"];

    function oneThreeShipmentOrderController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, three_shipmentConfig, helperService, toastr, confirmation, orderApiConfig) {
        /* jshint validthis: true */
        var oneThreeShipmentOrderCtrl = this;

        function Init() {
            var currentShipment = oneThreeShipmentOrderCtrl.currentShipment[oneThreeShipmentOrderCtrl.currentShipment.label].ePage.Entities;
            oneThreeShipmentOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Order",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };
            oneThreeShipmentOrderCtrl.ePage.Masters.EmptyText = "NA";
            oneThreeShipmentOrderCtrl.ePage.Masters.ShipmentOrder = {};
            oneThreeShipmentOrderCtrl.ePage.Masters.ShipmentOrder.IsSelected = false;

            oneThreeShipmentOrderCtrl.ePage.Masters.ShipmentOrderGridRefreshFun = ShipmentOrderGridRefreshFun;
            oneThreeShipmentOrderCtrl.ePage.Masters.DeleteShipmentOrder = DeleteShipmentOrder;
            oneThreeShipmentOrderCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
            oneThreeShipmentOrderCtrl.ePage.Masters.SelectedData = SelectedData;
            oneThreeShipmentOrderCtrl.ePage.Masters.OrderItemCall = OrderItemCall;
            oneThreeShipmentOrderCtrl.ePage.Masters.GetNewOrder = GetNewOrder;

            if (oneThreeShipmentOrderCtrl.currentShipment.isNew) {
                oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = [];
                oneThreeShipmentOrderCtrl.ePage.Masters.OrderReference = [];
            } else {
                GetOrderListing();
            }
            GetOrderReference();

        }

        function GetOrderListing() {
            var _filter = {
                "SHP_FK": oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": orderApiConfig.Entities.BuyerForwarderOrder.API.findall.FilterID
            };

            apiService.post("eAxisAPI", orderApiConfig.Entities.BuyerForwarderOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function GetOrderReference() {
            oneThreeShipmentOrderCtrl.ePage.Masters.orderReferenceText = "";

            oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                oneThreeShipmentOrderCtrl.ePage.Masters.orderReferenceText += val.OrderReference + ','
            });
            oneThreeShipmentOrderCtrl.ePage.Masters.orderReferenceText = oneThreeShipmentOrderCtrl.ePage.Masters.orderReferenceText.substring(0, oneThreeShipmentOrderCtrl.ePage.Masters.orderReferenceText.length - 1)

        }

        function OrderItemCall(text) {
            var _split = text.split(',');
            if (text != '') {
                if (_split.length >= oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.length) {
                    _split.map(function (val, key) {
                        if (key >= oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.length) {
                            var _orderRefObj = {
                                "IsValid": true,
                                "OrderReference": val,
                                "Sequence": key + 1,
                                "JDC_FK": "",
                                "Source": "POH",
                                "SourceRefKey": oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.PK,
                                "IsModified": false,
                                "IsDeleted": false
                            };
                            oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.push(_orderRefObj)
                        } else {
                            oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].IsDeleted = false;
                            oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].OrderReference = val;
                        }

                    });
                } else {

                    oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                        if (_split.length > key) {
                            val.IsDeleted = false;
                            val.OrderReference = _split[key]
                        } else {
                            if (oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].PK == undefined) {
                                val.IsDeleted = true;
                                oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.splice(key, 1)
                            } else {
                                val.IsDeleted = true;
                            }
                        }
                    })

                }
            } else {
                oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                    val.IsDeleted = true;
                });
            }
        }

        function ShipmentOrderGridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.some(function (value, index) {
                    return value.PK === val.PK;
                });
                if (!_isExist) {
                    var _tempObj = {
                        "EntityRefPK": val.PK,
                        "Properties": [{
                            "PropertyName": "POH_SHP_FK",
                            "PropertyNewValue": oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.PK
                        }, {
                            "PropertyName": "POH_ShipmentNo",
                            "PropertyNewValue": oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                        }]
                    };
                    if (val.SHP_FK == null || val.SHP_FK == '') {
                        _tempArray.push(_tempObj)
                    } else {
                        toastr.warning(val.OrderNo + " Already attached another shipment...!");
                    }
                } else {
                    toastr.warning(val.OrderNo + " Already Available...!");
                }
            });
            apiService.post("eAxisAPI", oneThreeShipmentOrderCtrl.ePage.Entities.ShipmentOrder.API.OrderAttach.Url, _tempArray).then(function (response) {
                if (response.data.Response) {
                    GetOrderListing();
                }
            });
        }


        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteShipmentOrder($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteShipmentOrder($item) {
            var _index = oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (value, key) {
                return value.PK;
            }).indexOf($item.PK);
            var _input = [{
                "EntityRefPK": $item.PK,
                "Properties": [{
                    "PropertyName": "POH_SHP_FK",
                    "PropertyNewValue": null
                }, {
                    "PropertyName": "POH_ShipmentNo",
                    "PropertyNewValue": null
                }]
            }];
            apiService.post("eAxisAPI", oneThreeShipmentOrderCtrl.ePage.Entities.ShipmentOrder.API.OrderAttach.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GetOrderListing();
                    oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(_index, 1);
                }
            });
        }

        function GetNewOrder() {
            var obj = {
                "POH_SHP_FK": oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.PK,
                "POH_ShipmentNo": oneThreeShipmentOrderCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            }
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "Concontainer right",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eaxis/freight/shipment/shipment-new-order/shipment-new-order.html",
                        controller: 'ShipmentcreateorderModalController',
                        controllerAs: "ShipmentcreateorderModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "neworder": response.data.Response,
                                    "shpobj": obj,
                                    "ShipmentOrder": oneThreeShipmentOrderCtrl.ePage.Entities.ShipmentOrder
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {
                            if (response) {
                                GetOrderListing();
                            }
                        });
                }
            });
        }

        function SelectedData($item) {
            ShipmentOrderGridRefreshFun($item)
        }

        Init();
    }
})();