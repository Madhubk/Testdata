(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BulkUploadDhcDirectiveController", BulkUploadDhcDirectiveController);

    BulkUploadDhcDirectiveController.$inject = ["$q", "$window", "$timeout", "helperService", "apiService", "appConfig", "authService", "toastr"];

    function BulkUploadDhcDirectiveController($q, $window, $timeout, helperService, apiService, appConfig, authService, toastr) {
        var BulkUploadDhcDirectiveCtrl = this;

        function Init() {
            BulkUploadDhcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Bulk_Upload",
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
            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask = BulkUploadDhcDirectiveCtrl.taskObj;
            BulkUploadDhcDirectiveCtrl.ePage.Masters.Complete = Complete;
            BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc = {};
            BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc.SelectedGridRow = SelectedGridRow;

            if (BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            StandardMenuConfig();
        }

        function TaskGetById() {
            if (BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask) {
                GetDocumentsList();
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url + BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        BulkUploadDhcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": "SHP",
                "EntityRefCode": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference
                // "Status": "Success"
            };
            _filter.DocumentType = "BUP";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc.GridData = undefined;
            $timeout(function () {
                if (BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc.ListSource.length > 0) {
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                BulkUploadDhcDirectiveCtrl.ePage.Masters.BulkDoc.GridData = _gridData;
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
            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please Wait...";
            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            var _filterInput = {
                "POB_PK": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.PorOrderBatchUpload.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderBatchUpload.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TaskCompletion();
                    } else {
                        BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                        BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    }
                } else {
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }

            });
        }

        function TaskCompletion() {
            UpdateRecords("COMPLETED").then(function (response) {
                if (response.data.Status === "Success") {
                    CompleteWithSave().then(function (response) {
                        if (response.data.Status === "Success") {
                            toastr.success("Task Completed...");
                            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            var _data = {
                                IsRefreshTask: true,
                                IsRefreshStatusCount: true,
                                Item: BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask
                            };
                            BulkUploadDhcDirectiveCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            toastr.error("Task Completion failed...");
                        }
                    });
                } else {
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    BulkUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task Completion failed...");
                }
            });
        }

        function UpdateRecords(Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
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
            var _input = InputData(BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }
        function StandardMenuConfig() {
            BulkUploadDhcDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.PK,
                "ParentEntityRefCode": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": BulkUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            BulkUploadDhcDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            BulkUploadDhcDirectiveCtrl.ePage.Masters.CommentConfig = {
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