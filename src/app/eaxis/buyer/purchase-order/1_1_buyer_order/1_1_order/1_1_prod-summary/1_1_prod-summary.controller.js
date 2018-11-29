(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_prodSummaryController", one_one_prodSummaryController);

    one_one_prodSummaryController.$inject = ["$scope", "helperService"];

    function one_one_prodSummaryController($scope, helperService) {

        var one_one_prodSummaryCtrl = this;

        function Init() {
            var currentOrder = one_one_prodSummaryCtrl.currentOrder[one_one_prodSummaryCtrl.currentOrder.label].ePage.Entities;
            one_one_prodSummaryCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_General",
                "Masters": {
                    "PorOrderLine": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentOrder,
            };

        }

        $scope.$watch('one_one_prodSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer', function () {
            if (one_one_prodSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length > 0) {
                one_one_prodSummaryCtrl.ePage.Masters.res = _(one_one_prodSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer)
                    .groupBy('PartNo')
                    .map((PartNo, id) => ({
                        PartNo: id,
                        Quantity: _.sumBy(PartNo, 'Quantity'),
                        InvoicedQuantity: _.sumBy(PartNo, 'InvoicedQuantity'),
                        RecievedQuantity: _.sumBy(PartNo, 'RecievedQuantity'),
                        QtyRemaining: _.sumBy(PartNo, 'Quantity') - _.sumBy(PartNo, 'RecievedQuantity'),
                        InnerPacks: _.sumBy(PartNo, 'InnerPacks'),
                        OuterPacks: _.sumBy(PartNo, 'OuterPacks')
                    }))
                    .value()

                one_one_prodSummaryCtrl.ePage.Masters.Consolidation = [{
                    Count: one_one_prodSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length,
                    Quantity: _.sumBy(one_one_prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(one_one_prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(one_one_prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(one_one_prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(one_one_prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(one_one_prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(one_one_prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                one_one_prodSummaryCtrl.ePage.Masters.res = [];
                one_one_prodSummaryCtrl.ePage.Masters.Consolidation = [{
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