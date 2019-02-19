(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadDODirectiveController", UploadDODirectiveController);

    UploadDODirectiveController.$inject = ["$q", "$window", "$timeout", "helperService", "apiService", "appConfig", "authService", "orderApiConfig", "toastr"];

    function UploadDODirectiveController($q, $window, $timeout, helperService, apiService, appConfig, authService, orderApiConfig, toastr) {
        var UploadDODirectiveCtrl = this;

        function Init() {
            UploadDODirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_DO",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitDoUpload();
            TaskGetById();
        }

        function InitDoUpload() {
            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadDODirectiveCtrl.ePage.Masters.MyTask = UploadDODirectiveCtrl.taskObj;
            UploadDODirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
            UploadDODirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadDODirectiveCtrl.ePage.Masters.PODocuments = {};
            UploadDODirectiveCtrl.ePage.Masters.PODocuments.SelectedGridRow = SelectedGridRow;

            if (UploadDODirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadDODirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadDODirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadDODirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            StandardMenuConfig();
        }

        function TaskGetById() {
            if (UploadDODirectiveCtrl.ePage.Masters.MyTask) {
                GetDocumentsList();
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url + UploadDODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        UploadDODirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": UploadDODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": UploadDODirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefCode": UploadDODirectiveCtrl.ePage.Masters.MyTask.KeyReference
                // "Status": "Success"
            };
            _filter.DocumentType = "UDO";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    UploadDODirectiveCtrl.ePage.Masters.PODocuments.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    UploadDODirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            UploadDODirectiveCtrl.ePage.Masters.PODocuments.GridData = undefined;
            $timeout(function () {
                if (UploadDODirectiveCtrl.ePage.Masters.PODocuments.ListSource.length > 0) {
                    UploadDODirectiveCtrl.ePage.Masters.PODocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                UploadDODirectiveCtrl.ePage.Masters.PODocuments.GridData = _gridData;
            });
        }

        function SelectedGridRow($item, action) {
            if (action === "download") {
                DownloadDocument($item);
            } else if (action === "delete") {
                DeleteDocument($item);
            }
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DMSDownload.Url + "/" + curDoc.DocFK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function DeleteDocument(curDoc) {
            curDoc.IsActive = false;
            curDoc.IsDeleted = true;
            curDoc.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [curDoc]).then(function (response) {
                if (response.data.Response) {
                    GetDocumentsDetails();
                }
            });
        }

        function Complete() {
            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please Wait...";
            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            var _filterInput = {
                "POB_PK": UploadDODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": orderApiConfig.Entities.BuyerForwarderOrder.API.findall.FilterID
            }
            apiService.post('eAxisAPI', orderApiConfig.Entities.BuyerForwarderOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TaskCompletion();
                    } else {
                        toastr.warning("Please create atleast one order to complete...");
                        UploadDODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                        UploadDODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    }
                } else {
                    toastr.warning("Please create atleast one order to complete...");
                    UploadDODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
            });
        }

        function TaskCompletion() {
            UpdateRecords("COMPLETED").then(function (response) {
                if (response.data.Status === "Success") {
                    CompleteWithSave().then(function (response) {
                        if (response.data.Status === "Success") {
                            toastr.success("Task Completed...");
                            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            var _data = {
                                IsRefreshTask: true,
                                IsRefreshStatusCount: true,
                                Item: UploadDODirectiveCtrl.ePage.Masters.MyTask
                            };
                            UploadDODirectiveCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            UploadDODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            toastr.error("Task Completion failed...");
                        }
                    });
                } else {
                    UploadDODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadDODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task Completion failed...");
                }
            });
        }

        function UpdateRecords(Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": UploadDODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "Properties": [{
                    "PropertyName": "POB_Status",
                    "PropertyNewValue": Status
                }]
            };
            // batch upload update api call
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrderBatchUpload.API.updaterecords.Url, [_tempObj]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function CompleteWithSave() {
            var deferred = $q.defer();
            var _input = InputData(UploadDODirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function OpenActivity(_obj) {
            var _queryString = {
                PK: _obj.EntityRefKey,
                BatchUploadNo: _obj.KeyReference,
                ConfigName: "one_order_listConfig",
                OrderType: "DOR"
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/po-order?q=" + _queryString, "_blank");
        }

        function StandardMenuConfig() {
            UploadDODirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadDODirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadDODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadDODirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadDODirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadDODirectiveCtrl.ePage.Masters.MyTask.PK,
                "ParentEntityRefCode": UploadDODirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadDODirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            UploadDODirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadDODirectiveCtrl.ePage.Masters.CommentConfig = {
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
        Init();
    }
})();