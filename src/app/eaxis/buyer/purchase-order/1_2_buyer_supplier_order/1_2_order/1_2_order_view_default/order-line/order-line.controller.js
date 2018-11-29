(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderViewDefaultOrdLineController", OrderViewDefaultOrdLineController);

    OrderViewDefaultOrdLineController.$inject = ["$scope", "helperService"];

    function OrderViewDefaultOrdLineController($scope, helperService) {
        var OrderViewDefaultOrdLineCtrl = this;

        function Init() {
            var obj = OrderViewDefaultOrdLineCtrl.obj[OrderViewDefaultOrdLineCtrl.obj.label].ePage.Entities;
            OrderViewDefaultOrdLineCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlySubPo",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderLine();
        }

        function InitOrderLine() {}
        $scope.$watch('OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier', function () {
            if (OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier.length > 0) {
                OrderViewDefaultOrdLineCtrl.ePage.Masters.Consolidation = [{
                    Count: OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier.length,
                    Quantity: _.sumBy(OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(OrderViewDefaultOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                OrderViewDefaultOrdLineCtrl.ePage.Masters.Consolidation = [{
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