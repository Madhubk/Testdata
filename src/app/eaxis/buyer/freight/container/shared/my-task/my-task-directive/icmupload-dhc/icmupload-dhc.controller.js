(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ICMUploadDhcDirectiveController", ICMUploadDhcDirectiveController);

    ICMUploadDhcDirectiveController.$inject = ["$q", "$window", "$timeout", "helperService", "apiService", "appConfig", "authService",  "toastr"];

    function ICMUploadDhcDirectiveController($q, $window, $timeout, helperService, apiService, appConfig, authService,  toastr) {
        var ICMUploadDhcDirectiveCtrl = this;

        function Init() {
            ICMUploadDhcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "ICM_Upload",
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
            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask = ICMUploadDhcDirectiveCtrl.taskObj;
            ICMUploadDhcDirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
            ICMUploadDhcDirectiveCtrl.ePage.Masters.Complete = Complete;
            ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc = {};
            ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc.SelectedGridRow = SelectedGridRow;

            if (ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            StandardMenuConfig();
        }
        
        function TaskGetById() {
            if (ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask) {
                GetDocumentsList();
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url + ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ICMUploadDhcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
            console.log(ICMUploadDhcDirectiveCtrl.ePage.Entities.Header.Data);
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": "CNT",
                "EntityRefCode": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference
                // "Status": "Success"
            };
            _filter.DocumentType = "ICM";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }
        function GetDocumentsDetails() {
            var _gridData = [];
            ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc.GridData = undefined;
            $timeout(function () {
                if (ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc.ListSource.length > 0) {
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                ICMUploadDhcDirectiveCtrl.ePage.Masters.ICMDoc.GridData = _gridData;
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
            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please Wait...";
            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            var _filterInput = {
                "POB_PK": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.BuyerCntContainer.API.findall.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TaskCompletion();
                    } else {
                        
                        ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                        ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    }
                } else {
                
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                }
       
            });
        }

        function TaskCompletion() {
            UpdateRecords("COMPLETED").then(function (response) {
                if (response.data.Status === "Success") {
                    CompleteWithSave().then(function (response) {
                        if (response.data.Status === "Success") {
                            toastr.success("Task Completed...");
                            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            var _data = {
                                IsRefreshTask: true,
                                IsRefreshStatusCount: true,
                                Item: ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask
                            };
                            ICMUploadDhcDirectiveCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                            ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                            toastr.error("Task Completion failed...");
                        }
                    });
                } else {
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    ICMUploadDhcDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    toastr.error("Task Completion failed...");
                }
            });
        }
      
        function UpdateRecords(Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
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
            var _input = InputData(ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask);
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
                BookingType: 'ICM'
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipments?q=" + _queryString, "_blank");
        }

        function StandardMenuConfig() {
            ICMUploadDhcDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.PK,
                "ParentEntityRefCode": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": ICMUploadDhcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ICMUploadDhcDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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

            ICMUploadDhcDirectiveCtrl.ePage.Masters.CommentConfig = {
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