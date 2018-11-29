/*
    Page :Confirm Arrival
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolConfirmArrivalGlbController", ExportSeaConsolConfirmArrivalGlbController);

    ExportSeaConsolConfirmArrivalGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolConfirmArrivalGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolConfirmArrivalGlbCtrl = this;

        function Init() {
            ExportSeaConsolConfirmArrivalGlbCtrl.ePage = {
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

            ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolConfirmArrivalGlbCtrl.taskObj) {
                ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolConfirmArrivalGlbCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaConsolConfirmArrivalGlbCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();