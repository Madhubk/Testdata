/*
    Page :FollowUp Empty Bond Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmptyBondEditController", EmptyBondEditController);

    EmptyBondEditController.$inject = ["helperService", "$q", "appConfig", "apiService", "toastr"];

    function EmptyBondEditController(helperService, $q, appConfig, apiService, toastr) {
        var EmptyBondEditDirCtrl = this;

        function Init() {
            EmptyBondEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Followup_Empty_Bond_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            EmptyBondEditDirCtrl.ePage.Masters.emptyText = "-";
            EmptyBondEditDirCtrl.ePage.Masters.TaskObj = EmptyBondEditDirCtrl.taskObj;

            EmptyBondEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            EmptyBondEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
            EmptyBondEditDirCtrl.ePage.Masters.Complete = Complete;

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
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + EmptyBondEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    EmptyBondEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
                    StandardMenuConfig();
                    GetShipmentListing();
                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                            ePage: _exports
                        },
                        label: response.data.Response.UIShipmentHeader.ShipmentNo,
                        code: response.data.Response.UIShipmentHeader.ShipmentNo,
                        isNew: false
                    };
                    EmptyBondEditDirCtrl.currentShipment = obj;
                } else {
                    console.log("Empty New Shipment response");
                }
            });
        }

        function GetShipmentListing() {
            var _filter = {
                "SHP_FK": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EmptyBondEditDirCtrl.ePage.Masters.ConShpObj = response.data.Response;
                    if (EmptyBondEditDirCtrl.ePage.Masters.ConShpObj.length > 0) {
                        EmptyBondEditDirCtrl.ePage.Masters.ConShpObj.map(function (value, key) {
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
                        EmptyBondEditDirCtrl.ePage.Entities.Header.ConData = response.data.Response;
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        EmptyBondEditDirCtrl.currentConsol = obj;
                    }
                });
            }
        }

        function StandardMenuConfig() {
            EmptyBondEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.ProcessName,
                "EntityRefKey": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true,
                "RowObj": EmptyBondEditDirCtrl.ePage.Entities.Header.Data
            };

            EmptyBondEditDirCtrl.ePage.Masters.StandardConfigInput = {
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
            EmptyBondEditDirCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function Complete() {
            EmptyBondEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            EmptyBondEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait";
            SaveOnly();
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": EmptyBondEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: EmptyBondEditDirCtrl.ePage.Masters.TaskObj
                    };

                    EmptyBondEditDirCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                EmptyBondEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                EmptyBondEditDirCtrl.ePage.Masters.CompleteBtnText = "complete";
                deferred.resolve(response);
                return deferred.promise;
            });
        }

        Init();
    }
})();