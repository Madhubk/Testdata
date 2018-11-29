(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_two_ReadOnlyOrdLineController", one_two_ReadOnlyOrdLineController);

    one_two_ReadOnlyOrdLineController.$inject = ["$scope", "helperService"];

    function one_two_ReadOnlyOrdLineController($scope, helperService) {
        var one_two_ReadOnlyOrdLineCtrl = this;

        function Init() {
            var obj = one_two_ReadOnlyOrdLineCtrl.obj[one_two_ReadOnlyOrdLineCtrl.obj.label].ePage.Entities;
            one_two_ReadOnlyOrdLineCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlySubPo",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderLine();
        }

        function InitOrderLine() {}
        $scope.$watch('one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier', function () {
            if (one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier.length > 0) {
                one_two_ReadOnlyOrdLineCtrl.ePage.Masters.Consolidation = [{
                    Count: one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier.length,
                    Quantity: _.sumBy(one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(one_two_ReadOnlyOrdLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Supplier, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                one_two_ReadOnlyOrdLineCtrl.ePage.Masters.Consolidation = [{
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