(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupOrdersController", PickupOrdersController);

    PickupOrdersController.$inject = ["apiService", "appConfig", "pickupConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation", "warehouseConfig"];

    function PickupOrdersController(apiService, appConfig, pickupConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation, warehouseConfig) {

        var PickupOrdersCtrl = this

        function Init() {

            var currentPickup = PickupOrdersCtrl.currentPickup[PickupOrdersCtrl.currentPickup.label].ePage.Entities;

            PickupOrdersCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Orders",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickup,
            };

            PickupOrdersCtrl.ePage.Masters.Config = $injector.get("pickupConfig");
            PickupOrdersCtrl.ePage.Masters.getInwardList = getInwardList;
            getInwardList();
        }

        function getInwardList() {
            pickupConfig.CallInwardFunction = false;
            pickupConfig.TempInwardPK = "";
            var _filter = {
                "WOD_Parent_FK": PickupOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsInward.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupOrdersCtrl.ePage.Masters.PickupOrders = response.data.Response;
                    PickupOrdersCtrl.ePage.Masters.TempInwardPK = "";
                    angular.forEach(PickupOrdersCtrl.ePage.Masters.PickupOrders, function (value, key) {
                        PickupOrdersCtrl.ePage.Masters.TempInwardPK = PickupOrdersCtrl.ePage.Masters.TempInwardPK + value.PK + ",";
                    });
                    PickupOrdersCtrl.ePage.Masters.TempInwardPK = PickupOrdersCtrl.ePage.Masters.TempInwardPK.slice(0, -1);
                    pickupConfig.TempInwardPK = PickupOrdersCtrl.ePage.Masters.TempInwardPK;
                }
            });
        }

        Init();
    }

})();
