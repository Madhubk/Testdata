(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PoBatchUploadDirectiveController", PoBatchUploadDirectiveController);

    PoBatchUploadDirectiveController.$inject = ["$window", "$timeout", "authService", "APP_CONSTANT", "apiService", "helperService", "poBatchUploadConfig", "appConfig", "toastr"];

    function PoBatchUploadDirectiveController($window, $timeout, authService, APP_CONSTANT, apiService, helperService, poBatchUploadConfig, appConfig, toastr) {
        var PoBatchUploadDirectiveDirectiveCtrl = this;

        function Init() {
            var currentBatch = PoBatchUploadDirectiveDirectiveCtrl.currentBatch[PoBatchUploadDirectiveDirectiveCtrl.currentBatch.label].ePage.Entities;
            PoBatchUploadDirectiveDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Batch_Upload_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBatch
            };

            InitPOUpload();
        }

        function InitPOUpload() {
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.IsNewOrder = false;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments = {};
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.ListSource = [];
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.autherization = authService.getUserInfo().AuthToken;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.fileDetails = [];
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.fileCount = 0;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.fileSize = 10;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.IsTaskCompletion = true;

            var _additionalValue = {
                "Entity": "Order",
                "Path": PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.BatchUploadNo + ",po-upload"
            };
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.additionalValue = JSON.stringify(_additionalValue);
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.GetFileDetails = GetFileDetails;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.SelectedGridRow = SelectedGridRow;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.DownloadDocument = DownloadDocument;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.UploadedFiles = UploadedFiles;

            // Grid
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.gridConfig = appConfig.Entities.JobDocument.Grid.GridConfig;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.gridConfig._columnDef = appConfig.Entities.JobDocument.Grid.ColumnDef;

            InitDocument();
        }

        function InitDocument() {
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.Submit = Submit;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.Complete = Complete;
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            
            if (!PoBatchUploadDirectiveDirectiveCtrl.currentBatch.isNew) {
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.SourceEntityRefKey = PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.PK;
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.IsNewOrder = true;
                GetDocumentsList();
            } else {
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.SourceEntityRefKey = PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.PK;
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.BatchUploadNo = PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.BatchUploadNo;
            }
        }
        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.SourceEntityRefKey,
                "EntitySource": "POB"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.GridData = undefined;
            $timeout(function () {
                if (PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.ListSource.length > 0) {
                    PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.GridData = _gridData;
            });
        }

        function GetFileDetails(TotCount, Files) {
            Files.map(function (value, key) {
                var _obj = {
                    FileName: value.FileName,
                    FileExtension: value.FileExtension,
                    ContentType: value.DocType,
                    IsActive: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: value.Doc_PK,
                    EntitySource: "POB",
                    EntityRefKey: PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.SourceEntityRefKey
                };
                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_obj]).then(function (response) {
                    if (response.data.Response) {
                        PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.ListSource.push(response.data.Response[0]);
                        GetDocumentsDetails();
                    } else {
                        console.log("Empty Documents Response");
                    }
                });
            });
            if (PoBatchUploadDirectiveDirectiveCtrl.currentBatch.isNew) {
                BatchInsert();
            }

        }

        function UploadedFiles(Files) {
            Files.map(function (value, key) {
                var _obj = {
                    FileName: value.FileName,
                    FileExtension: value.FileExtension,
                    ContentType: value.DocType,
                    IsActive: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: value.Doc_PK,
                    EntitySource: "POB",
                    EntityRefKey: PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.SourceEntityRefKey
                };

                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_obj]).then(function (response) {
                    if (response.data.Response) {
                        PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.PODocuments.ListSource.push(response.data.Response[0]);
                        GetDocumentsDetails();
                    } else {
                        console.log("Empty Documents Response");
                    }
                });
            });
            if (PoBatchUploadDirectiveDirectiveCtrl.currentBatch.isNew) {
                BatchInsert();
            }
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

        function BatchInsert() {
            var _Data = PoBatchUploadDirectiveDirectiveCtrl.currentBatch[PoBatchUploadDirectiveDirectiveCtrl.currentBatch.label].ePage.Entities,
                _input = _Data.Header.Data;

            helperService.SaveEntity(PoBatchUploadDirectiveDirectiveCtrl.currentBatch, 'Batch').then(function (response) {
                if (response.Status === "success") {
                    poBatchUploadConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == PoBatchUploadDirectiveDirectiveCtrl.currentBatch.code) {
                                value.label = PoBatchUploadDirectiveDirectiveCtrl.currentBatch.code;
                                value[PoBatchUploadDirectiveDirectiveCtrl.currentBatch.code] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = poBatchUploadConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(PoBatchUploadDirectiveDirectiveCtrl.currentBatch.label);

                    if (_index !== -1) {
                        poBatchUploadConfig.TabList[_index][poBatchUploadConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        poBatchUploadConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
            });
        }

        function CreateNewOrder() {
            helperService.getFullObjectUsingGetById(PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.API.GetByIDOrder.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIPorOrderHeader.POB_FK = PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.SourceEntityRefKey;
                    response.data.Response.Response.UIPorOrderHeader.BatchUploadNo = PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.BatchUploadNo;
                    var _obj = {
                        entity: response.data.Response.Response.UIPorOrderHeader,
                        data: response.data.Response.Response
                    };
                    PoBatchUploadDirectiveDirectiveCtrl.addTab({
                        $item: _obj
                    });
                    // poBatchUploadConfig.Entities.AddTab(_obj, true, true, 'OrderNo');
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function Complete() {
            apiService.post("eAxisAPI", appConfig.Entities.BatchUploadList.API.CompletePOUpload.Url + PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.PK + '/' + PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.BatchUploadNo).then(function (response) {
                toastr.success("Task Completed...");
                PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.IsTaskCompletion = false;
                if (response.data.Response) {
                }
            });
        }

        function Submit() {
            apiService.post("eAxisAPI", appConfig.Entities.BatchUploadList.API.InitatePOUpload.Url + PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.PK + '/' + PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.BatchUploadNo).then(function (response) {
                if (response.data.Response) {
                    $window.alert("Instance #"+ response.data.Response.InstanceNo);
                    toastr.success("Task initiated..." + response.data.Response.InstanceNo);
                    PoBatchUploadDirectiveDirectiveCtrl.ePage.Masters.IsNewOrder = true;
                }
            });
        }

        function SingleRecordView() {
            var _queryString = {
                PK: PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.PK,
                BatchUploadNo: PoBatchUploadDirectiveDirectiveCtrl.ePage.Entities.Header.Data.BatchUploadNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/po-batch-upload/" + _queryString, "_blank");
        }

        Init();
    }
})();