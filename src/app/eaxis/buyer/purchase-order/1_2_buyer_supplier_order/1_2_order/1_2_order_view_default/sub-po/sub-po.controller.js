(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderViewDefaultSubPoController", OrderViewDefaultSubPoController);

    OrderViewDefaultSubPoController.$inject = ["helperService", "orderApiConfig", "apiService"];

    function OrderViewDefaultSubPoController(helperService, orderApiConfig, apiService) {
        var OrderViewDefaultSubPoCtrl = this;

        function Init() {
            var obj = OrderViewDefaultSubPoCtrl.obj[OrderViewDefaultSubPoCtrl.obj.label].ePage.Entities;
            OrderViewDefaultSubPoCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitSplit();
        }

        function InitSplit() {
            if (!OrderViewDefaultSubPoCtrl.obj.isNew) {
                Split(OrderViewDefaultSubPoCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier);
            }
            OrderViewDefaultSubPoCtrl.ePage.Masters.SplitOrderList = [];
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerSupplierOrder.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    OrderViewDefaultSubPoCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    OrderViewDefaultSubPoCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        Init();
    }
})();