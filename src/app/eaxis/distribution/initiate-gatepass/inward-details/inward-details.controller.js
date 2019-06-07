(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardDetailsController", InwardDetailsController);

    InwardDetailsController.$inject = ["apiService", "appConfig", "helperService", "gatepassConfig", "warehouseConfig"];

    function InwardDetailsController(apiService, appConfig, helperService, gatepassConfig, warehouseConfig) {

        var InwardDetailsCtrl = this;

        function Init() {
            var currentGatepass = InwardDetailsCtrl.currentGatepass[InwardDetailsCtrl.currentGatepass.label].ePage.Entities;
            InwardDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatepass
            };

            InwardDetailsCtrl.ePage.Masters.Config = gatepassConfig;

            getInwardDetails();
        }

        function getInwardDetails() {
            var _filter = {
                "TGP_FK": InwardDetailsCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsInward.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        InwardDetailsCtrl.ePage.Masters.InwardDetails = response.data.Response;
                        InwardDetailsCtrl.ePage.Masters.IsShowInwardDetails = true;
                    } else {
                        InwardDetailsCtrl.ePage.Masters.IsShowInwardDetails = false;
                    }
                }
            });
        }

        Init();
    }

})();