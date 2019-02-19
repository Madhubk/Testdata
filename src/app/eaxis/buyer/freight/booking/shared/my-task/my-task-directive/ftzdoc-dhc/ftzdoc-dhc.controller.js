(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FTZDocDhcDirectiveController", FTZDocDhcDirectiveController);

    FTZDocDhcDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function FTZDocDhcDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var FTZDocDhcDirectiveCtrl = this;

        function Init() {
            FTZDocDhcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_FTZ",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitFTZUpload();
        }

        function InitFTZUpload() {
            FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            FTZDocDhcDirectiveCtrl.ePage.Masters.PageNotFound = false;
            FTZDocDhcDirectiveCtrl.ePage.Masters.IsLoading = true;
            FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask = FTZDocDhcDirectiveCtrl.taskObj;
            FTZDocDhcDirectiveCtrl.ePage.Masters.Complete = Complete;
            FTZDocDhcDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            FTZDocDhcDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        FTZDocDhcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        FTZDocDhcDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        FTZDocDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        FTZDocDhcDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        FTZDocDhcDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                FTZDocDhcDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    FTZDocDhcDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(FTZDocDhcDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: FTZDocDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                FTZDocDhcDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                FTZDocDhcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[FTZDocDhcDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                FTZDocDhcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[FTZDocDhcDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            console.log(FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation);
            if (FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (FTZDocDhcDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || FTZDocDhcDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        FTZDocDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        FTZDocDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [FTZDocDhcDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: FTZDocDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[FTZDocDhcDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(FTZDocDhcDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload Document';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + " for this " + doctypedesc + " Document type";
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message);
                    FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask, 1);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask
                    };
                    FTZDocDhcDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    FTZDocDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            FTZDocDhcDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(FTZDocDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(FTZDocDhcDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (FTZDocDhcDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(FTZDocDhcDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            FTZDocDhcDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": FTZDocDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            FTZDocDhcDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            FTZDocDhcDirectiveCtrl.ePage.Masters.CommentConfig = {
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

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.UIShipmentHeader.PK,
                ShipmentNo: obj.UIShipmentHeader.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment-view?q=" + _queryString, "_blank");
        }

        Init();
    }
})();