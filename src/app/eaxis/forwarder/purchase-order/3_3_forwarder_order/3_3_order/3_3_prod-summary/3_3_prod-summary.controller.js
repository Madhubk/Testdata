(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_ProdSummaryController", three_three_ProdSummaryController);

    three_three_ProdSummaryController.$inject = ["$scope", "helperService"];

    function three_three_ProdSummaryController($scope, helperService) {

        var three_three_ProdSummaryCtrl = this;

        function Init() {
            var currentOrder = three_three_ProdSummaryCtrl.currentOrder[three_three_ProdSummaryCtrl.currentOrder.label].ePage.Entities;
            three_three_ProdSummaryCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_General",
                "Masters": {
                    "PorOrderLine": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentOrder,
            };

        }

        $scope.$watch('three_three_ProdSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder', function () {
            if (three_three_ProdSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.length > 0) {
                three_three_ProdSummaryCtrl.ePage.Masters.res = _(three_three_ProdSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder)
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

                three_three_ProdSummaryCtrl.ePage.Masters.Consolidation = [{
                    Count: three_three_ProdSummaryCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.length,
                    Quantity: _.sumBy(three_three_ProdSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(three_three_ProdSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(three_three_ProdSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(three_three_ProdSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(three_three_ProdSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(three_three_ProdSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(three_three_ProdSummaryCtrl.ePage.Masters.res, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                three_three_ProdSummaryCtrl.ePage.Masters.res = [];
                three_three_ProdSummaryCtrl.ePage.Masters.Consolidation = [{
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