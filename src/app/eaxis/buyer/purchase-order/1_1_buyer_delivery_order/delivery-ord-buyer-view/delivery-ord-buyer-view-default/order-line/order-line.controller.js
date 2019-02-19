(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryOrdBuyerViewOrderLineController", DeliveryOrdBuyerViewOrderLineController);

    DeliveryOrdBuyerViewOrderLineController.$inject = ["$scope", "$window", "helperService", "apiService", "orderApiConfig", "toastr"];

    function DeliveryOrdBuyerViewOrderLineController($scope, $window, helperService, apiService, orderApiConfig, toastr) {
        var DeliveryOrdBuyerViewOrderLineCtrl = this;

        function Init() {
            var obj = DeliveryOrdBuyerViewOrderLineCtrl.obj[DeliveryOrdBuyerViewOrderLineCtrl.obj.label].ePage.Entities;
            DeliveryOrdBuyerViewOrderLineCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlySubPo",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderLine();
        }

        function InitOrderLine() {
            DeliveryOrdBuyerViewOrderLineCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
        }

        function SingleRecordView(entity) {
            var _filterInput = {
                "OrderNo": entity.PartAttribute1
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": orderApiConfig.Entities.BuyerOrder.API.findall.FilterID
            }
            apiService.post('eAxisAPI', orderApiConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    (response.data.Response.length > 0) ? OrderView(response.data.Response[0]): toastr.warning("There is no data response..!");
                } else {
                    toastr.warning("There is no data response..!");
                }
            });
        }

        function OrderView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderCumSplitNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order-view?q=" + _queryString, "_blank");
        }

        $scope.$watch('DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer', function () {
            if (DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length > 0) {
                DeliveryOrdBuyerViewOrderLineCtrl.ePage.Masters.Consolidation = [{
                    Count: DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length,
                    Quantity: _.sumBy(DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(DeliveryOrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                DeliveryOrdBuyerViewOrderLineCtrl.ePage.Masters.Consolidation = [{
                    "Count": 0,
                    "InnerPacks": 0,
                    "InvoicedQuantity": 0,
                    "OuterPacks": 0,
                    "QtyRemaining": 0,
                    "Quantity": 0,
                    "RecievedQuantity": 0
                }];
            }

        }, true);

        Init();
    }
})();