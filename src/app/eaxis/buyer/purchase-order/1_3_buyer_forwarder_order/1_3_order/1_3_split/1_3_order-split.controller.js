(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_OrdSplitController", one_three_OrdSplitController);

    one_three_OrdSplitController.$inject = ["$window", "$injector", "$state", "apiService", "helperService", "orderApiConfig"];

    function one_three_OrdSplitController($window, $injector, $state, apiService, helperService, orderApiConfig) {
        var one_three_OrdSplitCtrl = this;

        function Init() {
            var currentOrder = one_three_OrdSplitCtrl.currentOrder[one_three_OrdSplitCtrl.currentOrder.label].ePage.Entities;
            one_three_OrdSplitCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Split",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitSplit();
        }

        function InitSplit() {
            if (!one_three_OrdSplitCtrl.currentOrder.isNew) {
                Split(one_three_OrdSplitCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder);
            }
            one_three_OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
            one_three_OrdSplitCtrl.ePage.Masters.NewSplitRecord = NewSplitRecord;
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerForwarderOrder.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    one_three_OrdSplitCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    one_three_OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        function NewSplitRecord() {
            var configObj = $injector.get('one_order_listConfig');
            // var _state = $state;
            // if (_state.current.url == "/order" || _state.current.url == "/po-order/:taskNo" || _state.current.url == "/order/:orderId") {
            //     var configObj = $injector.get('one_order_listConfig');
            // } else {
            //     var configObj = $injector.get('poBatchUploadConfig');
            // }
            // var configObj = $injector.get(orderApiConfig.Entities.standardMenuConfigList.OrderHeader.configName);
            configObj.SplitOrder(one_three_OrdSplitCtrl.currentOrder, 'UIOrder_Buyer_Forwarder', configObj);
        }

        Init();
    }
})();