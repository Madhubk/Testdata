(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupOrdersController", PickupOrdersController);

    PickupOrdersController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "pickupConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function PickupOrdersController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, pickupConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation) {

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
            getOutwardList();
        }

        function getOutwardList() {
            var _filter = {
                "WOD_Parent_FK": PickupOrdersCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsOutwardList.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupOrdersCtrl.ePage.Entities.Header.Data.PickupOrders = response.data.Response;
                    PickupOrdersCtrl.ePage.Masters.TempOutwardPK = "";
                    angular.forEach(PickupOrdersCtrl.ePage.Entities.Header.Data.PickupOrders, function (value, key) {
                        PickupOrdersCtrl.ePage.Masters.TempOutwardPK = PickupOrdersCtrl.ePage.Masters.TempOutwardPK + value.PK + ",";
                    });
                    PickupOrdersCtrl.ePage.Masters.TempOutwardPK = PickupOrdersCtrl.ePage.Masters.TempOutwardPK.slice(0, -1);
                    pickupConfig.TempOutwardPK = PickupOrdersCtrl.ePage.Masters.TempOutwardPK;
                }
            });
        }

        Init();
    }

})();
