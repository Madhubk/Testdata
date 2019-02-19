(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadCoAppRequestVnmDirectiveController", UploadCoAppRequestVnmDirectiveController);

    UploadCoAppRequestVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function UploadCoAppRequestVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var UploadCoAppRequestVnmDirectiveCtrl = this;

        function Init() {
            UploadCoAppRequestVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_CO_App_Request_Vnm",
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
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask = UploadCoAppRequestVnmDirectiveCtrl.taskObj;
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadCoAppRequestVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadCoAppRequestVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadCoAppRequestVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[UploadCoAppRequestVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[UploadCoAppRequestVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadCoAppRequestVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadCoAppRequestVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [UploadCoAppRequestVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadCoAppRequestVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[UploadCoAppRequestVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload Document';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + " for this " + doctypedesc + " Document type";
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message);
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadCoAppRequestVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                    toastr.success("Task completed succesfully...");
                } else {
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadCoAppRequestVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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