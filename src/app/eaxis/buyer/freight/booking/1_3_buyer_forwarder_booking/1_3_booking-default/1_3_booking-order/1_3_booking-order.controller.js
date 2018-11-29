(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerForwarderOrderController", bkgBuyerForwarderOrderController);

        bkgBuyerForwarderOrderController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_BookingConfig", "helperService", "toastr", "confirmation"];

    function bkgBuyerForwarderOrderController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, three_BookingConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var bkgBuyerForwarderOrderCtrl = this;

        function Init() {
            var currentBooking;
            (bkgBuyerForwarderOrderCtrl.currentBooking) ? currentBooking = bkgBuyerForwarderOrderCtrl.currentBooking[bkgBuyerForwarderOrderCtrl.currentBooking.label].ePage.Entities: currentBooking = bkgBuyerForwarderOrderCtrl.obj[bkgBuyerForwarderOrderCtrl.obj.label].ePage.Entities;
            bkgBuyerForwarderOrderCtrl.currentBooking = currentBooking;
            bkgBuyerForwarderOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Order",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking
            };

            bkgBuyerForwarderOrderCtrl.ePage.Masters.EmptyText = "NA";
            bkgBuyerForwarderOrderCtrl.ePage.Masters.BookingOrder = {};
            bkgBuyerForwarderOrderCtrl.ePage.Masters.BookingOrder.IsSelected = false;

            bkgBuyerForwarderOrderCtrl.ePage.Masters.BookingOrderGridRefreshFun = BookingOrderGridRefreshFun;
            bkgBuyerForwarderOrderCtrl.ePage.Masters.DeleteBookingOrder = DeleteBookingOrder;
            bkgBuyerForwarderOrderCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
            bkgBuyerForwarderOrderCtrl.ePage.Masters.SelectedData = SelectedData;
            bkgBuyerForwarderOrderCtrl.ePage.Masters.OrderItemCall = OrderItemCall

            if (bkgBuyerForwarderOrderCtrl.currentBooking.isNew) {
                bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = [];
                bkgBuyerForwarderOrderCtrl.ePage.Masters.OrderReference = [];
            } else {
                GetOrderListing();
            }
            GetOrderReference();
        }

        function GetOrderListing() {
            var _filter = {
                "SHP_FK": bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.PK,
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
                    bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function GetOrderReference() {
            bkgBuyerForwarderOrderCtrl.ePage.Masters.orderReferenceText = "";

            bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                bkgBuyerForwarderOrderCtrl.ePage.Masters.orderReferenceText += val.OrderReference + ','
            });
            bkgBuyerForwarderOrderCtrl.ePage.Masters.orderReferenceText = bkgBuyerForwarderOrderCtrl.ePage.Masters.orderReferenceText.substring(0, bkgBuyerForwarderOrderCtrl.ePage.Masters.orderReferenceText.length - 1)

        }

        function OrderItemCall(text) {
            var _split = text.split(',');
            if (text != '') {
                if (_split.length >= bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.length) {
                    _split.map(function (val, key) {
                        if (key >= bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.length) {
                            var _orderRefObj = {
                                "IsValid": true,
                                "OrderReference": val,
                                "Sequence": key + 1,
                                "JDC_FK": "",
                                "Source": "POH",
                                "SourceRefKey": bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.PK,
                                "IsModified": false,
                                "IsDeleted": false
                            };
                            bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.push(_orderRefObj)
                        } else {
                            bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].IsDeleted = false;
                            bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].OrderReference = val;
                        }

                    });
                } else {

                    bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                        if (_split.length > key) {
                            val.IsDeleted = false;
                            val.OrderReference = _split[key]
                        } else {
                            if (bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem[key].PK == undefined) {
                                val.IsDeleted = true;
                                bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.splice(key, 1)
                            } else {
                                val.IsDeleted = true;
                            }
                        }
                    })

                }
            } else {
                bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIPorOrderItem.map(function (val, key) {
                    val.IsDeleted = true;
                });
            }
        }

        function BookingOrderGridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.some(function (value, index) {
                    return value.PK === val.PK;
                });
                if (!_isExist) {
                    var _tempObj = {
                        "EntityRefPK": val.PK,
                        "Properties": [{
                            "PropertyName": "POH_SHP_FK",
                            "PropertyNewValue": bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.PK
                        }, {
                            "PropertyName": "POH_ShipmentNo",
                            "PropertyNewValue": bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
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
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _tempArray).then(function (response) {
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
                    DeleteBookingOrder($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteBookingOrder($item) {
            var _index = bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (value, key) {
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
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _input).then(function (response) {
                if (response.data.Response) {
                    // GetOrderListing();
                    bkgBuyerForwarderOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(_index, 1);
                }
            });
        }


        function SelectedData($item) {
            BookingOrderGridRefreshFun($item)
        }

        Init();
    }
})();