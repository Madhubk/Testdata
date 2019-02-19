(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AsnUploadVnmDirectiveController", AsnUploadVnmDirectiveController);

    AsnUploadVnmDirectiveController.$inject = ["$q", "$window", "$timeout", "helperService", "apiService", "appConfig", "authService", "freightApiConfig", "toastr"];

    function AsnUploadVnmDirectiveController($q, $window, $timeout, helperService, apiService, appConfig, authService, freightApiConfig, toastr) {
        var AsnUploadVnmDirectiveCtrl = this;

        function Init() {
            AsnUploadVnmDirectiveCtrl.ePage = {
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
            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask = AsnUploadVnmDirectiveCtrl.taskObj;
            AsnUploadVnmDirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
            AsnUploadVnmDirectiveCtrl.ePage.Masters.Complete = Complete;
            AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments = {};
            AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments.SelectedGridRow = SelectedGridRow;

            if (AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            StandardMenuConfig();
        }

        function TaskGetById() {
            if (AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask) {
                GetDocumentsList();
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url + AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AsnUploadVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": "SHP",
                "EntityRefCode": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference
                // "Status": "Success"
            };
            _filter.DocumentType = "ASN";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments.GridData = undefined;
            $timeout(function () {
                if (AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments.ListSource.length > 0) {
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                AsnUploadVnmDirectiveCtrl.ePage.Masters.PODocuments.GridData = _gridData;
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
            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please Wait...";
            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            var _filterInput = {
                "POB_PK": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": freightApiConfig.Entities.shipmentheaderbuyer.API.findall.FilterID
            }
            apiService.post('eAxisAPI', freightApiConfig.Entities.shipmentheaderbuyer.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TaskCompletion();
                    } else {
                        toastr.warning("Please create atleast one booking to complete...");
                        AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                        AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    }
                } else {
                    toastr.warning("Please create atleast one booking to complete...");
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
            });
        }

        function TaskCompletion() {
            UpdateRecords("COMPLETED").then(function (response) {
                if (response.data.Status === "Success") {
                    CompleteWithSave().then(function (response) {
                        if (response.data.Status === "Success") {
                            toastr.success("Task completed...");
                            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            var _data = {
                                IsRefreshTask: true,
                                IsRefreshStatusCount: true,
                                Item: AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask
                            };
                            AsnUploadVnmDirectiveCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            toastr.error("Task Completion failed...");
                        }
                    });
                } else {
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    AsnUploadVnmDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
            });
        }

        function UpdateRecords(Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
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
            var _input = InputData(AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask);
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
                BookingType: 'ASN'
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/booking?q=" + _queryString, "_blank");
        }

        function StandardMenuConfig() {
            AsnUploadVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.PK,
                "ParentEntityRefCode": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": AsnUploadVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            AsnUploadVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            AsnUploadVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
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