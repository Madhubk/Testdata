(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewSubPoController", OrdBuyerViewSubPoController);

    OrdBuyerViewSubPoController.$inject = ["helperService", "appConfig", "apiService"];

    function OrdBuyerViewSubPoController(helperService, appConfig, apiService) {
        var OrdBuyerViewSubPoCtrl = this;

        function Init() {
            var obj = OrdBuyerViewSubPoCtrl.obj[OrdBuyerViewSubPoCtrl.obj.label].ePage.Entities;
            OrdBuyerViewSubPoCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitSplit();
        }

        function InitSplit() {
            if (!OrdBuyerViewSubPoCtrl.obj.isNew) {
                Split(OrdBuyerViewSubPoCtrl.ePage.Entities.Header.Data.UIOrder_Buyer);
            }
            OrdBuyerViewSubPoCtrl.ePage.Masters.SplitOrderList = [];
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    OrdBuyerViewSubPoCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    OrdBuyerViewSubPoCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        Init();
    }
})();