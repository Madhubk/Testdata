(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentEntityDetailsController", ShipmentEntityDetailsController);

    ShipmentEntityDetailsController.$inject = ["apiService", "appConfig"];

    function ShipmentEntityDetailsController(apiService, appConfig) {
        /* jshint validthis: true */
        var ShipmentEntityDetailsCtrl = this;

        function Init() {
            ShipmentEntityDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Entity_Details",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                },
            };

            ShipmentEntityInit();
        }

        function ShipmentEntityInit() {
            ShipmentEntityDetailsCtrl.ePage.Masters.ShipmentEntityObj = ShipmentEntityDetailsCtrl.currentObj;

            if (ShipmentEntityDetailsCtrl.ePage.Masters.ShipmentEntityObj) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ShipmentEntityDetailsCtrl.ePage.Masters.ShipmentEntityObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ShipmentEntityDetailsCtrl.ePage.Entities.Header.Data = response.data.Response;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        Init();
    }
})();