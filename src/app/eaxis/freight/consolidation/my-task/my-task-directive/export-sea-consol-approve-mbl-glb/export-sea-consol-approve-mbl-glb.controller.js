/*
    Page : MBL Approval
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolApproveMBLGlbController", ExportSeaConsolApproveMBLGlbController);

    ExportSeaConsolApproveMBLGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolApproveMBLGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolApproveMBLGlbCtrl = this;

        function Init() {
            ExportSeaConsolApproveMBLGlbCtrl.ePage = {
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

            ExportSeaConsolApproveMBLGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolApproveMBLGlbCtrl.taskObj) {
                ExportSeaConsolApproveMBLGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolApproveMBLGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolApproveMBLGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolApproveMBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolApproveMBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolApproveMBLGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();