(function () {
    "use strict";

    angular
        .module("Application")
        .controller("shpBuyerViewOrderController", shpBuyerViewOrderController);

    shpBuyerViewOrderController.$inject = ["helperService", "appConfig", "apiService"];

    function shpBuyerViewOrderController(helperService, appConfig, apiService) {
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
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    shpBuyerViewOrderCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }


        Init();
    }
})();