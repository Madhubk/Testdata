/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportShipmentDetailsGlbController", ExportShipmentDetailsGlbController);

    ExportShipmentDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "authService", "APP_CONSTANT"];

    function ExportShipmentDetailsGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, authService, APP_CONSTANT) {
        var ExportShipmentGlbCtrl = this;

        function Init() {
            ExportShipmentGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ExportShipmentGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ExportShipmentGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ExportShipmentGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
                GetShipmentListing();
            }

        }

        function GetShipmentListing() {
            var _filter = {
                "CON_FK": ExportShipmentGlbCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GetRelatedShipmentDetails(response.data.Response);
                    // ExportShipmentGlbCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                }
            });
        }

        function GetRelatedShipmentDetails(shpFkList) {
            var dynamicFindAllInput = [];

            shpFkList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "SHP_PKS",
                    "value": value.SHP_FK
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            };
            if (dynamicFindAllInput.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ExportShipmentGlbCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    }
                });
            }
        }


        Init();
    }
})();