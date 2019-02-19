(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ISFUploadDhcDirectiveController", ISFUploadDhcDirectiveController);

    ISFUploadDhcDirectiveController.$inject = ["$window", "helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function ISFUploadDhcDirectiveController($window, helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var ISFUploadDhcDirectiveCtrl = this;

        function Init() {
            ISFUploadDhcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_ISF",
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
            ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            ISFUploadDhcDirectiveCtrl.ePage.Masters.PageNotFound = false;
            ISFUploadDhcDirectiveCtrl.ePage.Masters.IsLoading = true;
            ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask = ISFUploadDhcDirectiveCtrl.taskObj;
            ISFUploadDhcDirectiveCtrl.ePage.Masters.Complete = Complete;
            ISFUploadDhcDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            ISFUploadDhcDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            if (ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        ISFUploadDhcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        ISFUploadDhcDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        ISFUploadDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        ISFUploadDhcDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        ISFUploadDhcDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                ISFUploadDhcDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ISFUploadDhcDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: ISFUploadDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                ISFUploadDhcDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                ISFUploadDhcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[ISFUploadDhcDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                ISFUploadDhcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[ISFUploadDhcDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function Complete() {
            ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            console.log(ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation);
            if (ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (ISFUploadDhcDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || ISFUploadDhcDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        ISFUploadDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        ISFUploadDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ISFUploadDhcDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: ISFUploadDhcDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[ISFUploadDhcDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(ISFUploadDhcDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please Upload Document';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + " for this " + doctypedesc + " Document type";
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message);
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    CompleteWithSave();
                }
            }, 1000);
        }

        function CompleteWithSave() {
            var _input = InputData(ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask, 1);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask
                    };
                    ISFUploadDhcDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ISFUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task completion failed...");
                }
            });
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ISFUploadDhcDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(ISFUploadDhcDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ISFUploadDhcDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ISFUploadDhcDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ISFUploadDhcDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            ISFUploadDhcDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": ISFUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            ISFUploadDhcDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            ISFUploadDhcDirectiveCtrl.ePage.Masters.CommentConfig = {
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