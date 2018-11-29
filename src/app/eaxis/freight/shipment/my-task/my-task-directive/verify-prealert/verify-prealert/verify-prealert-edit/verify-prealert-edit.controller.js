/*
    Page : Verify PreAlert Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifyPreAlertEditController", VerifyPreAlertEditController);

    VerifyPreAlertEditController.$inject = ["helperService", "$q", "appConfig", "apiService", "authService", "APP_CONSTANT", "toastr"];

    function VerifyPreAlertEditController(helperService, $q, appConfig, apiService, authService, APP_CONSTANT, toastr) {
        var VerifyPreAlertEditDirCtrl = this;

        function Init() {
            VerifyPreAlertEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Verify_Pre_Alert",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            VerifyPreAlertEditDirCtrl.ePage.Masters.emptyText = "-";
            VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj = VerifyPreAlertEditDirCtrl.taskObj;

            // DatePicker
            VerifyPreAlertEditDirCtrl.ePage.Masters.DatePicker = {};
            VerifyPreAlertEditDirCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            VerifyPreAlertEditDirCtrl.ePage.Masters.DatePicker.isOpen = [];
            VerifyPreAlertEditDirCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            VerifyPreAlertEditDirCtrl.ePage.Masters.DropDownMasterList = {};
            VerifyPreAlertEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            VerifyPreAlertEditDirCtrl.ePage.Masters.CompleteBtnText = "Send For PreAlert";
            VerifyPreAlertEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            VerifyPreAlertEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            VerifyPreAlertEditDirCtrl.ePage.Masters.Complete = Complete;
            // Callback
            var _isEmpty = angular.equals({}, VerifyPreAlertEditDirCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
            GetEntityObj();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            VerifyPreAlertEditDirCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    VerifyPreAlertEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
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
                    VerifyPreAlertEditDirCtrl.currentShipment = obj;
                } else {
                    console.log("Empty New Shipment response");
                }
            });
        }
        function GetShipmentListing() {
            var _filter = {
                "SHP_FK": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifyPreAlertEditDirCtrl.ePage.Masters.ConShpObj = response.data.Response;
                    if (VerifyPreAlertEditDirCtrl.ePage.Masters.ConShpObj.length > 0) {
                        VerifyPreAlertEditDirCtrl.ePage.Masters.ConShpObj.map(function (value, key) {
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
                        VerifyPreAlertEditDirCtrl.ePage.Entities.Header.ConData = response.data.Response;
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        VerifyPreAlertEditDirCtrl.currentConsol = obj;
                    }
                });
            }
        }

        function StandardMenuConfig() {
            VerifyPreAlertEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.ProcessName,
                "EntityRefKey": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true,
                "RowObj": VerifyPreAlertEditDirCtrl.ePage.Entities.Header.Data
            };

            VerifyPreAlertEditDirCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
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
            VerifyPreAlertEditDirCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function Complete() {
            VerifyPreAlertEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            VerifyPreAlertEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait";
            SaveOnly();
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: VerifyPreAlertEditDirCtrl.ePage.Masters.TaskObj
                    };

                    VerifyPreAlertEditDirCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                VerifyPreAlertEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                VerifyPreAlertEditDirCtrl.ePage.Masters.CompleteBtnText = "complete";
                deferred.resolve(response);
                return deferred.promise;
            });
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["PRODTYPE"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        VerifyPreAlertEditDirCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        VerifyPreAlertEditDirCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        Init();
    }
})();