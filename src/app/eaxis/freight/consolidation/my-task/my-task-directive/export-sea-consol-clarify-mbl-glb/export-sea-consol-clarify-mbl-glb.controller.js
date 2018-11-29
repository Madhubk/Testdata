/*
    Page :Clarify MBL
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaConsolClarifyMBLGlbController", ExportSeaConsolClarifyMBLGlbController);

    ExportSeaConsolClarifyMBLGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportSeaConsolClarifyMBLGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportSeaConsolClarifyMBLGlbCtrl = this;

        function Init() {
            ExportSeaConsolClarifyMBLGlbCtrl.ePage = {
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

            ExportSeaConsolClarifyMBLGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolClarifyMBLGlbCtrl.taskObj) {
                ExportSeaConsolClarifyMBLGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolClarifyMBLGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolClarifyMBLGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaConsolClarifyMBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExportSeaConsolClarifyMBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolClarifyMBLGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();