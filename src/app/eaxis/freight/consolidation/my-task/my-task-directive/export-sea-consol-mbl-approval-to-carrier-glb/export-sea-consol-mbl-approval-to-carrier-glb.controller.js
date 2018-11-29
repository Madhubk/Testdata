/*
    Page :Approve MBL
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExpSeaConsolMblApprovalToCarrierGlbController", ExpSeaConsolMblApprovalToCarrierGlbController);

    ExpSeaConsolMblApprovalToCarrierGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExpSeaConsolMblApprovalToCarrierGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExpSeaConsolMblApprovalToCarrierGlbDirCtrl = this;

        function Init() {
            ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.ePage = {
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

            ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.ePage.Masters.emptyText = "-";
            if (ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.taskObj) {
                ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.ePage.Masters.TaskObj = ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.taskObj;
                GetEntityObj();
            } else {
                ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExpSeaConsolMblApprovalToCarrierGlbDirCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();