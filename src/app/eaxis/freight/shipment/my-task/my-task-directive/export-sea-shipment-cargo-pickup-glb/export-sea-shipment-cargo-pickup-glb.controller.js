/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentCargoPickupGlbController", ExportSeaShipmentCargoPickupGlbController);

    ExportSeaShipmentCargoPickupGlbController.$inject = ["$scope", "apiService", "helperService", "$q", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "$filter", "$timeout", "toastr"];

    function ExportSeaShipmentCargoPickupGlbController($scope, apiService, helperService, $q, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, $filter, $timeout, toastr) {
        var ExportSeaShipmentCargoPickupGlbCtrl = this;
        function Init() {
            ExportSeaShipmentCargoPickupGlbCtrl.ePage = {
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
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.emptyText = "-";
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.Complete = Complete;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.CompleteBtnText = "Complete";
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ConSave = ConSave;
            if (ExportSeaShipmentCargoPickupGlbCtrl.taskObj) {
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentCargoPickupGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj = myTaskActivityConfig.Entities.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
            }

            // DatePicker
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                        getTaskConfigData();
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskConfigData;
                    ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.MenuListSource = $filter('filter')(ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ValidationSource = $filter('filter')(ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ValidationSource = $filter('filter')(ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        //  DocumentValidation();
                    }
                    ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.MenuObj = ExportSeaShipmentCargoPickupGlbCtrl.taskObj;
                    ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.MenuObj.TabTitle = ExportSeaShipmentCargoPickupGlbCtrl.taskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Validation",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                        Code: "E11072",
                        VLG_Code : ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode
                    },
                    GroupCode: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        // function DocumentValidation() {
        //     if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj) {
        //         // validation findall call
        //         var _obj = {
        //             ModuleName: ["MyTask"],
        //             Code: [ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
        //             API: "Validation",
        //             FilterInput: {
        //                 ModuleCode: "SHP",
        //                 SubModuleCode: "SHP",
        //                 Code: "E11075",
        //                 VLG_Code : ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode
        //             },
        //             GroupCode: "CARGO_PICKUP",
        //             EntityObject: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj,
        //             ErrorCode: []
        //         };
        //         errorWarningService.GetErrorCodeList(_obj);

        //     }
        // }

        function Complete() {
            if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ValidationSource || ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DocumentValidation) {
                if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: [ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                        Code: [ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                            Code: "E11072",
                            VLG_Code : ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode
                        },
                        ErrorCode: [],
                        GroupCode:  ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                        EntityObject: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                // if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                //     GetDocumentValidation().then(function (response) {
                //         if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.docTypeSource.length == response.length) {
                //             ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj.Document = true;
                //         } else {
                //             ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj.Document = null;
                //         }
                //         // var _obj = {
                //         //     ModuleName: ["MyTask"],
                //         //     Code: [ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                //         //     API: "Validation",
                //         //     FilterInput: {
                //         //         ModuleCode: "SHP",
                //         //         SubModuleCode: "SHP",
                //         //         Code:"E11075",
                //         //         VLG_Code : ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode
                //         //     },
                //         //     GroupCode: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                //         //     EntityObject: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj
                //         // };
                //         // errorWarningService.ValidateValue(_obj);
                //     });
                // }
                $timeout(function () {
                    var _errorcount=0;
                    // var _errorcount1 = errorWarningService.Modules.MyTask.Entity[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo].GlobalErrorWarningList;
                    // _errorcount1.map(function (value, key) {
                    //     if (value.Code == 'E11072') {
                    //         _errorcount = errorWarningService.Modules.MyTask.Entity[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo].GlobalErrorWarningList[key];
                    //     }
                    // })
                    _errorcount = errorWarningService.Modules[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ExportSeaShipmentCargoPickupGlbCtrl.getErrorWarningList({
                            $item: _errorcount
                        })
                        //  ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ShowErrorWarningModal(ExportSeaShipmentCargoPickupGlbCtrl.taskObj.PSI_InstanceNo);
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function CompleteWithSave() {
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj.UIConShpMappings.length > 0) {
                ConSave();
            }
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj
                    };
                    ExportSeaShipmentCargoPickupGlbCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }
        function ConSave() {
            Console.log("ConSave");
        }
        function SaveEntity() {
            var _input = angular.copy(ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            _input.UIShpExtendedInfo.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaShipmentCargoPickupGlbCtrl.currentShipment = {
                        [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj
                                    }
                                }
                            }
                        },
                        label: response.data.Response.UIShipmentHeader.ShipmentNo,
                        code: response.data.Response.UIShipmentHeader.ShipmentNo,
                        isNew: false
                    };
                    myTaskActivityConfig.Entities.Shipment = ExportSeaShipmentCargoPickupGlbCtrl.currentShipment;
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                Code: [ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    Code: "E11072",
                    VLG_Code : ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode
                },
                GroupCode:  "CARGO_PICKUP",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];

        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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

        // function ShowErrorWarningModal(EntityObject) {
        //     $("#errorWarningContainer" + EntityObject).toggleClass("open");
        // }

        Init();
    }
})();