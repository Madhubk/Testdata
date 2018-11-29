/*
    Page :Confirm Departure
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolConfirmDepartureGlbController", ExportSeaConsolConfirmDepartureGlbController);

    ExportSeaConsolConfirmDepartureGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolConfirmDepartureGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolConfirmDepartureGlbCtrl = this;

        function Init() {
            ExportSeaConsolConfirmDepartureGlbCtrl.ePage = {
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

            ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolConfirmDepartureGlbCtrl.taskObj) {
                ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolConfirmDepartureGlbCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaConsolConfirmDepartureGlbCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();