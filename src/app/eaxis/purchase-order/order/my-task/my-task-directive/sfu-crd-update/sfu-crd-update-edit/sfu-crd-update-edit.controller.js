(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuCRDUpdateEditDirectiveController", SfuCRDUpdateEditDirectiveController);

    SfuCRDUpdateEditDirectiveController.$inject = ["$q", "$injector", "$scope", "$timeout", "helperService", "APP_CONSTANT", "appConfig", "apiService", "toastr", "errorWarningService"];

    function SfuCRDUpdateEditDirectiveController($q, $injector, $scope, $timeout, helperService, APP_CONSTANT, appConfig, apiService, toastr, errorWarningService) {
        var SfuCRDUpdateEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SfuCRDUpdateEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_CRD_Update_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIPorOrderHeader": {}
                        }
                        // "Data": SfuCRDUpdateEditDirectiveCtrl.entityObj
                    }
                }
            };

            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SFUCRDInit();
        }

        function SFUCRDInit() {
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj = SfuCRDUpdateEditDirectiveCtrl.taskObj;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkUploadOpen = false;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update";
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkInput = {};
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList = [];
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            // SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkSave = BulkSave;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkUpdate = BulkUpdate;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateCaroReadyDate = UpdateCaroReadyDate;
            // DatePicker
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.dynamicPopover = {
                templateUrl: 'app/eaxis/purchase-order/order/my-task/my-task-directive/sfu-crd-update/sfu-crd-update-edit/sfu-crd-bulk-update-template.html'
            };
            $scope.$watch('SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList', function (newValue, oldValue) {
                if (SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList.length > 0) {
                    for (i = 0; i < SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList.length; i++) {
                        SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.map(function (value, key) {
                            if (value.POH_FK == SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList[i].POH_FK) {
                                value.Comments = SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList[i].Comments;
                                value.CargoReadyDate = SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList[i].CargoReadyDate;
                            }
                        });
                    }
                }
            }, true);
            $scope.$watch('SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader', function (newValue, oldValue) {
                if (SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList.length > 0) {
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader = newValue;
                    for (i = 0; i < SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.length; i++) {
                        SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
                            if (value.POH_FK == SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[i].POH_FK) {
                                value.Comments = SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[i].Comments;
                                value.CargoReadyDate = SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[i].CargoReadyDate;
                            }
                        });
                    }
                }
            }, true);

            FollowUpOrderGrid();
            initValidation();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function FollowUpOrderGrid() {
            apiService.get("eAxisAPI", appConfig.Entities.CargoReadiness.API.GetOrdersByGroupId.Url + SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.status = true;
                    })
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader = angular.copy(response.data.Response);
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                } else {
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader = [];
                }
            });
        }

        function initValidation() {
            if (SfuCRDUpdateEditDirectiveCtrl.taskObj) {
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [SfuCRDUpdateEditDirectiveCtrl.taskObj.PSI_InstanceNo],
                    API: "Validation", // Validation/Group
                    FilterInput: {
                        ModuleCode: "ORD",
                        SubModuleCode: "CRD"
                    },
                    // GroupCode: "PRE_ADV",
                    //     RelatedBasicDetails: [{
                    //         "UIField": "TEST",
                    //         "DbField": "TEST",
                    //         "Value": "TEST"
                    //     }],
                    ErrorCode: [],
                    EntityObject: SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data
                };

                errorWarningService.GetErrorCodeList(_obj);
                // error warning modal
                SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[SfuCRDUpdateEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[SfuCRDUpdateEditDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
            // error warning modal
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
        }

        function BulkUpdate() {
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkUploadOpen = true;
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.push(_item.item);
            } else {
                SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.splice(key, 1);
                    }
                });
            }
        }

        function BulkSave(item) {
            if (SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.length > 0) {
                SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.map(function (value, key) {
                    value.CargoReadyDate = item.CargoReadyDate;
                    value.Comments = item.Comments;
                });
            }
            UpdateCaroReadyDate(SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader);
        }

        function UpdateCaroReadyDate(_items) {
            CommonErrorObjInput();
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[SfuCRDUpdateEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Please wait...";
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = true;
                    var _updateInput = [];
                    for (i = 0; i < _items.length; i++) {
                        var _tempObj = {
                            "EntityRefPK": _items[i].POH_FK,
                            "Properties": [{
                                "PropertyName": "POH_CargoReadyDate",
                                "PropertyNewValue": _items[i].CargoReadyDate
                            }, {
                                "PropertyName": "POH_Comments",
                                "PropertyNewValue": _items[i].Comments
                            }, {
                                "PropertyName": "POH_OrderStatus",
                                "PropertyNewValue": "CRD"
                            }]
                        };
                        _updateInput.push(_tempObj);
                    }
                    // update records call
                    UpdateRecords(_updateInput).then(function (response) {
                        if (response.data.Status == "Success") {
                            JobCommentInsert(response.data.Response).then(function (response) {
                                if (response.data.Status == "Success") {
                                    CreateVesselGroup().then(function (response) {
                                        if (response.data.Status == "Success") {
                                            Complete();
                                        } else {
                                            toastr.error("Save Failed...");
                                            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update";
                                            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                                        }
                                    });
                                } else {
                                    toastr.error("Save Failed...");
                                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update";
                                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                                }
                            });
                        } else {
                            toastr.error("Save Failed...");
                            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                        }
                    });
                } else {
                    ShowErrorWarningModal(SfuCRDUpdateEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update";
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                }
                SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkInput = {};
            });

        }

        function UpdateRecords(_updateInput) {
            var deferred = $q.defer();
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update";
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function JobCommentInsert(data) {
            var deferred = $q.defer();
            var _jobCommentsArray = [];
            for (i = 0; i < data.length; i++) {
                var _jobCommentsInput = {
                    "PK": "",
                    "EntityRefKey": data[i].POH_FK,
                    "EntitySource": "SFU",
                    "Comments": data[i].Comments
                }
                _jobCommentsArray.push(_jobCommentsInput);
            }

            // job comments api call
            if (_jobCommentsArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsArray).then(function (response) {
                    if (response.data.Response) {
                        deferred.resolve(response);
                    } else {
                        toastr.error("Save Failed...");
                        SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update";
                        SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                        deferred.reject('failed');
                    }
                });
                return deferred.promise;
            }
        }

        function CreateVesselGroup() {
            var deferred = $q.defer();
            var _vesselPlanning = [];
            SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.map(function (value, key) {
                var _vesselPlanningInput = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.POH_FK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": value.Id
                }
                _vesselPlanning.push(_vesselPlanningInput);
            });

            var _input = {
                "GroupPK": SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "UIVesselPlanningDetails": _vesselPlanning
            }
            apiService.post("eAxisAPI", appConfig.Entities.VesselPlanning.API.CreateVesselPlanningGroup.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update";
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function Complete() {
            var _input = [];
            SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.map(function (value, key) {
                var _inputData = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.POH_FK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": value.Id
                }
                _input.push(_inputData);
            });
            var _filter = {
                "GroupEntityRefKey": SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    SfuCRDUpdateEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [SfuCRDUpdateEditDirectiveCtrl.taskObj.PSI_InstanceNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "CRD",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: SfuCRDUpdateEditDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();