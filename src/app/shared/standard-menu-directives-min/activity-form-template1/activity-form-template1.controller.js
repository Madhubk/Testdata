(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityFormTemplate1Controller", ActivityFormTemplate1Controller);

    ActivityFormTemplate1Controller.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ActivityFormTemplate1Controller($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ActivityFormTemplate1Ctrl = this;
        
        function Init() {
            ActivityFormTemplate1Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Form_Template1",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
            ActivityFormTemplate1Ctrl.ePage.Masters.emptyText = "-";
            StandardMenuConfig();
        }

        function StandardMenuConfig() {
            ActivityFormTemplate1Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityFormTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityFormTemplate1Ctrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };

            ActivityFormTemplate1Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }


        Init();
    }
})();