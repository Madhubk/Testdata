/*
    Page :Confirm Arrival
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmArrivalController", ConfirmArrivalController);

    ConfirmArrivalController.$inject = ["apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ConfirmArrivalController(apiService, helperService, appConfig, myTaskActivityConfig) {
        var ConfirmArrivalCtrl = this;

        function Init() {
            ConfirmArrivalCtrl.ePage = {
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

            ConfirmArrivalCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmArrivalCtrl.taskObj) {
                ConfirmArrivalCtrl.ePage.Masters.TaskObj = ConfirmArrivalCtrl.taskObj;
                GetEntityObj();
                GetLegDetails();
            } else {
                ConfirmArrivalCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ConfirmArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ConfirmArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmArrivalCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetLegDetails() {
            var _filter = {
                "EntityRefKey": ConfirmArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConfirmArrivalCtrl.ePage.Masters.LegDetails = response.data.Response;
                }
            });
        };

        Init();
    }
})();