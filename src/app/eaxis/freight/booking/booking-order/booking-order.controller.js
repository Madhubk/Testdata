(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingOrderController", BookingOrderController);

    BookingOrderController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "BookingConfig", "helperService", "toastr", "confirmation"];

    function BookingOrderController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, BookingConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var BookingOrderCtrl = this;

        function Init() {
            var currentBooking = BookingOrderCtrl.currentBooking[BookingOrderCtrl.currentBooking.label].ePage.Entities;
            BookingOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Order",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking
            };

            BookingOrderCtrl.ePage.Masters.EmptyText = "NA";
            BookingOrderCtrl.ePage.Masters.BookingOrder = {};
            BookingOrderCtrl.ePage.Masters.BookingOrder.IsSelected = false;

            BookingOrderCtrl.ePage.Masters.BookingOrderGridRefreshFun = BookingOrderGridRefreshFun;
            BookingOrderCtrl.ePage.Masters.DeleteBookingOrder = DeleteBookingOrder;
            BookingOrderCtrl.ePage.Masters.DeleteConfirmation = DeleteConfirmation;
            BookingOrderCtrl.ePage.Masters.SelectedData = SelectedData;
            BookingOrderCtrl.ePage.Masters.More = More;

            if (BookingOrderCtrl.currentBooking.isNew) {
                BookingOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = [];
                BookingOrderCtrl.ePage.Masters.OrderReference = [];
            } else {
                GetOrderListing();
            }
            GetOrderReference();
        }

        function GetOrderListing() {
            var _filter = {
                "SHP_FK": BookingOrderCtrl.ePage.Entities.Header.Data.PK,
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
                    BookingOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function GetOrderReference() {
            BookingOrderCtrl.ePage.Masters.orderReferenceText = "";
            var _filter = {
                "OrderRefKey": BookingOrderCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": BookingOrderCtrl.ePage.Entities.BookingOrder.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", BookingOrderCtrl.ePage.Entities.BookingOrder.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingOrderCtrl.ePage.Masters.OrderReference = response.data.Response;
                    BookingOrderCtrl.ePage.Masters.OrderReference.map(function (val, key) {
                        BookingOrderCtrl.ePage.Masters.orderReferenceText += val.OrderReference + ','
                    });
                }
            });
        }

        function BookingOrderGridRefreshFun($item) {
            var _tempArray = [];
            $item.map(function (val, key) {
                var _isExist = BookingOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.some(function (value, index) {
                    return value.PK === val.PK;
                });
                if (!_isExist) {
                    var _tempObj = {
                        "EntityRefPK": val.PK,
                        "Properties": [{
                            "PropertyName": "POH_SHP_FK",
                            "PropertyNewValue": BookingOrderCtrl.ePage.Entities.Header.Data.PK
                        }, {
                            "PropertyName": "POH_ShipmentNo",
                            "PropertyNewValue": BookingOrderCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                        }]
                    };
                    if (val.SHP_FK == null || val.SHP_FK=='') {
                        _tempArray.push(_tempObj)
                    } else {
                        toastr.warning(val.OrderNo + " Already attached another Booking...!");
                    }
                } else {
                    toastr.warning(val.OrderNo + " Already Available...!");
                }
            });
            apiService.post("eAxisAPI", BookingOrderCtrl.ePage.Entities.Header.API.OrderAttach.Url, _tempArray).then(function (response) {
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
            var _index = BookingOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (value, key) {
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
            apiService.post("eAxisAPI", BookingOrderCtrl.ePage.Entities.Header.API.OrderAttach.Url, _input).then(function (response) {
                if (response.data.Response) {
                    // GetOrderListing();
                    BookingOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(_index, 1);
                }
            });
        }

        function More() {

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "orderItem-modal",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/freight/booking/Booking-order/orderItem-modal.html",
                controller: 'orderItemModalController',
                controllerAs: "orderItemModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "OrderReference": BookingOrderCtrl.ePage.Masters.OrderReference,
                            "CurrentBooking": BookingOrderCtrl.ePage.Entities
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    BookingOrderCtrl.ePage.Masters.orderReferenceText = ""
                    response.map(function (val, key) {
                        BookingOrderCtrl.ePage.Masters.orderReferenceText += val.OrderReference + ','
                    });
                }
            );

        }

        function SelectedData($item) {
            BookingOrderGridRefreshFun($item)
        }

        Init();
    }
})();
