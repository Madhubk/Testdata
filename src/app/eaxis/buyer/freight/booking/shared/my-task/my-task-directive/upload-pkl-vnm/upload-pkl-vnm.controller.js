(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadPklVnmDirectiveController", UploadPklVnmDirectiveController);

    UploadPklVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function UploadPklVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var UploadPklVnmDirectiveCtrl = this;

        function Init() {
            UploadPklVnmDirectiveCtrl.ePage = {
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
            UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadPklVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadPklVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask = UploadPklVnmDirectiveCtrl.taskObj;
            UploadPklVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadPklVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadPklVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadPklVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadPklVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadPklVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadPklVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadPklVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadPklVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }

        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadPklVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadPklVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadPklVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadPklVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadPklVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadPklVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadPklVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadPklVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadPklVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadPklVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadPklVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadPklVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [UploadPklVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadPklVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadPklVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadPklVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + doctypedesc;
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadPklVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadPklVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadPklVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadPklVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadPklVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadPklVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadPklVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadPklVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadPklVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadPklVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadPklVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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