(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityPageOrderLineController", ActivityPageOrderLineController);

    ActivityPageOrderLineController.$inject = ["$scope", "helperService", "myTaskActivityConfig"];

    function ActivityPageOrderLineController($scope, helperService, myTaskActivityConfig) {
        var ActivityPageOrderLineCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            ActivityPageOrderLineCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlySubPo",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderLine();
        }

        function InitOrderLine() {}
        $scope.$watch('ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer', function () {
            if (ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length > 0) {
                ActivityPageOrderLineCtrl.ePage.Masters.Consolidation = [{
                    Count: ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length,
                    Quantity: _.sumBy(ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(ActivityPageOrderLineCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                ActivityPageOrderLineCtrl.ePage.Masters.Consolidation = [{
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