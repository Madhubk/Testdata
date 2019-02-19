(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewOrderLineController", OrdBuyerViewOrderLineController);

    OrdBuyerViewOrderLineController.$inject = ["$scope", "helperService"];

    function OrdBuyerViewOrderLineController($scope, helperService) {
        var OrdBuyerViewOrderLineCtrl = this;

        function Init() {
            var obj = OrdBuyerViewOrderLineCtrl.obj[OrdBuyerViewOrderLineCtrl.obj.label].ePage.Entities;
            OrdBuyerViewOrderLineCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlySubPo",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderLine();
        }

        function InitOrderLine() {}
        $scope.$watch('OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer', function () {
            if (OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length > 0) {
                OrdBuyerViewOrderLineCtrl.ePage.Masters.Consolidation = [{
                    Count: OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length,
                    Quantity: _.sumBy(OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(OrdBuyerViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                OrdBuyerViewOrderLineCtrl.ePage.Masters.Consolidation = [{
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