(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadExportPermitVnmDirectiveController", UploadExportPermitVnmDirectiveController);

    UploadExportPermitVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function UploadExportPermitVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var UploadExportPermitVnmDirectiveCtrl = this;

        function Init() {
            UploadExportPermitVnmDirectiveCtrl.ePage = {
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
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask = UploadExportPermitVnmDirectiveCtrl.taskObj;
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadExportPermitVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadExportPermitVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadExportPermitVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadExportPermitVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadExportPermitVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadExportPermitVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadExportPermitVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadExportPermitVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadExportPermitVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadExportPermitVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadExportPermitVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadExportPermitVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadExportPermitVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadExportPermitVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadExportPermitVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [UploadExportPermitVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadExportPermitVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadExportPermitVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + doctypedesc;
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadExportPermitVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadExportPermitVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadExportPermitVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadExportPermitVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadExportPermitVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function InputData(_data) {
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "CompleteStepNo": _data.WSI_StepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.UIShipmentHeader.PK,
                ShipmentNo: obj.UIShipmentHeader.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/booking-view?q=" + _queryString, "_blank");
        }

        Init();
    }
})();