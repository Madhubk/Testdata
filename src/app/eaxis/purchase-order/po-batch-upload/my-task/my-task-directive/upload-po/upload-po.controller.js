(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadPODirectiveController", UploadPODirectiveController);

    UploadPODirectiveController.$inject = ["$q", "$window", "$timeout", "helperService", "apiService", "appConfig", "authService", "toastr"];

    function UploadPODirectiveController($q, $window, $timeout, helperService, apiService, appConfig, authService, toastr) {
        var UploadPODirectiveCtrl = this;

        function Init() {
            UploadPODirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_PO",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
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
        }

        function TaskGetById() {
            if (UploadPODirectiveCtrl.ePage.Masters.MyTask) {
                GetDocumentsList();
                var url = "PorOrderBatchUpload/GetById/";
                apiService.get("eAxisAPI", url + UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        UploadPODirectiveCtrl.ePage.Masters.PoBatchList = response.data.Response;
                    }
                });
            }
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": "POB"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
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
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
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
                    toastr.success("Task Completed...");
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
                    // var _data = {
                    //     IsRefreshTask: true,
                    //     IsRefreshStatusCount: true,
                    //     Item: UploadPODirectiveCtrl.ePage.Masters.MyTask
                    // };
                    // UploadPODirectiveCtrl.OnTaskComplete({
                    //     $item: _data
                    // });
                } else {
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
                    UploadPODirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
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
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderBatchUpload.API.UpdateRecords.Url, [_tempObj]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function OpenActivity(_obj) {
            var _queryString = {
                PK: _obj.EntityRefKey,
                BatchUploadNo: _obj.KeyReference,
                ConfigName: "orderConfig"
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/po-order/" + _queryString, "_blank");
            // $window.open("#/EA/single-record-view/po-batch-upload/" + _queryString, "_blank");
        }

        Init();
    }
})();