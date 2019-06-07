(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryDetailsController", DeliveryDetailsController);

    DeliveryDetailsController.$inject = ["apiService", "appConfig", "deliveryConfig", "helperService", "toastr", "$filter", "$injector", "warehouseConfig"];

    function DeliveryDetailsController(apiService, appConfig, deliveryConfig, helperService, toastr, $filter, $injector, warehouseConfig) {

        var DeliveryDetailsCtrl = this

        function Init() {

            var currentDelivery = DeliveryDetailsCtrl.currentDelivery[DeliveryDetailsCtrl.currentDelivery.label].ePage.Entities;

            DeliveryDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Orders",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDelivery,
            };

            DeliveryDetailsCtrl.ePage.Masters.Config = $injector.get("deliveryConfig");
            DeliveryDetailsCtrl.ePage.Masters.getOutwardLineList = getOutwardLineList;
        }

        function getOutwardLineList() {
            var _filter = {
                "WOD_FK_IN": deliveryConfig.TempOutwardPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsWorkOrderLine.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsWorkOrderLine.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryDetailsCtrl.ePage.Masters.DeliveryOrdersLine = response.data.Response;
                }
            });
        }

        Init();
    }

})();
