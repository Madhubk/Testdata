/*
    Page : Cargo Receipt
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentCargoReceiptGlbController", ExportSeaShipmentCargoReceiptGlbController);

    ExportSeaShipmentCargoReceiptGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "$q", "APP_CONSTANT", "errorWarningService", "$filter", "$timeout", "toastr"];

    function ExportSeaShipmentCargoReceiptGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, $q, APP_CONSTANT, errorWarningService, $filter, $timeout, toastr) {
        var ExportSeaShipmentCargoReceiptGlbCtrl = this;

        function Init() {
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.emptyText = "-";
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.CompleteBtnText = "Complete"
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.Complete = Complete;
            if (ExportSeaShipmentCargoReceiptGlbCtrl.taskObj) {
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentCargoReceiptGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
            }

            // DatePicker
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    Code: "E11071"
                },
                EntityObject: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode];
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data = response.data.Response;
                        getTaskConfigData();
                    } else {
                        ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data.EntityObj = {};
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EEM_Code_3": EEM_Code_3,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskConfigData;
                    ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.MenuListSource = $filter('filter')(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ValidationSource = $filter('filter')(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ValidationSource = $filter('filter')(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.MenuObj = ExportSeaShipmentCargoReceiptGlbCtrl.taskObj;
                    ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.MenuObj.TabTitle = ExportSeaShipmentCargoReceiptGlbCtrl.taskObj.KeyReference;

                }
            });
        }
        function ValidationFindall() {
            if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Validation",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                        Code: "E11071"
                    },
                    GroupCode: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Validation",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                        Code: "E11071"
                    },
                    GroupCode: "SHP_GENERAL",
                    EntityObject: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

            }
        }
        function Complete() {

            console.log(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data)
            if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ValidationSource || ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DocumentValidation) {
                if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                        Code: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                            Code: "E11071"
                        },
                        GroupCode: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.docTypeSource.length == 0 || ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                            Code: [ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "SHP",
                                SubModuleCode: "SHP",
                            },
                            GroupCode: "Document",
                            EntityObject: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = 0;

                //    var _errorcount1 = errorWarningService.Modules.MyTask.Entity[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo].GlobalErrorWarningList;
                //    _errorcount1.map(function(value,key)
                //    {
                //     if (value.Code == 'E11071') {
                //         _errorcount = errorWarningService.Modules.MyTask.Entity[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo].GlobalErrorWarningList[key];
                //     }
                //    })
                   _errorcount = errorWarningService.Modules[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList
                    if (_errorcount.length > 0) {
                        if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ExportSeaShipmentCargoReceiptGlbCtrl.getErrorWarningList({
                            $item: _errorcount
                        })
                        //  ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ShowErrorWarningModal(ExportSeaShipmentCargoReceiptGlbCtrl.taskObj.PSI_InstanceNo);
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }
        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
        function CompleteWithSave() {
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                ConSave();
            }
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj
                    };
                    ExportSeaShipmentCargoReceiptGlbCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }
        function SaveEntity() {
            var _input = angular.copy(ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data);
            _input.UIShipmentHeader.IsModified = true;
            _input.UIShpExtendedInfo.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaShipmentCargoReceiptGlbCtrl.currentShipment = {
                        [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data
                                    }
                                }
                            }
                        },
                        label: response.data.Response.UIShipmentHeader.ShipmentNo,
                        code: response.data.Response.UIShipmentHeader.ShipmentNo,
                        isNew: false
                    };
                    myTaskActivityConfig.Entities.Shipment = ExportSeaShipmentCargoReceiptGlbCtrl.currentShipment;
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }
        Init();
    }
})();