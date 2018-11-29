(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PoBatchUploadDirectiveController", PoBatchUploadDirectiveController);

    PoBatchUploadDirectiveController.$inject = ["$q", "$window", "$timeout", "authService", "APP_CONSTANT", "apiService", "helperService", "poBatchUploadConfig", "appConfig", "toastr", "confirmation"];

    function PoBatchUploadDirectiveController($q, $window, $timeout, authService, APP_CONSTANT, apiService, helperService, poBatchUploadConfig, appConfig, toastr, confirmation) {
        var PoBatchUploadDirectiveCtrl = this;

        function Init() {
            var currentBatch = PoBatchUploadDirectiveCtrl.currentBatch[PoBatchUploadDirectiveCtrl.currentBatch.label].ePage.Entities;
            PoBatchUploadDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Batch_Upload_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBatch
            };

            InitPOUpload();
        }

        function InitPOUpload() {
            PoBatchUploadDirectiveCtrl.ePage.Masters.IsNewOrder = false;
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments = {};
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource = [];
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.Autherization = authService.getUserInfo().AuthToken;
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.UserId = authService.getUserInfo().UserId;
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.fileDetails = [];
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.fileCount = 0;
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.fileSize = 10;
            PoBatchUploadDirectiveCtrl.ePage.Masters.IsTaskCompletion = true;
            PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;

            var _additionalValue = {
                "Entity": "Order",
                "Path": PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.BatchUploadNo + ",po-upload"
            };

            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.AdditionalValue = JSON.stringify(_additionalValue);
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GetFileDetails = GetFileDetails;
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.SelectedGridRow = SelectedGridRow;
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.UploadedFiles = UploadedFiles;
            (PoBatchUploadDirectiveCtrl.currentBatch.isNew) ? PoBatchUploadDirectiveCtrl.ePage.Masters.OrgEnable = true: PoBatchUploadDirectiveCtrl.ePage.Masters.OrgEnable = false;

            GetUIControlList();
            InitDocument();
            GetDocumentsTypeList();
        }

        function InitDocument() {
            PoBatchUploadDirectiveCtrl.ePage.Masters.Submit = Submit;
            PoBatchUploadDirectiveCtrl.ePage.Masters.Complete = Complete;
            PoBatchUploadDirectiveCtrl.ePage.Masters.CheckUIControl = CheckUIControl;

            if (!PoBatchUploadDirectiveCtrl.currentBatch.isNew) {
                PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey = PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.PK;
                PoBatchUploadDirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
                PoBatchUploadDirectiveCtrl.ePage.Masters.IsNewOrder = true;
                GetDocumentsList();
            } else {
                PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey = PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.PK;
                PoBatchUploadDirectiveCtrl.ePage.Masters.BatchUploadNo = PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.BatchUploadNo;
                CheckOrg();
            }
        }

        function GetDocumentsTypeList() {
            var _filter = {
                "DocType": PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.BatchUploadType
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList = response.data.Response[0];
                    }
                } else {
                    PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList = [];
                }
            });
        }

        function GetUIControlList() {
            PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "USR_FK": authService.getUserInfo().UserPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CompUserRoleAccess.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.CompUserRoleAccess.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _controlList = [];
                    if (_response.length > 0) {
                        _response.map(function (value, key) {
                            if (value.SOP_Code) {
                                _controlList.push(value.SOP_Code);
                            }
                        });
                    }
                    PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList = _controlList;
                } else {
                    PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList, controlId);
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey,
                "EntitySource": "POB"
                // "EntityRefCode": PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.BatchUploadNo,
                // "Status": "Success"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = undefined;
            $timeout(function () {
                if (PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource.length > 0) {
                    PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = _gridData;
            });
        }

        function CheckOrg() {
            // get Buyer ORG based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgUserAcess.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgUserAcess.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.Buyer = response.data.Response[0].ROLE_Code;
                        PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.Consignee_FK = response.data.Response[0].ROLE_FK;
                    } else {

                    }
                }
            });
        }

        function GetFileDetails(Files, DocType, mode) {
            if (Files.length > 0) {
                PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = true;
            } else {
                PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
            }
        }

        function UploadedFiles(Files, DocType, mode) {
            Files.map(function (value, key) {
                var _obj = {
                    FileName: value.FileName,
                    FileExtension: value.FileExtension,
                    ContentType: value.DocType,
                    IsActive: true,
                    IsNew: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: value.Doc_PK,
                    EntitySource: "POB",
                    DocumentType: PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.DocType,
                    DocumentName: PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.Desc,
                    PartyType_Code: PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_Code,
                    PartyType_FK: PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_FK,
                    Status: "Success",
                    EntityRefKey: PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey
                };

                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_obj]).then(function (response) {
                    if (response.data.Response) {
                        PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource.push(response.data.Response[0]);
                        GetDocumentsDetails();
                        PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                    } else {
                        console.log("Empty Documents Response");
                        PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                    }
                });
            });
            if (PoBatchUploadDirectiveCtrl.currentBatch.isNew) {
                BatchInsert();
            }
        }

        function SelectedGridRow($item, action) {
            if (action === "download") {
                PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = true;
                DownloadDocument($item);
            } else if (action === "delete") {
                Confirmation($item);
            }
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DMSDownload.Url + "/" + curDoc.DocFK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                        PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                    }
                } else {
                    console.log("Invalid response");
                    PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                }
            });
        }

        function Confirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Close?',
                bodyText: 'Do you want to delete the document(s)?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDocument($item)
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDocument(curDoc) {
            curDoc.IsActive = false;
            curDoc.IsDeleted = true;
            curDoc.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [curDoc]).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Document successfully deleted...");
                    GetDocumentsDetails();
                } else {
                    toastr.success("Document delete failed...");
                }
            });
        }

        function BatchInsert() {
            PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = true;
            var _Data = PoBatchUploadDirectiveCtrl.currentBatch[PoBatchUploadDirectiveCtrl.currentBatch.label].ePage.Entities,
                _input = _Data.Header.Data;
            _input.UIOrderBatchUpload.Status = "";

            helperService.SaveEntity(PoBatchUploadDirectiveCtrl.currentBatch, 'Batch').then(function (response) {
                if (response.Status === "success") {
                    poBatchUploadConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == PoBatchUploadDirectiveCtrl.currentBatch.code) {
                                value.label = PoBatchUploadDirectiveCtrl.currentBatch.code;
                                value[PoBatchUploadDirectiveCtrl.currentBatch.code] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = poBatchUploadConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(PoBatchUploadDirectiveCtrl.currentBatch.label);

                    if (_index !== -1) {
                        poBatchUploadConfig.TabList[_index][poBatchUploadConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        poBatchUploadConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                    PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                }
            });
        }

        function UpdateRecords(Consignee_code, Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey,
                "Properties": [{
                    "PropertyName": "POB_ConsigneeCode",
                    "PropertyNewValue": Consignee_code
                }, {
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

        function Submit() {
            UpdateRecords(PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.Buyer, "CREATED").then(function (response) {
                if (response.data.Status === "Success") {
                    // Refresh grid
                    helperService.refreshGrid();
                    toastr.success("Task initiated...");
                    PoBatchUploadDirectiveCtrl.ePage.Masters.IsNewOrder = true;
                    poBatchUploadConfig.GlobalVar.IsClosed = true;
                }
            });
        }

        function Complete() {
            var _filterInput = {
                "POB_PK": PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    (response.data.Response.length > 0) ? TaskCompletion(): toastr.warning("Please create atleast one order to complete...");
                } else {
                    toastr.warning("Please create atleast one order to complete...");
                }
            });
        }

        function TaskCompletion() {
            UpdateRecords(PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload.Buyer, "COMPLETED").then(function (response) {
                if (response.data.Status === "Success") {
                    // Refresh grid
                    helperService.refreshGrid();
                    toastr.success("Task Completed...");
                    PoBatchUploadDirectiveCtrl.ePage.Masters.IsTaskCompletion = false;
                    poBatchUploadConfig.GlobalVar.IsClosed = true;
                }
            });
        }

        function OpenActivity(_obj) {
            var _queryString = {
                PK: _obj.PK,
                BatchUploadNo: _obj.BatchUploadNo,
                ConfigName: "orderConfig"
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/po-order/" + _queryString, "_blank");
        }

        Init();
    }
})();
