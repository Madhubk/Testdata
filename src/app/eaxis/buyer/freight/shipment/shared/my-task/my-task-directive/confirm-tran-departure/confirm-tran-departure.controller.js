/*
    Page :Confirm Trans Departure
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmTranDepartController", ConfirmTranDepartController);

    ConfirmTranDepartController.$inject = ["apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ConfirmTranDepartController(apiService, helperService, appConfig, myTaskActivityConfig) {
        var ConfirmTranDepartCtrl = this;

        function Init() {
            ConfirmTranDepartCtrl.ePage = {
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

            ConfirmTranDepartCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmTranDepartCtrl.taskObj) {
                ConfirmTranDepartCtrl.ePage.Masters.TaskObj = ConfirmTranDepartCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ConfirmTranDepartCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ConfirmTranDepartCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ConfirmTranDepartCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmTranDepartCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ConfirmTranDepartCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConfirmTranDepartCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();