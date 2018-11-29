/*
    Page : Prepare HBL 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentGeneralController", ShipmentGeneralController);

    ShipmentGeneralController.$inject = ["$window", "apiService", "helperService", "appConfig"];

    function ShipmentGeneralController($window, apiService, helperService, appConfig) {
        var ShpGeneralCtrl = this;

        function Init() {
            ShpGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                },
            };

            ShipmentInit();
        }

        function ShipmentInit() {
            ShpGeneralCtrl.ePage.Masters.ShipmentObj = ShpGeneralCtrl.currentObj;
            ShpGeneralCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            GetEntityObj();
        }

        function GetEntityObj() {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ShpGeneralCtrl.ePage.Masters.ShipmentObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ShpGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                } else {
                    console.log("Empty New Shipment response");
                }
            });
        }

        function SingleRecordView() {
            var _queryString = {
                PK: ShpGeneralCtrl.ePage.Masters.ShipmentObj.EntityRefKey,
                Code: ShpGeneralCtrl.ePage.Masters.ShipmentObj.KeyReference
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }

        Init();
    }
})();