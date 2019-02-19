(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewSubPoDHCController", OrdBuyerViewSubPoDHCController);

    OrdBuyerViewSubPoDHCController.$inject = ["helperService", "orderApiConfig", "apiService"];

    function OrdBuyerViewSubPoDHCController(helperService, orderApiConfig, apiService) {
        var OrdBuyerViewSubPoDHCCtrl = this;

        function Init() {
            var obj = OrdBuyerViewSubPoDHCCtrl.obj[OrdBuyerViewSubPoDHCCtrl.obj.label].ePage.Entities;
            OrdBuyerViewSubPoDHCCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitSplit();
        }

        function InitSplit() {
            if (!OrdBuyerViewSubPoDHCCtrl.obj.isNew) {
                Split(OrdBuyerViewSubPoDHCCtrl.ePage.Entities.Header.Data.UIOrder_Buyer);
            }
            OrdBuyerViewSubPoDHCCtrl.ePage.Masters.SplitOrderList = [];
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerOrder.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    OrdBuyerViewSubPoDHCCtrl.ePage.Masters.SplitOrderList = response.data.Response.UIOrder_Buyer;
                } else {
                    OrdBuyerViewSubPoDHCCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        Init();
    }
})();