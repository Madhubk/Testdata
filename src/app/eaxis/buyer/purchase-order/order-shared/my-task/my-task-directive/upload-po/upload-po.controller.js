(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadPODirectiveController", UploadPODirectiveController);

    UploadPODirectiveController.$inject = ["$q", "$window", "$timeout", "helperService", "apiService", "appConfig", "authService", "orderApiConfig", "toastr"];

    function UploadPODirectiveController($q, $window, $timeout, helperService, apiService, appConfig, authService, orderApiConfig, toastr) {
        var UploadPODirectiveCtrl = this;

        function Init() {
            UploadPODirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_PO",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            UploadPODirectiveCtrl.ePage.Masters.MyTask = UploadPODirectiveCtrl.taskObj;
            UploadPODirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
            UploadPODirectiveCtrl.ePage.Masters.Complete = Complete;
            UploadPODirectiveCtrl.ePage.Masters.PODocuments = {};
            UploadPODirectiveCtrl.ePage.Masters.PODocuments.SelectedGridRow = SelectedGridRow;

            if (UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            StandardMenuConfig();
        }

        function TaskGetById() {
            if (UploadPODirectiveCtrl.ePage.Masters.MyTask) {
                GetDocumentsList();
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url + UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        UploadPODirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "EntityRefCode": UploadPODirectiveCtrl.ePage.Masters.MyTask.KeyReference
                // "Status": "Success"
            };
            _filter.DocumentType = "UPO";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    UploadPODirectiveCtrl.ePage.Masters.PODocuments.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    UploadPODirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            UploadPODirectiveCtrl.ePage.Masters.PODocuments.GridData = undefined;
            $timeout(function () {
                if (UploadPODirectiveCtrl.ePage.Masters.PODocuments.ListSource.length > 0) {
                    UploadPODirectiveCtrl.ePage.Masters.PODocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                UploadPODirectiveCtrl.ePage.Masters.PODocuments.GridData = _gridData;
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
            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please Wait...";
            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            var _filterInput = {
                "POB_PK": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
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
                        UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                        UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    }
                } else {
                    toastr.warning("Please create atleast one order to complete...");
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
            });
        }

        function TaskCompletion() {
            UpdateRecords("COMPLETED").then(function (response) {
                if (response.data.Status === "Success") {
                    CompleteWithSave().then(function (response) {
                        if (response.data.Status === "Success") {
                            toastr.success("Task completed...");
                            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            var _data = {
                                IsRefreshTask: true,
                                IsRefreshStatusCount: true,
                                Item: UploadPODirectiveCtrl.ePage.Masters.MyTask
                            };
                            UploadPODirectiveCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            toastr.error("Task Completion failed...");
                        }
                    });
                } else {
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task Completion failed...");
                }
            });
        }

        function UpdateRecords(Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
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
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function CompleteWithSave() {
            var deferred = $q.defer();
            var _input = InputData(UploadPODirectiveCtrl.ePage.Masters.MyTask);
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
                OrderType: "POR"
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/po-order?q=" + _queryString, "_blank");
        }

        function StandardMenuConfig() {
            UploadPODirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadPODirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": UploadPODirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadPODirectiveCtrl.ePage.Masters.MyTask.PK,
                "ParentEntityRefCode": UploadPODirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            UploadPODirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadPODirectiveCtrl.ePage.Masters.CommentConfig = {
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