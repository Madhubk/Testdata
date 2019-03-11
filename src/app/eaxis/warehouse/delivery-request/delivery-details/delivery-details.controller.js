(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryDetailsController", DeliveryDetailsController);

    DeliveryDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "deliveryConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function DeliveryDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, deliveryConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation) {

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
                "FilterID": appConfig.Entities.WmsWorkOrderLine.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsWorkOrderLine.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryDetailsCtrl.ePage.Masters.DeliveryOrdersLine = response.data.Response;
                }
            });
        }

        Init();
    }

})();
