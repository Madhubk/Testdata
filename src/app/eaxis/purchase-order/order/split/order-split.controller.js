(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdSplitController", OrdSplitController);

    OrdSplitController.$inject = ["$window", "$injector", "$state", "apiService", "helperService", "appConfig"];

    function OrdSplitController($window, $injector, $state, apiService, helperService, appConfig) {
        var OrdSplitCtrl = this;

        function Init() {
            var currentOrder = OrdSplitCtrl.currentOrder[OrdSplitCtrl.currentOrder.label].ePage.Entities;
            OrdSplitCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Split",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitSplit();
        }

        function InitSplit() {
            if (!OrdSplitCtrl.currentOrder.isNew) {
                Split(OrdSplitCtrl.ePage.Entities.Header.Data.UIPorOrderHeader);
            }
            OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
            OrdSplitCtrl.ePage.Masters.NewSplitRecord = NewSplitRecord;
        }

        function Split(data) {
            var _input = data.OrderNo;
            var _input1 = data.OrderNoSplit;
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.GetSplitOrdersByOrderNo.Url + _input + "/" + _input1).then(function (response) {
                if (response.data.Response) {
                    OrdSplitCtrl.ePage.Masters.SplitOrderList = response.data.Response.OrderHeaderList;
                } else {
                    OrdSplitCtrl.ePage.Masters.SplitOrderList = [];
                }
            });
        }

        function NewSplitRecord() {
            var _state = $state;
            if (_state.current.url == "/order" || _state.current.url == "/po-order/:taskNo" || _state.current.url == "/order/:orderId") {
                var configObj = $injector.get('orderConfig');
            } else {
                var configObj = $injector.get('poBatchUploadConfig');
            }
            // var configObj = $injector.get(appConfig.Entities.standardMenuConfigList.OrderHeader.configName);
            configObj.SplitOrder(OrdSplitCtrl.currentOrder, 'UIPorOrderHeader', configObj);
        }

        Init();
    }
})();