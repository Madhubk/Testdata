/*
    Page :Confirm Trans Departure
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolConfirmTranDepartGlbController", ExportSeaConsolConfirmTranDepartGlbController);

    ExportSeaConsolConfirmTranDepartGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolConfirmTranDepartGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolConfirmTranDepartGlbCtrl = this;

        function Init() {
            ExportSeaConsolConfirmTranDepartGlbCtrl.ePage = {
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

            ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolConfirmTranDepartGlbCtrl.taskObj) {
                ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolConfirmTranDepartGlbCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaConsolConfirmTranDepartGlbCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();