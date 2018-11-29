/*
    Page :Clarify MBL HBL
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolClarifyMBLHBLGlbController", ExportSeaConsolClarifyMBLHBLGlbController);

    ExportSeaConsolClarifyMBLHBLGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolClarifyMBLHBLGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolClarifyMBLHBLGlbCtrl = this;

        function Init() {
            ExportSeaConsolClarifyMBLHBLGlbCtrl.ePage = {
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

            ExportSeaConsolClarifyMBLHBLGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolClarifyMBLHBLGlbCtrl.taskObj) {
                ExportSeaConsolClarifyMBLHBLGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolClarifyMBLHBLGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolClarifyMBLHBLGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolClarifyMBLHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolClarifyMBLHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolClarifyMBLHBLGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();