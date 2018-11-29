/*
    Page : SI Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LinerDeliveryController", LinerDeliveryController);

    LinerDeliveryController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function LinerDeliveryController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var LinerDeliveryDirCtrl = this;

        function Init() {
            LinerDeliveryDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Liner_Delivery_Order",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            LinerDeliveryDirCtrl.ePage.Masters.emptyText = "-";
            LinerDeliveryDirCtrl.ePage.Masters.TaskObj = LinerDeliveryDirCtrl.taskObj;

            GetEntityObj();
        }

        function GetEntityObj() {
            if (LinerDeliveryDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + LinerDeliveryDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        LinerDeliveryDirCtrl.ePage.Masters.EntityObj = response.data.Response;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        Init();
    }
})();