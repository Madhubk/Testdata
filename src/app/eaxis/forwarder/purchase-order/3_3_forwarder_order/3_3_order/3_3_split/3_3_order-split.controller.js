(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrdSplitController", three_three_OrdSplitController);

    three_three_OrdSplitController.$inject = ["$injector", "apiService", "helperService", "appConfig"];

    function three_three_OrdSplitController($injector, apiService, helperService, appConfig) {
        var three_three_OrdSplitCtrl = this;

        function Init() {
            var currentOrder = three_three_OrdSplitCtrl.currentOrder[three_three_OrdSplitCtrl.currentOrder.label].ePage.Entities;
            three_three_OrdSplitCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Split",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitSplit();
        }

        function InitSplit() {
            if (!three_three_OrdSplitCtrl.currentOrder.isNew) {
                Split(three_three_OrdSplitCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder);
            }
            three_three_OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
            three_three_OrdSplitCtrl.ePage.Masters.NewSplitRecord = NewSplitRecord;
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    three_three_OrdSplitCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    three_three_OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        function NewSplitRecord() {
            var configObj = $injector.get('three_order_listConfig');
            configObj.SplitOrder(three_three_OrdSplitCtrl.currentOrder, 'UIOrder_Forwarder', configObj);
        }

        Init();
    }
})();