(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_two_ReadOnlySubPoController", one_two_ReadOnlySubPoController);

    one_two_ReadOnlySubPoController.$inject = ["helperService", "orderApiConfig", "apiService"];

    function one_two_ReadOnlySubPoController(helperService, orderApiConfig, apiService) {
        var one_two_ReadOnlySubPoCtrl = this;

        function Init() {
            var obj = one_two_ReadOnlySubPoCtrl.obj[one_two_ReadOnlySubPoCtrl.obj.label].ePage.Entities;
            one_two_ReadOnlySubPoCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitSplit();
        }

        function InitSplit() {
            if (!one_two_ReadOnlySubPoCtrl.obj.isNew) {
                Split(one_two_ReadOnlySubPoCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier);
            }
            one_two_ReadOnlySubPoCtrl.ePage.Masters.SplitOrderList = [];
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerSupplierOrder.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    one_two_ReadOnlySubPoCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    one_two_ReadOnlySubPoCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        Init();
    }
})();