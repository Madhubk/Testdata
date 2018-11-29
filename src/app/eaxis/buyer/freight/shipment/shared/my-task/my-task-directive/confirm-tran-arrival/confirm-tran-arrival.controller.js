/*
    Page :Confirm Trans Arrival
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmTranArrivalController", ConfirmTranArrivalController);

    ConfirmTranArrivalController.$inject = ["apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ConfirmTranArrivalController(apiService, helperService, appConfig, myTaskActivityConfig) {
        var ConfirmTranArrivalCtrl = this;

        function Init() {
            ConfirmTranArrivalCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            ConfirmTranArrivalCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmTranArrivalCtrl.taskObj) {
                ConfirmTranArrivalCtrl.ePage.Masters.TaskObj = ConfirmTranArrivalCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ConfirmTranArrivalCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ConfirmTranArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ConfirmTranArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmTranArrivalCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ConfirmTranArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConfirmTranArrivalCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();