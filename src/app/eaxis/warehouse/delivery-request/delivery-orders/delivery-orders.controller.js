(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryOrdersController", DeliveryOrdersController);

    DeliveryOrdersController.$inject = ["apiService", "appConfig", "deliveryConfig", "helperService", "$injector", "warehouseConfig"];

    function DeliveryOrdersController(apiService, appConfig, deliveryConfig, helperService, $injector, warehouseConfig) {

        var DeliveryOrdersCtrl = this

        function Init() {

            var currentDelivery = DeliveryOrdersCtrl.currentDelivery[DeliveryOrdersCtrl.currentDelivery.label].ePage.Entities;

            DeliveryOrdersCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Orders",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDelivery,
            };

            DeliveryOrdersCtrl.ePage.Masters.Config = $injector.get("deliveryConfig");
            DeliveryOrdersCtrl.ePage.Masters.getOutwardList = getOutwardList;
            getOutwardList();
        }
        // get Orders which is created against the Delivery line
        function getOutwardList() {
            deliveryConfig.TempOutwardPK = "";
            deliveryConfig.CallOutwardFunction = false;
            var _filter = {
                "WOD_Parent_FK": DeliveryOrdersCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsOutward.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsOutward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryOrdersCtrl.ePage.Masters.DeliveryOrders = response.data.Response;
                    DeliveryOrdersCtrl.ePage.Masters.TempOutwardPK = "";
                    angular.forEach(DeliveryOrdersCtrl.ePage.Masters.DeliveryOrders, function (value, key) {
                        DeliveryOrdersCtrl.ePage.Masters.TempOutwardPK = DeliveryOrdersCtrl.ePage.Masters.TempOutwardPK + value.PK + ",";
                    });
                    DeliveryOrdersCtrl.ePage.Masters.TempOutwardPK = DeliveryOrdersCtrl.ePage.Masters.TempOutwardPK.slice(0, -1);
                    deliveryConfig.TempOutwardPK = DeliveryOrdersCtrl.ePage.Masters.TempOutwardPK;
                }
            });
        }

        Init();
    }

})();
