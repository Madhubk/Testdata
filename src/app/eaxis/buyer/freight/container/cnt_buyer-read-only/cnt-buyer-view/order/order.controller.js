(function () {
    "use strict";

    angular
        .module("Application")
        .controller("cntBuyerViewOrderController", cntBuyerViewOrderController);

    cntBuyerViewOrderController.$inject = ["helperService", "orderApiConfig", "apiService","appConfig"];

    function cntBuyerViewOrderController(helperService, orderApiConfig, apiService,appConfig) {
        /* jshint validthis: true */
        var cntBuyerViewOrderCtrl = this;

        function Init() {
            var obj = cntBuyerViewOrderCtrl.obj[cntBuyerViewOrderCtrl.obj.label].ePage.Entities;
            cntBuyerViewOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };
            GetOrderListing();
        }

        function GetOrderListing() {
            var _Input={
                "FilterID":"BPTRACKORDL",
                "SearchInput":[
                    {"FieldName":"ContainerNumber","value":cntBuyerViewOrderCtrl.ePage.Entities.Header.Data.Response.ContainerNo}
                ]}
            apiService.post("eAxisAPI", appConfig.Entities.BuyerTrackOrderLine.API.FindAll.Url ,_Input ).then(function (response) {
                if (response.data.Response) {
                    cntBuyerViewOrderCtrl.ePage.Entities.OrderLine=response.data.Response;
                    console.log(response.data.Response)
                }});
        }


        Init();
    }
})();