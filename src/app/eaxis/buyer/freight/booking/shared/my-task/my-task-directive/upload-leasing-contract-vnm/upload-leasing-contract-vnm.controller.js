(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadLeasingContractVnmDirectiveController", UploadLeasingContractVnmDirectiveController);

    UploadLeasingContractVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function UploadLeasingContractVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var UploadLeasingContractVnmDirectiveCtrl = this;

        function Init() {
            UploadLeasingContractVnmDirectiveCtrl.ePage = {
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
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask = UploadLeasingContractVnmDirectiveCtrl.taskObj;
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadLeasingContractVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadLeasingContractVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadLeasingContractVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadLeasingContractVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadLeasingContractVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadLeasingContractVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadLeasingContractVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [UploadLeasingContractVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadLeasingContractVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadLeasingContractVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + doctypedesc;
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadLeasingContractVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadLeasingContractVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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