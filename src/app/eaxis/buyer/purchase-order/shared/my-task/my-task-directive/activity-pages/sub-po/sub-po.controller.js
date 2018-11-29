(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityPageSubPoController", ActivityPageSubPoController);

    ActivityPageSubPoController.$inject = ["helperService", "appConfig", "apiService", "myTaskActivityConfig"];

    function ActivityPageSubPoController(helperService, appConfig, apiService, myTaskActivityConfig) {
        var ActivityPageSubPoCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            ActivityPageSubPoCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitSplit();
        }

        function InitSplit() {
            if (!ActivityPageSubPoCtrl.obj.isNew) {
                Split(ActivityPageSubPoCtrl.ePage.Entities.Header.Data.UIOrder_Buyer);
            }
            ActivityPageSubPoCtrl.ePage.Masters.SplitOrderList = [];
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    ActivityPageSubPoCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    ActivityPageSubPoCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        Init();
    }
})();