/*
    Page : IGM Filing Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IGMFilingEditController", IGMFilingEditController);

    IGMFilingEditController.$inject = ["helperService", "$q", "appConfig", "apiService", "toastr"];

    function IGMFilingEditController(helperService, $q, appConfig, apiService, toastr) {
        var IGMFilingEditDirCtrl = this;

        function Init() {
            IGMFilingEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "IGM_Filing",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            IGMFilingEditDirCtrl.ePage.Masters.emptyText = "-";
            IGMFilingEditDirCtrl.ePage.Masters.TaskObj = IGMFilingEditDirCtrl.taskObj;

            IGMFilingEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IGMFilingEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
            IGMFilingEditDirCtrl.ePage.Masters.Complete = Complete;
            GetEntityObj();
            GetShipmentListing();
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
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + IGMFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    IGMFilingEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
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
                    IGMFilingEditDirCtrl.currentShipment = obj;
                } else {
                    console.log("Empty New Shipment response");
                }
            });
        }

        function GetShipmentListing() {
            var _filter = {
                "SHP_FK": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    IGMFilingEditDirCtrl.ePage.Masters.ConShpObj = response.data.Response;
                    if (IGMFilingEditDirCtrl.ePage.Masters.ConShpObj.length > 0) {
                        IGMFilingEditDirCtrl.ePage.Masters.ConShpObj.map(function (value, key) {
                            GetConList(value.CON_FK);
                        });
                    }
                }
            });
        }

        function GetConList(data) {
            if (data) {
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": {},
                            "Meta": {}
                        }
                    }
                };
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + data).then(function (response) {
                    if (response.data.Response) {
                        IGMFilingEditDirCtrl.ePage.Entities.Header.ConData = response.data.Response;
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        IGMFilingEditDirCtrl.currentConsol = obj;
                    }
                });
            }
        }

        function StandardMenuConfig() {
            IGMFilingEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.ProcessName,
                "EntityRefKey": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true,
                "RowObj": IGMFilingEditDirCtrl.ePage.Entities.Header.Data
            };

            IGMFilingEditDirCtrl.ePage.Masters.StandardConfigInput = {
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
            IGMFilingEditDirCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function Complete() {
            IGMFilingEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IGMFilingEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait";
            SaveOnly();
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": IGMFilingEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: IGMFilingEditDirCtrl.ePage.Masters.TaskObj
                    };

                    IGMFilingEditDirCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                IGMFilingEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                IGMFilingEditDirCtrl.ePage.Masters.CompleteBtnText = "complete";
                deferred.resolve(response);
                return deferred.promise;
            });
        }

        Init();
    }
})();