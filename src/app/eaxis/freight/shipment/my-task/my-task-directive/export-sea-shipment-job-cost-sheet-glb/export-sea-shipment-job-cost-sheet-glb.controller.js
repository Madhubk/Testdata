/*
    Page :Job Cost Sheet
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentJobCostSheetGlbController", ExportSeaShipmentJobCostSheetGlbController);

    ExportSeaShipmentJobCostSheetGlbController.$inject = ["$scope", "apiService", "helperService","authService", "appConfig", "myTaskActivityConfig","$q", "toastr","$timeout","errorWarningService","$filter"];

    function ExportSeaShipmentJobCostSheetGlbController($scope, apiService, helperService, authService,appConfig, myTaskActivityConfig,$q, toastr,$timeout,errorWarningService,$filter) {

        var ExportSeaShipmentJobCostSheetGlbCtrl = this;

        function Init() {
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage = {
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
            InitPoUpload();
            // ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.emptyText = "-";

            // if (ExportSeaShipmentJobCostSheetGlbCtrl.taskObj) {
            //     ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentJobCostSheetGlbCtrl.taskObj;
            //     GetEntityObj();
            // } else {
            //     ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            // }
        }
        function InitPoUpload() {
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnDisabled = false;
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask = ExportSeaShipmentJobCostSheetGlbCtrl.taskObj;
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.Complete = Complete;
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.IsUploaded = IsUploaded;

            if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            GetEntityObj();
            StandardMenuConfig();
        }
        function IsUploaded(_item) {
            if (_item) {
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data = response.data.Response;
                        getTaskConfigData();
                    } else {
                        ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data.EntityObj = {};
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode],
                    Code: [ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode],
                    API: "Validation",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                        Code: "E11075",
                        VLG_Code : ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode
                    },
                    GroupCode: "JOB_COST_SHEET",
                    EntityObject: ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data
                   
                };
                errorWarningService.GetErrorCodeList(_obj);

                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode].Entity[ExportSeaShipmentJobCostSheetGlbCtrl.taskObj.WSI_StepCode].GlobalErrorWarningList;
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode].Entity[ExportSeaShipmentJobCostSheetGlbCtrl.taskObj.WSI_StepCode];
            }
        }
        function StandardMenuConfig() {
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                IsDisableCount: true,
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

            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function Complete() {
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnDisabled = true;
            console.log(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation);
            if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation) {
                GetDocumentValidation().then(function (response) {
                    if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.docTypeSource.length == response.length) {
                       ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.Document = true;
                    } else {
                      //  ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data.Document = null;
//                     }
                    var _obj = {
                        ModuleName: [ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode],
                        Code: [ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                            Code: "E11075",
                            VLG_Code : ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode
                        },
                        GroupCode: "JOB_COST_SHEET",
                        EntityObject: ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                    
                    }
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode].Entity[ExportSeaShipmentJobCostSheetGlbCtrl.taskObj.WSI_StepCode].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload Document';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + " for this " + doctypedesc + " Document type";
                            }
                        });
                    }
                    ExportSeaShipmentJobCostSheetGlbCtrl.getErrorWarningList({
                        $item: _errorcount
                    })
                    // toastr.warning(_errorcount[0].Message);
                    ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }
        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.docTypeSource = $filter('filter')(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.docTypeSource, 'DocType');
                        var DocumentListSource = _.groupBy(response.data.Response, 'DocumentType');
                        angular.forEach(TempDocTypeSource, function (value1, key1) {
                            angular.forEach(DocumentListSource, function (value, key) {
                                if (key == key1) {
                                    _arr.push(value);
                                }
                            });
                        });
                        deferred.resolve(_arr);
                    } else {
                        deferred.resolve(_arr);
                    }
                }
            });
            return deferred.promise;
        }
     
        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                "CompleteStepNo": ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask.WSI_StepNo,
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
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                ConSave();
            }
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.MyTask
                    };
                    ExportSeaShipmentJobCostSheetGlbCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }
        function SaveEntity() {
            var _input = angular.copy(ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data);
            _input.UIShipmentHeader.IsModified = true;
            _input.UIShpExtendedInfo.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExportSeaShipmentJobCostSheetGlbCtrl.currentShipment = {
                        [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data
                                    }
                                }
                            }
                        },
                        label: response.data.Response.UIShipmentHeader.ShipmentNo,
                        code: response.data.Response.UIShipmentHeader.ShipmentNo,
                        isNew: false
                    };
                    myTaskActivityConfig.Entities.Shipment = ExportSeaShipmentJobCostSheetGlbCtrl.currentShipment;
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        Init();
    }
})();