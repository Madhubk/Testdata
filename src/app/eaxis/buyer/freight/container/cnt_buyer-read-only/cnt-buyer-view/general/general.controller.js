(function () {
    "use strict";

    angular
        .module("Application")
        .controller("cntBuyerViewGeneralController", cntBuyerViewGeneralController);

    cntBuyerViewGeneralController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function cntBuyerViewGeneralController($window, helperService, appConfig, apiService) {
        /* jshint validthis: true */
        var cntBuyerViewGeneralCtrl = this;

        function Init() {
            
            var obj = cntBuyerViewGeneralCtrl.obj[cntBuyerViewGeneralCtrl.obj.label].ePage.Entities;
            cntBuyerViewGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "cntBuyerViewGeneral",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };
            GetShipmentDetails();
        }
      
        function GetShipmentDetails()
        {
            console.log(cntBuyerViewGeneralCtrl);
            apiService.get("eAxisAPI", appConfig.Entities.buyerShipmentList.API.GetById.Url + cntBuyerViewGeneralCtrl.ePage.Entities.Header.Data.Response.ShipmentPK).then(function (response) {
            if (response.data.Response) {

                cntBuyerViewGeneralCtrl.ePage.Entities.Header.Data.Shipment= response.data.Response;
            }});
        }
        
        Init();
    }
})();