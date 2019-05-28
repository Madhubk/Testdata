(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupDetailsController", PickupDetailsController);

    PickupDetailsController.$inject = ["apiService", "appConfig", "pickupConfig", "helperService", "toastr", "$filter", "$injector", "warehouseConfig"];

    function PickupDetailsController(apiService, appConfig, pickupConfig, helperService, toastr, $filter, $injector, warehouseConfig) {

        var PickupDetailsCtrl = this

        function Init() {

            var currentPickup = PickupDetailsCtrl.currentPickup[PickupDetailsCtrl.currentPickup.label].ePage.Entities;

            PickupDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickup,
            };

            PickupDetailsCtrl.ePage.Masters.Config = $injector.get("pickupConfig");
            PickupDetailsCtrl.ePage.Masters.getInwardLineList = getInwardLineList;
        }

        function getInwardLineList() {
            var _filter = {
                "WOD_FK_IN": pickupConfig.TempInwardPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsWorkOrderLine.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsWorkOrderLine.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupDetailsCtrl.ePage.Masters.PickupOrdersLine = response.data.Response;
                }
            });
        }

        Init();
    }

})();
