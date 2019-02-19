(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadDoVnmDirectiveController", UploadDoVnmDirectiveController);

    UploadDoVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "orderApiConfig"];

    function UploadDoVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, orderApiConfig) {
        var UploadDoVnmDirectiveCtrl = this;

        function Init() {
            UploadDoVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Do_Vnm",
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
            UploadDoVnmDirectiveCtrl.ePage.Masters.DocDesc = "Upload DO";
            UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadDoVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadDoVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask = UploadDoVnmDirectiveCtrl.taskObj;
            UploadDoVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadDoVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadDoVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadDoVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadDoVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadDoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadDoVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadDoVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadDoVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadDoVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadDoVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadDoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadDoVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadDoVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadDoVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadDoVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadDoVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadDoVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadDoVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadDoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadDoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [UploadDoVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadDoVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadDoVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadDoVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + doctypedesc;
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadDoVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task completion failed...");
                    UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDoVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadDoVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadDoVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadDoVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadDoVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadDoVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadDoVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadDoVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadDoVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadDoVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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
                PK: obj.UIOrder_Buyer.PK,
                OrderCumSplitNo: obj.UIOrder_Buyer.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/delivery-order-view?q=" + _queryString, "_blank");
        }

        Init();
    }
})();