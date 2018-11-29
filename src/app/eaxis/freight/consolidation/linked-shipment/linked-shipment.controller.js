(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LinkedShipmentController", LinkedShipmentController);

    LinkedShipmentController.$inject = ["$rootScope", "$timeout", "apiService", "appConfig", "helperService"];

    function LinkedShipmentController($rootScope, $timeout, apiService, appConfig, helperService) {
        /* jshint validthis: true */
        var LinkedShipmentCtrl = this;

        function Init() {
            var currentConsol = LinkedShipmentCtrl.currentObj[LinkedShipmentCtrl.currentObj.label].ePage.Entities;
            LinkedShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };

            LinkedShipmentCtrl.ePage.Masters.ConsolShipment = {};
            GetShipmentListing();
        }
        function GetShipmentListing() {
            var _filter = {
                "CON_FK": LinkedShipmentCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    LinkedShipmentCtrl.currentObj[LinkedShipmentCtrl.currentObj.label].ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    var shpFkList = response.data.Response;
                    GetRelatedShipmentDetails(shpFkList);
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
                        LinkedShipmentCtrl.currentObj[LinkedShipmentCtrl.currentObj.label].ePage.Entities.Header.Data.UIShipmentHeaders = response.data.Response;
                    }
                    GetShipmentDetails();
                });
            }
        }

        function GetShipmentDetails() {
            var _gridData = [];
            LinkedShipmentCtrl.ePage.Masters.ConsolShipment.GridData = undefined;
            $timeout(function () {
                if (LinkedShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.length > 0) {
                    LinkedShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeaders.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("ConsolShipment List is Empty");
                }

                LinkedShipmentCtrl.ePage.Masters.ConsolShipment.GridData = _gridData;
            });
        }
        Init();
    }
})();