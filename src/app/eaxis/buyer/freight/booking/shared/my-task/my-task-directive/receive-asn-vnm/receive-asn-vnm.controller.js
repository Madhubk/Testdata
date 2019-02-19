(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiveAsnVnmDirectiveController", ReceiveAsnVnmDirectiveController);

    ReceiveAsnVnmDirectiveController.$inject = ["$window", "helperService", "$q", "$filter", "$timeout", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "freightApiConfig"];

    function ReceiveAsnVnmDirectiveController($window, helperService, $q, $filter, $timeout, apiService, authService, appConfig, toastr, errorWarningService, freightApiConfig) {
        var ReceiveAsnVnmDirectiveCtrl = this;

        function Init() {
            ReceiveAsnVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Receive_Asn_Vnm",
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
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsMisMatchBtn = "Stock MisMatch";
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsMisMatch = false;
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsNoMisMatchBtn = "No MisMatch";
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsNoMisMatch = false;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.PageNotFound = false;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsLoading = true;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask = ReceiveAsnVnmDirectiveCtrl.taskObj;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.Approval = Approval;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocTypeDesc = "Upload Trouble Report";
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsApproval = true;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;


            if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
            getTaskConfigData();
        }

        function TaskGetById() {
            if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        ReceiveAsnVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    } else {
                        ReceiveAsnVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj = {};
                        ReceiveAsnVnmDirectiveCtrl.ePage.Masters.PageNotFound = true;
                        ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsLoading = false;
                    }
                });
            }
        }

        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI)
                EEM_Code_3 = ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
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
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                }
            });
        }

        function DocumentValidation() {
            if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask) {
                // validation findall call
                var _obj = {
                    ModuleName: [ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    Code: [ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: ReceiveAsnVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);

                ReceiveAsnVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                ReceiveAsnVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[ReceiveAsnVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                ReceiveAsnVnmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[ReceiveAsnVnmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }

        function Approval(type) {
            if (!type) {
                Validation();
                // Validation("IsMisMatch", "Stock MisMatch");
            } else {
                Complete();
                // Complete("IsNoMisMatch", "No MisMatch");
            }
        }

        function Validation() {
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt + "Btn"] = "Please wait..";
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt] = true;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                GetDocumentValidation().then(function (response) {
                    if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == 0 || ReceiveAsnVnmDirectiveCtrl.ePage.Masters.docTypeSource.length == response.length) {
                        ReceiveAsnVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = true;
                    } else {
                        ReceiveAsnVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj.Document = null;
                    }
                    var _obj = {
                        ModuleName: [ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                        Code: [ReceiveAsnVnmDirectiveCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: "Document",
                        EntityObject: ReceiveAsnVnmDirectiveCtrl.ePage.Entities.Header.Data.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                });
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules[ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].Entity[ReceiveAsnVnmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        angular.forEach(_errorcount, function (value, key) {
                            if (value.MetaObject == "Document") {
                                // var docTypeSource = $filter('filter')(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                //     return val.IsMondatory == true
                                // });
                                var doctypedesc = '';
                                angular.forEach(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                    doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                });
                                value.Message = 'Please ';
                                doctypedesc = doctypedesc.slice(0, -1);
                                value.Message = value.Message + doctypedesc;
                            }
                        });
                    }
                    toastr.warning(_errorcount[0].Message + " for this " + "instance # " + ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo);
                    // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt + "Btn"] = btn;
                    // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt] = false;
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                } else {
                    Complete();
                }
            }, 1000);
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.docTypeSource = $filter('filter')(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefKey": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.docTypeSource, 'DocType');
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

        function Complete() {
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt + "Btn"] = "Please wait..";
            // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt] = true;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            var _input = InputData(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt + "Btn"] = btn;
                    // ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt] = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    ReceiveAsnVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task completion failed...");
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
            });
        }

        function StandardMenuConfig() {
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                "ParentEntityRefCode": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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