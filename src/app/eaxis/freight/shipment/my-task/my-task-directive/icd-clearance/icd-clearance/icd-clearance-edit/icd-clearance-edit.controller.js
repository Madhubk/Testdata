/*
    Page : ICD clearance
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IcdClearanceEditController", IcdClearanceEditController);

    IcdClearanceEditController.$inject = ["$scope", "$rootScope", "$q", "$uibModal", "$timeout", "helperService", "appConfig", "apiService", "APP_CONSTANT", "toastr", "authService", "errorWarningService"];

    function IcdClearanceEditController($scope, $rootScope, $q, $uibModal, $timeout, helperService, appConfig, apiService, APP_CONSTANT, toastr, authService, errorWarningService) {
        var IcdClearanceEditCtrl = this;

        function Init() {
            IcdClearanceEditCtrl.ePage = {
                "Title": "",
                "Prefix": "ICD_CLEARANCE",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            // DatePicker
            IcdClearanceEditCtrl.ePage.Masters.DatePicker = {};
            IcdClearanceEditCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            IcdClearanceEditCtrl.ePage.Masters.DatePicker.isOpen = [];
            IcdClearanceEditCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            InitDelivery();
        }

        // =============================== ICD Clearance Edit Start =================================
        function InitDelivery() {
            IcdClearanceEditCtrl.ePage.Masters.TaskObj = IcdClearanceEditCtrl.taskObj;
            IcdClearanceEditCtrl.ePage.Masters.Save = Save;
            IcdClearanceEditCtrl.ePage.Masters.Complete = Complete;
            IcdClearanceEditCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            IcdClearanceEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IcdClearanceEditCtrl.ePage.Masters.CompleteBtnText = "Complete";
            GetEntityObj();
            GetShipmentListing();
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            IcdClearanceEditCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
            if (IcdClearanceEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + IcdClearanceEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        IcdClearanceEditCtrl.ePage.Entities.Header.Data = response.data.Response;
                        StandardMenuConfig();
                        initValidation();
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIShipmentHeader.ShipmentNo,
                            code: response.data.Response.UIShipmentHeader.ShipmentNo,
                            isNew: false
                        };
                        IcdClearanceEditCtrl.currentShipment = obj;
                        GetJobPackLinesDetails();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function GetShipmentListing() {
            var _filter = {
                "SHP_FK": IcdClearanceEditCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    IcdClearanceEditCtrl.ePage.Masters.ConShpObj = response.data.Response;
                    if (IcdClearanceEditCtrl.ePage.Masters.ConShpObj.length > 0) {
                        IcdClearanceEditCtrl.ePage.Masters.ConShpObj.map(function (value, key) {
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
                        IcdClearanceEditCtrl.ePage.Entities.Header.ConData = response.data.Response;
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        IcdClearanceEditCtrl.currentConsol = obj;
                        GetJobRoutesDetails(data);
                    }
                });
            }
        }

        function GetJobPackLinesDetails() {
            var _filter = {
                "SHP_FK": IcdClearanceEditCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    IcdClearanceEditCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response;
                }
            });
        }
        function GetJobRoutesDetails(data) {
            var _filter = {
                "EntityRefKey": data,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    IcdClearanceEditCtrl.currentConsol[IcdClearanceEditCtrl.currentConsol.label].ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;
                }
            });
        }

        function GeneralValidation() {
            IcdClearanceEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IcdClearanceEditCtrl.ePage.Masters.CompleteBtnText = "Complete";
            IcdClearanceEditCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("MyTask", IcdClearanceEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo, IcdClearanceEditCtrl.ePage.Masters.DocListSource.length, 'E11075', false, undefined);
        }

        function Complete() {
            IcdClearanceEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            IcdClearanceEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            // GeneralValidation();
            //  var _errorcount = errorWarningService.Modules.MyTask.Entity[IcdClearanceEditCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            // if (_errorcount.length == 0) {
            IcdClearanceEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            IcdClearanceEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            Save();
            // } else {
            //     ShowErrorWarningModal(IcdClearanceEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo);
            // }
        }

        function ConSave() {
            var _input = angular.copy(IcdClearanceEditCtrl.ePage.Entities.Header.ConData);
            _input.UIConConsolHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ConsolList.API.Update.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    Save();
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function Save() {
            var _input = angular.copy(IcdClearanceEditCtrl.ePage.Entities.Header.Data);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    IcdClearanceEditCtrl.ePage.Entities.Header.Data = response.data.Response;
                    response.data.Response.UIJobEntryNums.map(function (value, key) {
                        if (value.Category === "CUS") {
                            IcdClearanceEditCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                        }
                    });
                    SaveOnly();
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": IcdClearanceEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": IcdClearanceEditCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: IcdClearanceEditCtrl.ePage.Masters.TaskObj
                    };

                    IcdClearanceEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                IcdClearanceEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                IcdClearanceEditCtrl.ePage.Masters.CompleteBtnText = "complete";
                deferred.resolve(response);
                return deferred.promise;
            });
        }

        function StandardMenuConfig() {
            IcdClearanceEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": IcdClearanceEditCtrl.ePage.Masters.TaskObj.ProcessName,
                "EntityRefKey": IcdClearanceEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": IcdClearanceEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": IcdClearanceEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": IcdClearanceEditCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": IcdClearanceEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": IcdClearanceEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true,
                "RowObj": IcdClearanceEditCtrl.ePage.Entities.Header.Data
            };

            IcdClearanceEditCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableRelatedDocument: true
            };
            IcdClearanceEditCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function initValidation() {
            //ValidationFindall();
        }

        function ValidationFindall() {
            if (IcdClearanceEditCtrl.ePage.Masters.TaskObj) {
                errorWarningService.AddModuleToList("MyTask", IcdClearanceEditCtrl.taskObj.PSI_InstanceNo);
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {
                });
                IcdClearanceEditCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                IcdClearanceEditCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[IcdClearanceEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                IcdClearanceEditCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[IcdClearanceEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            }
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        // =============================== ICD Clearance Edit End =================================

        Init();
    }
})();
