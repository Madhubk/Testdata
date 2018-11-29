(function () {
    "use strict";

    angular
        .module("Application")
        .controller("prodSummaryController", prodSummaryController);

    prodSummaryController.$inject = ["$scope", "helperService"];

    function prodSummaryController($scope, helperService) {

        var prodSummaryCtrl = this;

        function Init() {
            var currentOrder = prodSummaryCtrl.currentOrder[prodSummaryCtrl.currentOrder.label].ePage.Entities;
            prodSummaryCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_General",
                "Masters": {
                    "PorOrderLine": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentOrder,
            };

        }

        $scope.$watch('prodSummaryCtrl.ePage.Entities.Header.Data.UIPorOrderLines', function () {
            if (prodSummaryCtrl.ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                prodSummaryCtrl.ePage.Masters.res = _(prodSummaryCtrl.ePage.Entities.Header.Data.UIPorOrderLines)
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

                prodSummaryCtrl.ePage.Masters.Consolidation = [{
                    Count: prodSummaryCtrl.ePage.Entities.Header.Data.UIPorOrderLines.length,
                    Quantity: _.sumBy(prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(prodSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                prodSummaryCtrl.ePage.Masters.res = [];
                prodSummaryCtrl.ePage.Masters.Consolidation = [{
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