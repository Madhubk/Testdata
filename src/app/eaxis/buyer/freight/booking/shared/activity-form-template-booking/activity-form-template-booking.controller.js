(function () {
    "use strict";

    angular
        .module("Application")
        .controller("activityFormTemplateBookingController", activityFormTemplateBookingController);

    activityFormTemplateBookingController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function activityFormTemplateBookingController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var activityFormTemplateBookingCtrl = this;

        function Init() {
            activityFormTemplateBookingCtrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Form_Template1",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            activityFormTemplateBookingCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
            activityFormTemplateBookingCtrl.ePage.Masters.emptyText = "-";
            StandardMenuConfig();
            activityFormTemplateBookingCtrl.ePage.Masters.currentShipment = myTaskActivityConfig.Entities.Shipment;
            activityFormTemplateBookingCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
        }

        function StandardMenuConfig() {
            activityFormTemplateBookingCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": activityFormTemplateBookingCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": activityFormTemplateBookingCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": activityFormTemplateBookingCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": activityFormTemplateBookingCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": activityFormTemplateBookingCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": activityFormTemplateBookingCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": activityFormTemplateBookingCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            activityFormTemplateBookingCtrl.ePage.Masters.StandardConfigInput = {
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

            activityFormTemplateBookingCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }


        Init();
    }
})();