(function () {
    "use strict";

    angular
        .module("Application")
        .controller("shpBuyerViewOrderController", shpBuyerViewOrderController);

    shpBuyerViewOrderController.$inject = ["helperService", "orderApiConfig", "apiService", "$window"];

    function shpBuyerViewOrderController(helperService, orderApiConfig, apiService, $window) {
        /* jshint validthis: true */
        var shpBuyerViewOrderCtrl = this;

        function Init() {
            var obj = shpBuyerViewOrderCtrl.obj[shpBuyerViewOrderCtrl.obj.label].ePage.Entities;
            shpBuyerViewOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };
            shpBuyerViewOrderCtrl.ePage.Masters.EmptyText = '-';
            shpBuyerViewOrderCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            GetOrderListing();
        }

        function GetOrderListing() {
            var _filter = {
                "SHP_FK": shpBuyerViewOrderCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": orderApiConfig.Entities.BuyerOrder.API.findall.FilterID
            };

            apiService.post("eAxisAPI", orderApiConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    shpBuyerViewOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            if (obj.OrderType == 'POR') {
                $window.open("#/EA/single-record-view/order-view?q=" + _queryString, "_blank");
            } else if (obj.OrderType == 'DOR') {
                $window.open("#/EA/single-record-view/delivery-order-view?q=" + _queryString, "_blank");
            }
        }


        Init();
    }
})();