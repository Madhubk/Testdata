(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadVanningPlanVnmDirectiveController", UploadVanningPlanVnmDirectiveController);

    UploadVanningPlanVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "orderApiConfig"];

    function UploadVanningPlanVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, orderApiConfig) {
        var UploadVanningPlanVnmDirectiveCtrl = this;

        function Init() {
            UploadVanningPlanVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Vanning_Plan_Vnm",
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
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask = UploadVanningPlanVnmDirectiveCtrl.taskObj;
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadVanningPlanVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadVanningPlanVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadVanningPlanVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadVanningPlanVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadVanningPlanVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadVanningPlanVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadVanningPlanVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [UploadVanningPlanVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadVanningPlanVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadVanningPlanVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + " for this " + doctypedesc + " Document type";
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadVanningPlanVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadVanningPlanVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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