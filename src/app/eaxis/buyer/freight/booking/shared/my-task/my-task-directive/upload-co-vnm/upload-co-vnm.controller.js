(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadCoVnmDirectiveController", UploadCoVnmDirectiveController);

    UploadCoVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function UploadCoVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var UploadCoVnmDirectiveCtrl = this;

        function Init() {
            UploadCoVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_CO_Vnm",
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
            UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadCoVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadCoVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask = UploadCoVnmDirectiveCtrl.taskObj;
            UploadCoVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadCoVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadCoVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadCoVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadCoVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadCoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadCoVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadCoVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadCoVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadCoVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadCoVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadCoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadCoVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadCoVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[UploadCoVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadCoVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[UploadCoVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadCoVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadCoVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadCoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadCoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [UploadCoVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadCoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[UploadCoVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadCoVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload Document';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + " for this " + doctypedesc + " Document type";
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message);
                    UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadCoVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                    toastr.success("Task completed succesfully...");
                } else {
                    UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadCoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadCoVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadCoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadCoVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadCoVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadCoVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadCoVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadCoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadCoVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadCoVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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