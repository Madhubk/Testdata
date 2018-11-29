(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PlanVGMFilingEditController", PlanVGMFilingEditController);

        PlanVGMFilingEditController.$inject = ["$q", "helperService", "APP_CONSTANT", "apiService", "appConfig", "toastr", "errorWarningService"];

    function PlanVGMFilingEditController($q, helperService, APP_CONSTANT, apiService, appConfig, toastr, errorWarningService) {
        var PlanVgmFilingEditDirCtrl = this;

        function Init() {
            PlanVgmFilingEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "PLAN_VGM_Filing",
                "Masters": {},
                "Meta": {},
                "Entities": {}
            };

            PlanVGMFilingInit();
        }
        function PlanVGMFilingInit() {
           
            PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj = PlanVgmFilingEditDirCtrl.taskObj;

            StandardMenuConfig();
            ValidationFindall();
        }
        function StandardMenuConfig() {
            PlanVgmFilingEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": PlanVgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }
        function ValidationFindall() {
            if (PlanVgmFilingEditDirCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", PlanVgmFilingEditDirCtrl.taskObj.PSI_InstanceNo);
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
            }
            // Error warning service
            PlanVgmFilingEditDirCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            PlanVgmFilingEditDirCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[PlanVgmFilingEditDirCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            PlanVgmFilingEditDirCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[PlanVgmFilingEditDirCtrl.taskObj.PSI_InstanceNo];
        }
        Init();
    }
})();