/*
    Page : SI FILING -EDIT 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LinerDeliveryEditController", LinerDeliveryEditController);

    LinerDeliveryEditController.$inject = ["$rootScope", "$q", "$injector", "helperService", "appConfig", "apiService", "APP_CONSTANT", "toastr", "authService", "errorWarningService"];

    function LinerDeliveryEditController($rootScope, $q, $injector, helperService, appConfig, apiService, APP_CONSTANT, toastr, authService, errorWarningService) {
        var LinerDeliveryEditDirCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");
        function Init() {
            LinerDeliveryEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "SI_Filing_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            initSiFiling();
        }

        // =============================== SI Filing Edit Start =================================
        function initSiFiling() {
            // DatePicker
            LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj = LinerDeliveryEditDirCtrl.taskObj;
            LinerDeliveryEditDirCtrl.ePage.Masters.Save = Save;
            LinerDeliveryEditDirCtrl.ePage.Masters.Complete = Complete;
            LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = {}
            LinerDeliveryEditDirCtrl.ePage.Masters.DropDownMasterList = {};
            LinerDeliveryEditDirCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            LinerDeliveryEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            LinerDeliveryEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            LinerDeliveryEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            LinerDeliveryEditDirCtrl.ePage.Masters.CompleteBtnText = "Confirm SI Filing";
            LinerDeliveryEditDirCtrl.ePage.Masters.DatePicker = {};
            LinerDeliveryEditDirCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            LinerDeliveryEditDirCtrl.ePage.Masters.DatePicker.isOpen = [];
            LinerDeliveryEditDirCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            LinerDeliveryEditDirCtrl.ePage.Masters.JobDocumentCount = null;
            // Callback
            var _isEmpty = angular.equals({}, LinerDeliveryEditDirCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
            GetEntityObj();
            StandardMenuConfig();
            //initValidation();
        }
        function GetEntityObj() {
            if (LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": {},
                            "Meta": {}
                        }
                    }
                }
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        LinerDeliveryEditDirCtrl.currentConsol = obj;
                        console.log(LinerDeliveryEditDirCtrl.currentConsol);
                        LinerDeliveryEditDirCtrl.currentConsolHeader = LinerDeliveryEditDirCtrl.currentConsol[LinerDeliveryEditDirCtrl.currentConsol.label].ePage.Entities.Header.Data.UIConConsolHeader;
                        LinerDeliveryEditDirCtrl.ePage.Entities = LinerDeliveryEditDirCtrl.currentConsol[LinerDeliveryEditDirCtrl.currentConsol.label].ePage.Entities;
                        LinerDeliveryEditDirCtrl.ePage.Masters.CntList = LinerDeliveryEditDirCtrl.currentConsol[LinerDeliveryEditDirCtrl.currentConsol.label].ePage.Entities.Header.Data.UICntContainers;
                        LinerDeliveryEditDirCtrl.ePage.Masters.ConsolDetails = response.data.Response.UIConShpMappings;
                        GetShipmentListing();
                    }
                });
            }
        }
        function GetShipmentListing() {
            var _filter = {
                "CON_FK": LinerDeliveryEditDirCtrl.currentConsol[LinerDeliveryEditDirCtrl.currentConsol.label].ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    LinerDeliveryEditDirCtrl.currentConsol[LinerDeliveryEditDirCtrl.currentConsol.label].ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    $rootScope.GetRotingList();
                    var shpFkList = response.data.Response;
                    GetJobPackLinesDetails(shpFkList);
                }
            });
        }
        function GetJobPackLinesDetails(shpFkList) {
            LinerDeliveryEditDirCtrl.ePage.Masters.SHP_FK = "";
            angular.forEach(shpFkList, function (value, key) {
                LinerDeliveryEditDirCtrl.ePage.Masters.SHP_FK += value.SHP_FK + ",";
            });
            LinerDeliveryEditDirCtrl.ePage.Masters.SHP_FK = LinerDeliveryEditDirCtrl.ePage.Masters.SHP_FK.slice(0, -1);
            var _filter = {
                "SHP_FKS": LinerDeliveryEditDirCtrl.ePage.Masters.SHP_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response;
                }
            });
        }
        function initValidation() {
            ValidationFindall();
        }

        function ValidationFindall() {
            if (LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj) {
                errorWarningService.AddModuleToList("MyTask", LinerDeliveryEditDirCtrl.taskObj.PSI_InstanceNo);
                var _ValidationFilterObj = {
                    ModuleCode: "CON",
                    SubModuleCode: "CON"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {
                });
                LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            }
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            LinerDeliveryEditDirCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["CON_TYPE", "CON_PAYMENT", "CON_SI_FILING_TYPE"];
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
                        LinerDeliveryEditDirCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        LinerDeliveryEditDirCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function Validation() {
            LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo, LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.SIFilingDate, 'E0009', false, undefined);
            LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo, LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.SIFilingType, 'E0011', false, undefined);
            var tempArray = []
            if (LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.SIFilingType == "CARRIER") {
                LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo, LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.SIFilingRefNo, 'E0010', false, undefined);
            }
            else
                LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo, true, 'E0010', false, undefined);
            if (LinerDeliveryEditDirCtrl.ePage.Masters.DocListSource.length > 0) {
                LinerDeliveryEditDirCtrl.ePage.Masters.DocListSource.map(function (val, key) {
                    if (val.DocumentType == 'SFT') {
                        tempArray.push(val);
                    }
                });
                if (tempArray.length > 0) {
                    errorWarningService.OnFieldValueChange("MyTask", LinerDeliveryEditDirCtrl.taskObj.PSI_InstanceNo, true, 'E0013', false, undefined);
                } else {
                    errorWarningService.OnFieldValueChange("MyTask", LinerDeliveryEditDirCtrl.taskObj.PSI_InstanceNo, false, 'E0013', false, undefined);
                }

            } else {
                errorWarningService.OnFieldValueChange("MyTask", LinerDeliveryEditDirCtrl.taskObj.PSI_InstanceNo, false, 'E0013', false, undefined);
            }
        }

        function Complete() {
            Validation();
            if (LinerDeliveryEditDirCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList.length == 0) {
                LinerDeliveryEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                LinerDeliveryEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                var _input = angular.copy(LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data);
                _input.UIConConsolHeader.IsModified = true;
                apiService.post("eAxisAPI", appConfig.Entities.ConsolList.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
                        SaveOnly().then(function (response) {
                            if (response.data.Status == "Success") {
                                toastr.success("Task Completed Successfully...!");
                                var _data = {
                                    IsCompleted: true,
                                    Item: LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj
                                };

                                LinerDeliveryEditDirCtrl.onComplete({
                                    $item: _data
                                });
                            } else {
                                toastr.error("Task Completion Failed...!");
                            }
                            LinerDeliveryEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                            LinerDeliveryEditDirCtrl.ePage.Masters.CompleteBtnText = "Confirm SI Filing";
                        });
                    } else {
                        toastr.error("Save Failed...!");
                    }
                });
            } else {
                ShowErrorWarningModal(LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo);
            }

        } function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "EntitySource": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "KeyReference": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "IsModified": true
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        function Save() {
            LinerDeliveryEditDirCtrl.ePage.Masters.SaveBtnText = "Please Wait...";
            LinerDeliveryEditDirCtrl.ePage.Masters.IsDisableSaveBtn = true;
            var _input = angular.copy(LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data);
            _input.UIConConsolHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ConsolList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    LinerDeliveryEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
                LinerDeliveryEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
                LinerDeliveryEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            });

        }
        function StandardMenuConfig() {
            LinerDeliveryEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": LinerDeliveryEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            LinerDeliveryEditDirCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
            };
        }
        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }
        // =============================== SI Filing Edit End =================================
        Init();
    }
})();