(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PartiesDetailsController", PartiesDetailsController);

        PartiesDetailsController.$inject = ["apiService", "appConfig"];

    function PartiesDetailsController(apiService, appConfig) {
        /* jshint validthis: true */
        var PartiesDetailsCtrl = this;

        function Init() {
            PartiesDetailsCtrl.ePage = {
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
            PartiesDetailsCtrl.ePage.Masters.ShipmentEntityObj = PartiesDetailsCtrl.currentObj;
            PartiesDetailsCtrl.ePage.Entities.Header.Data = PartiesDetailsCtrl.currentObj;

            if (PartiesDetailsCtrl.ePage.Masters.ShipmentEntityObj) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + PartiesDetailsCtrl.ePage.Masters.ShipmentEntityObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        PartiesDetailsCtrl.ePage.Entities.Header.Data = response.data.Response;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        Init();
    }
})();