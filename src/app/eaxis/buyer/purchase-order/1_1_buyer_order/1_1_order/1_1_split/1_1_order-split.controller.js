(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrdSplitController", one_one_OrdSplitController);

    one_one_OrdSplitController.$inject = ["$window", "$injector", "$state", "apiService", "helperService", "appConfig"];

    function one_one_OrdSplitController($window, $injector, $state, apiService, helperService, appConfig) {
        var one_one_OrdSplitCtrl = this;

        function Init() {
            var currentOrder = one_one_OrdSplitCtrl.currentOrder[one_one_OrdSplitCtrl.currentOrder.label].ePage.Entities;
            one_one_OrdSplitCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Split",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitSplit();
        }

        function InitSplit() {
            if (!one_one_OrdSplitCtrl.currentOrder.isNew) {
                Split(one_one_OrdSplitCtrl.ePage.Entities.Header.Data.UIOrder_Buyer);
            }
            one_one_OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
            one_one_OrdSplitCtrl.ePage.Masters.NewSplitRecord = NewSplitRecord;
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    one_one_OrdSplitCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    one_one_OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        function NewSplitRecord() {
            var _state = $state;
            if (_state.current.url == "/order" || _state.current.url == "/po-order/:taskNo" || _state.current.url == "/order/:orderId") {
                var configObj = $injector.get('one_order_listConfig');
            } else {
                var configObj = $injector.get('poBatchUploadConfig');
            }
            // var configObj = $injector.get(appConfig.Entities.standardMenuConfigList.OrderHeader.configName);
            configObj.SplitOrder(one_one_OrdSplitCtrl.currentOrder, 'UIOrder_Buyer', configObj);
        }

        Init();
    }
})();