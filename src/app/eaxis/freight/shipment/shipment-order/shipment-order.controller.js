(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentOrderController", ShipmentOrderController);

    ShipmentOrderController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "shipmentConfig", "helperService", "toastr", "confirmation"];

    function ShipmentOrderController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, shipmentConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var ShipmentOrderCtrl = this;

        function Init() {
            var currentShipment = ShipmentOrderCtrl.currentShipment[ShipmentOrderCtrl.currentShipment.label].ePage.Entities;
            ShipmentOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Order",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            ShipmentOrderCtrl.ePage.Masters.EmptyText = "NA";
            ShipmentOrderCtrl.ePage.Masters.ShipmentOrder = {};
            ShipmentOrderCtrl.ePage.Masters.ShipmentOrder.IsSelected = false;

            ShipmentOrderCtrl.ePage.Masters.ShipmentOrderGridRefreshFun = ShipmentOrderGridRefreshFun;
            ShipmentOrderCtrl.ePage.Masters.DeleteShipmentOrder = DeleteShipmentOrder;
            ShipmentOrderCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
            ShipmentOrderCtrl.ePage.Masters.SelectedData = SelectedData;
            ShipmentOrderCtrl.ePage.Masters.OrderItemCall = OrderItemCall;

            if (ShipmentOrderCtrl.currentShipment.isNew) {
                ShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = [];
                ShipmentOrderCtrl.ePage.Masters.OrderReference = [];
            } else {
                GetOrderListing();
            }
            GetOrderReference();

        }

        function GetOrderListing() {
            var _filter = {
                "SHP_FK": ShipmentOrderCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function GetOrderReference() {
            ShipmentOrderCtrl.ePage.Masters.orderReferenceText = "";

            ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                ShipmentOrderCtrl.ePage.Masters.orderReferenceText += val.OrderReference + ','
            });
            ShipmentOrderCtrl.ePage.Masters.orderReferenceText = ShipmentOrderCtrl.ePage.Masters.orderReferenceText.substring(0, ShipmentOrderCtrl.ePage.Masters.orderReferenceText.length - 1)

        }

        function OrderItemCall(text) {
            var _split = text.split(',');
            if (text != '') {
                if (_split.length >= ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.length) {
                    _split.map(function (val, key) {
                        if (key >= ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.length) {
                            var _orderRefObj = {
                                "IsValid": true,
                                "OrderReference": val,
                                "Sequence": key + 1,
                                "JDC_FK": "",
                                "Source": "POH",
                                "SourceRefKey": ShipmentOrderCtrl.ePage.Entities.Header.Data.PK,
                                "IsModified": false,
                                "IsDeleted": false
                            };
                            ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.push(_orderRefObj)
                        } else {
                            ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].IsDeleted = false;
                            ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].OrderReference = val;
                        }

                    });
                } else {

                    ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                        if (_split.length > key) {
                            val.IsDeleted = false;
                            val.OrderReference = _split[key]
                        } else {
                            if (ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].PK == undefined) {
                                val.IsDeleted = true;
                                ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.splice(key, 1)
                            } else {
                                val.IsDeleted = true;
                            }
                        }
                    })

                }
            } else {
                ShipmentOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                    val.IsDeleted = true;
                });
            }
        }

        function ShipmentOrderGridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = ShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.some(function (value, index) {
                    return value.PK === val.PK;
                });
                if (!_isExist) {
                    var _tempObj = {
                        "EntityRefPK": val.PK,
                        "Properties": [{
                            "PropertyName": "POH_SHP_FK",
                            "PropertyNewValue": ShipmentOrderCtrl.ePage.Entities.Header.Data.PK
                        }, {
                            "PropertyName": "POH_ShipmentNo",
                            "PropertyNewValue": ShipmentOrderCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
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
            apiService.post("eAxisAPI", ShipmentOrderCtrl.ePage.Entities.ShipmentOrder.API.OrderAttach.Url, _tempArray).then(function (response) {
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
            var _index = ShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (value, key) {
                return value.PK;
            }).indexOf($item.PK);
            var _input = [{
                "EntityRefPK": $item.PK,
                "Properties": [{
                    "PropertyName": "POH_SHP_FK",
                    "PropertyNewValue": '00000000-0000-0000-0000-000000000000'
                }, {
                    "PropertyName": "POH_ShipmentNo",
                    "PropertyNewValue": ''
                }]
            }]
            apiService.post("eAxisAPI", ShipmentOrderCtrl.ePage.Entities.ShipmentOrder.API.OrderAttach.Url, _input).then(function (response) {
                if (response.data.Response) {
                    // GetOrderListing();
                    ShipmentOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(_index, 1);
                }
            });
        }


        function SelectedData($item) {
            ShipmentOrderGridRefreshFun($item)
        }

        Init();
    }
})();