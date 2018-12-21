(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShpCargoPickupDateController", ShpCargoPickupDateController);

    ShpCargoPickupDateController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ShpCargoPickupDateController($scope, authService, apiService, helperService, appConfig) {
        var ShpCargoPickupDateCtrl = this;

        function Init() {
            ShpCargoPickupDateCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_CargoPickup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ShpCargoPickupDateCtrl.ePage.Masters.Eventobj = ShpCargoPickupDateCtrl.eventObj;
        }
        Init();
    }
})();