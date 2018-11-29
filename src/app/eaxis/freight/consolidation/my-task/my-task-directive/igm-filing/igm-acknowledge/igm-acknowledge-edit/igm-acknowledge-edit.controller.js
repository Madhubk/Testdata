/*
    Page : IGM Acknowledge
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IGMAcknowledgementEditController", IGMAcknowledgementEditController);

    IGMAcknowledgementEditController.$inject = ["helperService", "$q", "appConfig", "apiService", "toastr"];

    function IGMAcknowledgementEditController(helperService, $q, appConfig, apiService, toastr) {
        var IGMAcknowledgeEditDirCtrl = this;

        function Init() {
            IGMAcknowledgeEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "IGM_Acknowledge",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            IGMAcknowledgeEditDirCtrl.ePage.Masters.emptyText = "-";
            IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj = IGMAcknowledgeEditDirCtrl.taskObj;

            IGMAcknowledgeEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IGMAcknowledgeEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
            IGMAcknowledgeEditDirCtrl.ePage.Masters.Complete = Complete;

            GetEntityObj();
        }


        function GetEntityObj() {
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Meta": {}
                    }
                }
            };
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    IGMAcknowledgeEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
                    StandardMenuConfig();
                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                            ePage: _exports
                        },
                        label: response.data.Response.UIShipmentHeader.ShipmentNo,
                        code: response.data.Response.UIShipmentHeader.ShipmentNo,
                        isNew: false
                    };
                    IGMAcknowledgeEditDirCtrl.currentShipment = obj;
                } else {
                    console.log("Empty New Shipment response");
                }
            });
        }

        function StandardMenuConfig() {
            IGMAcknowledgeEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.ProcessName,
                "EntityRefKey": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true,
                "RowObj": IGMAcknowledgeEditDirCtrl.ePage.Entities.Header.Data
            };

            IGMAcknowledgeEditDirCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                // IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                // IsDisableCount: true,
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
            IGMAcknowledgeEditDirCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function Complete() {
            IGMAcknowledgeEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IGMAcknowledgeEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait";
            SaveOnly();
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: IGMAcknowledgeEditDirCtrl.ePage.Masters.TaskObj
                    };

                    IGMAcknowledgeEditDirCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                IGMAcknowledgeEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                IGMAcknowledgeEditDirCtrl.ePage.Masters.CompleteBtnText = "complete";
                deferred.resolve(response);
                return deferred.promise;
            });
        }

        Init();
    }
})();