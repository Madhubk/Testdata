(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryOrdBuyerMarpulViewOrderLineController", DeliveryOrdBuyerMarpulViewOrderLineController);

    DeliveryOrdBuyerMarpulViewOrderLineController.$inject = ["$scope", "helperService"];

    function DeliveryOrdBuyerMarpulViewOrderLineController($scope, helperService) {
        var DeliveryOrdBuyerMarpulViewOrderLineCtrl = this;

        function Init() {
            var obj = DeliveryOrdBuyerMarpulViewOrderLineCtrl.obj[DeliveryOrdBuyerMarpulViewOrderLineCtrl.obj.label].ePage.Entities;
            DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlySubPo",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderLine();
        }

        function InitOrderLine() {}
        $scope.$watch('DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer', function () {
            if (DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length > 0) {
                DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Masters.Consolidation = [{
                    Count: DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length,
                    Quantity: _.sumBy(DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                DeliveryOrdBuyerMarpulViewOrderLineCtrl.ePage.Masters.Consolidation = [{
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