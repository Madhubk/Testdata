/*
    Page :Approve MBL HBL
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolApproveMBLHBLGlbController", ExportSeaConsolApproveMBLHBLGlbController);

    ExportSeaConsolApproveMBLHBLGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolApproveMBLHBLGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolApproveMBLHBLGlbCtrl = this;

        function Init() {
            ExportSeaConsolApproveMBLHBLGlbCtrl.ePage = {
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

            ExportSeaConsolApproveMBLHBLGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolApproveMBLHBLGlbCtrl.taskObj) {
                ExportSeaConsolApproveMBLHBLGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolApproveMBLHBLGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolApproveMBLHBLGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolApproveMBLHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolApproveMBLHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolApproveMBLHBLGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();