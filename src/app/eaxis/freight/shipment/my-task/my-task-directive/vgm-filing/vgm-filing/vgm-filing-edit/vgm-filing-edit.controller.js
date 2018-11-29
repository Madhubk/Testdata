(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VgmFilingEditController", VgmFilingEditController);

    VgmFilingEditController.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService"];

    function VgmFilingEditController(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService) {
        var VgmFilingEditDirCtrl = this;

        function Init() {
            VgmFilingEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Cargo_PickUp_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {}
            };
            VgmFilingEditDirCtrl.ePage.Masters.emptyText = "-";
            VgmFilingEditDirCtrl.ePage.Masters.TaskObj = VgmFilingEditDirCtrl.taskObj;
            VgmFilingEditDirCtrl.ePage.Masters.Complete = Complete;
            VgmFilingEditDirCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            // DatePicker
            VgmFilingEditDirCtrl.ePage.Masters.DatePicker = {};
            VgmFilingEditDirCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            VgmFilingEditDirCtrl.ePage.Masters.DatePicker.isOpen = [];
            VgmFilingEditDirCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            VgmFilingEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            VgmFilingEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
            if (VgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            VgmFilingEditDirCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (VgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + VgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        VgmFilingEditDirCtrl.ePage.Masters.EntityObj = response.data.Response;
                        initValidation();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function SaveEntity() {
            var _input = angular.copy(VgmFilingEditDirCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            _input.UIShpExtendedInfo.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": "",
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": ""

                }
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function StandardMenuConfig() {
            VgmFilingEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": VgmFilingEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function initValidation() {
            ValidationFindall();
        }

        function ValidationFindall() {
            if (VgmFilingEditDirCtrl.ePage.Masters.TaskObj) {
                errorWarningService.AddModuleToList("MyTask", VgmFilingEditDirCtrl.taskObj.PSI_InstanceNo);
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {
                });
                VgmFilingEditDirCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                VgmFilingEditDirCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[VgmFilingEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                VgmFilingEditDirCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[VgmFilingEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            }
        }

        function GeneralValidation($item) {
            var _input = $item;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("MyTask", VgmFilingEditDirCtrl.taskObj.PSI_InstanceNo, _input.UIShpExtendedInfo.CargoPickedUpDate, 'E11072', false, undefined);

            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function Complete() {
            GeneralValidation(VgmFilingEditDirCtrl.ePage.Masters.EntityObj).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[VgmFilingEditDirCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    VgmFilingEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                    VgmFilingEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                    SaveEntity();
                    SaveOnly().then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Task Completed Successfully...!");
                            var _data = {
                                IsCompleted: true,
                                Item: VgmFilingEditDirCtrl.ePage.Masters.TaskObj
                            };

                            VgmFilingEditDirCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                        }
                        VgmFilingEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        VgmFilingEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    });
                } else {
                    VgmFilingEditDirCtrl.ePage.Masters.ShowErrorWarningModal(VgmFilingEditDirCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();