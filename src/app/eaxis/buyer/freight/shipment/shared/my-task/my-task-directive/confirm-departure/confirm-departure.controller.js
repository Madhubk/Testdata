/*
    Page :Confirm Departure
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmDepartureController", ConfirmDepartureController);

    ConfirmDepartureController.$inject = ["apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ConfirmDepartureController(apiService, helperService, appConfig, myTaskActivityConfig) {
        var ConfirmDepartureCtrl = this;

        function Init() {
            ConfirmDepartureCtrl.ePage = {
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

            ConfirmDepartureCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmDepartureCtrl.taskObj) {
                ConfirmDepartureCtrl.ePage.Masters.TaskObj = ConfirmDepartureCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ConfirmDepartureCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ConfirmDepartureCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ConfirmDepartureCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmDepartureCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ConfirmDepartureCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConfirmDepartureCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();