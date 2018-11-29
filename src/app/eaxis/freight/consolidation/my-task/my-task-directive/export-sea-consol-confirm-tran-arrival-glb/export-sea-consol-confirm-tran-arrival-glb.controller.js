/*
    Page :Confirm Trans Arrival
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolConfirmTranArrivalGlbController", ExportSeaConsolConfirmTranArrivalGlbController);

    ExportSeaConsolConfirmTranArrivalGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolConfirmTranArrivalGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolConfirmTranArrivalGlbCtrl = this;

        function Init() {
            ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage = {
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

            ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolConfirmTranArrivalGlbCtrl.taskObj) {
                ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolConfirmTranArrivalGlbCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaConsolConfirmTranArrivalGlbCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();