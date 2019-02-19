(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewOrderLineDhcController", OrdBuyerViewOrderLineDhcController);

    OrdBuyerViewOrderLineDhcController.$inject = ["$scope", "helperService"];

    function OrdBuyerViewOrderLineDhcController($scope, helperService) {
        var OrdBuyerViewOrderLineDhcCtrl = this;

        function Init() {
            var obj = OrdBuyerViewOrderLineDhcCtrl.obj[OrdBuyerViewOrderLineDhcCtrl.obj.label].ePage.Entities;
            OrdBuyerViewOrderLineDhcCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderlineView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderLine();
        }

        function InitOrderLine() {}
        $scope.$watch('OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer', function () {
            if (OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length > 0) {
                OrdBuyerViewOrderLineDhcCtrl.ePage.Masters.Consolidation = [{
                    Count: OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length,
                    Quantity: _.sumBy(OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(OrdBuyerViewOrderLineDhcCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                OrdBuyerViewOrderLineDhcCtrl.ePage.Masters.Consolidation = [{
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