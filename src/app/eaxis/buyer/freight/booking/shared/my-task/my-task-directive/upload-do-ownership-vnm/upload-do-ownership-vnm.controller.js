(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadDoOwnershipVnmDirectiveController", UploadDoOwnershipVnmDirectiveController);

    UploadDoOwnershipVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function UploadDoOwnershipVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var UploadDoOwnershipVnmDirectiveCtrl = this;

        function Init() {
            UploadDoOwnershipVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Do_for_Ownership_Transfer_Vnm",
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
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask = UploadDoOwnershipVnmDirectiveCtrl.taskObj;
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadDoOwnershipVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadDoOwnershipVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }

        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadDoOwnershipVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadDoOwnershipVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadDoOwnershipVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadDoOwnershipVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadDoOwnershipVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [UploadDoOwnershipVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadDoOwnershipVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadDoOwnershipVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + doctypedesc;
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadDoOwnershipVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task completion failed...");
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadDoOwnershipVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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