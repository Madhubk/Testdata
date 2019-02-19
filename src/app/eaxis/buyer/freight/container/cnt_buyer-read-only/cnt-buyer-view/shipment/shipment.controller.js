(function () {
    "use strict";

    angular
        .module("Application")
        .controller("cntBuyerViewShipmentController", cntBuyerViewShipmentController);

    cntBuyerViewShipmentController.$inject = ["helperService", "appConfig", "apiService"];

    function cntBuyerViewShipmentController(helperService, appConfig, apiService) {
        /* jshint validthis: true */
        var cntBuyerViewShipmentCtrl = this;

        function Init() {
            console.log(cntBuyerViewShipmentCtrl)
            var obj = cntBuyerViewShipmentCtrl.obj[cntBuyerViewShipmentCtrl.obj.label].ePage.Entities;
            cntBuyerViewShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "ShipmentView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };
           GetOrderListing();
        }
        function GetOrderListing() {
            apiService.get("eAxisAPI", appConfig.Entities.buyerShipmentList.API.GetById.Url + cntBuyerViewShipmentCtrl.ePage.Entities.Header.Data.Response.ShipmentPK).then(function (response) {
                if (response.data.Response) {
                    cntBuyerViewShipmentCtrl.ePage.Entities.Header.Data.Shipment= response.data.Response;
                }});
        }
        Init();
    }
})();