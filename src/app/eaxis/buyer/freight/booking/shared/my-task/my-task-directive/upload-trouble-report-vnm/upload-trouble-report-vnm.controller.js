(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadTroubleReportVnmDirectiveController", UploadTroubleReportVnmDirectiveController);

    UploadTroubleReportVnmDirectiveController.$inject = ["helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function UploadTroubleReportVnmDirectiveController(helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var UploadTroubleReportVnmDirectiveCtrl = this;

        function Init() {
            UploadTroubleReportVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_PKL_Vnm",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitPoUpload();
        }

        function InitPoUpload() {
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask = UploadTroubleReportVnmDirectiveCtrl.taskObj;
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;

            if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
        }

        function TaskGetById() {
            if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadTroubleReportVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        getTaskConfigData();
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }

        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadTroubleReportVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[UploadTroubleReportVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[UploadTroubleReportVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadTroubleReportVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadTroubleReportVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [UploadTroubleReportVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadTroubleReportVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[UploadTroubleReportVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload Document';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + " for this " + doctypedesc + " Document type";
                            }
                        });
                    }
                    // toastr.warning(_errorcount[0].Message);
                    UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask, 8);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                } else {
                    toastr.error("Task completion failed...");
                }
            });
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            var _data = {
                IsRefreshTask: true,
                IsRefreshStatusCount: true,
                Item: UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask
            };
            UploadTroubleReportVnmDirectiveCtrl.onComplete({
                $item: _data
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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

        function StandardMenuConfig() {
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadTroubleReportVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function InputData(_data, CompleteStepNo) {
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "CompleteStepNo": CompleteStepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        Init();
    }
})();