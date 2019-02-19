(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadMaterialListVnmDirectiveController", UploadMaterialListVnmDirectiveController);

    UploadMaterialListVnmDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "orderApiConfig"];

    function UploadMaterialListVnmDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, orderApiConfig) {
        var UploadMaterialListVnmDirectiveCtrl = this;

        function Init() {
            UploadMaterialListVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Material_List_Vnm",
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
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask = UploadMaterialListVnmDirectiveCtrl.taskObj;
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        UploadMaterialListVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        UploadMaterialListVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        UploadMaterialListVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        UploadMaterialListVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        UploadMaterialListVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                UploadMaterialListVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadMaterialListVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                UploadMaterialListVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                UploadMaterialListVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadMaterialListVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                UploadMaterialListVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadMaterialListVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || UploadMaterialListVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        UploadMaterialListVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        UploadMaterialListVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [UploadMaterialListVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: UploadMaterialListVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[UploadMaterialListVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + doctypedesc;
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    UploadMaterialListVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadMaterialListVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadMaterialListVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadMaterialListVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadMaterialListVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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