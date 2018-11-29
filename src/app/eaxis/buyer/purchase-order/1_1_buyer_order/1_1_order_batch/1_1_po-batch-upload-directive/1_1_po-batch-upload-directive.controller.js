(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_PoBatchUploadDirectiveController", one_one_PoBatchUploadDirectiveController);

    one_one_PoBatchUploadDirectiveController.$inject = ["$q", "$window", "$timeout", "authService", "APP_CONSTANT", "apiService", "helperService", "one_poBatchUploadConfig", "appConfig", "toastr", "confirmation"];

    function one_one_PoBatchUploadDirectiveController($q, $window, $timeout, authService, APP_CONSTANT, apiService, helperService, one_poBatchUploadConfig, appConfig, toastr, confirmation) {
        var one_one_PoBatchUploadDirectiveCtrl = this;

        function Init() {
            var currentBatch = one_one_PoBatchUploadDirectiveCtrl.currentBatch[one_one_PoBatchUploadDirectiveCtrl.currentBatch.label].ePage.Entities;
            one_one_PoBatchUploadDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Batch_Upload_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBatch
            };

            InitPOUpload();
        }

        function InitPOUpload() {
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.IsNewOrder = false;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments = {};
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource = [];
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.Autherization = authService.getUserInfo().AuthToken;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.UserId = authService.getUserInfo().UserId;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.fileDetails = [];
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.fileCount = 0;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.fileSize = 10;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.IsTaskCompletion = true;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;

            var _additionalValue = {
                "Entity": "Order",
                "Path": one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo + ",po-upload"
            };

            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.AdditionalValue = JSON.stringify(_additionalValue);
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GetFileDetails = GetFileDetails;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.SelectedGridRow = SelectedGridRow;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.UploadedFiles = UploadedFiles;
            (one_one_PoBatchUploadDirectiveCtrl.currentBatch.isNew) ? one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.OrgEnable = true: one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.OrgEnable = false;

            GetUIControlList();
            InitDocument();
            GetDocumentsTypeList();
        }

        function InitDocument() {
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Submit = Submit;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Complete = Complete;
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.CheckUIControl = CheckUIControl;

            if (!one_one_PoBatchUploadDirectiveCtrl.currentBatch.isNew) {
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey = one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.PK;
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.IsNewOrder = true;
                GetDocumentsList();
            } else {
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey = one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.PK;
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.BatchUploadNo = one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo;
                CheckOrg();
            }
        }

        function GetDocumentsTypeList() {
            var _filter = {
                "DocType": one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadType
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList = response.data.Response[0];
                    }
                } else {
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList = [];
                }
            });
        }

        function GetUIControlList() {
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList = undefined;
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
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList = _controlList;
                } else {
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.UIControlList, controlId);
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.PK,
                "EntitySource": one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Source,
                "EntityRefCode": one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo,
                // "Status": "Success"
            };
            _filter.DocumentType = one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadType;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = undefined;
            $timeout(function () {
                if (one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource.length > 0) {
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.GridData = _gridData;
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
                        one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Buyer = response.data.Response[0].ROLE_Code;
                        one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Consignee_FK = response.data.Response[0].ROLE_FK;
                    } else {

                    }
                }
            });
        }

        function GetFileDetails(Files, DocType, mode) {
            if (Files.length > 0) {
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = true;
            } else {
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
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
                    DocumentType: one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.DocType,
                    DocumentName: one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.Desc,
                    PartyType_Code: one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_Code,
                    PartyType_FK: one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_FK,
                    Status: "Success",
                    EntityRefKey: one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                    EntityRefCode: one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.BatchUploadNo
                };

                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_obj]).then(function (response) {
                    if (response.data.Response) {
                        one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.PODocuments.ListSource.push(response.data.Response[0]);
                        GetDocumentsDetails();
                        one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                    } else {
                        console.log("Empty Documents Response");
                        one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                    }
                });
            });
            if (one_one_PoBatchUploadDirectiveCtrl.currentBatch.isNew) {
                BatchInsert();
            }
        }

        function SelectedGridRow($item, action) {
            if (action === "download") {
                one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = true;
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
                        one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                    }
                } else {
                    console.log("Invalid response");
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
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
            one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = true;
            var _Data = one_one_PoBatchUploadDirectiveCtrl.currentBatch[one_one_PoBatchUploadDirectiveCtrl.currentBatch.label].ePage.Entities,
                _input = _Data.Header.Data;
            _input.UIOrderBatchUpload_Buyer.Status = "";

            helperService.SaveEntity(one_one_PoBatchUploadDirectiveCtrl.currentBatch, 'Batch').then(function (response) {
                if (response.Status === "success") {
                    one_poBatchUploadConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == one_one_PoBatchUploadDirectiveCtrl.currentBatch.code) {
                                value.label = one_one_PoBatchUploadDirectiveCtrl.currentBatch.code;
                                value[one_one_PoBatchUploadDirectiveCtrl.currentBatch.code] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = one_poBatchUploadConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(one_one_PoBatchUploadDirectiveCtrl.currentBatch.label);

                    if (_index !== -1) {
                        one_poBatchUploadConfig.TabList[_index][one_poBatchUploadConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        one_poBatchUploadConfig.TabList[_index].isNew = false;
                        // helperService.refreshGrid();
                    }
                    console.log("Success");
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.Spinner = false;
                }
            });
        }

        function UpdateRecords(Consignee_code, Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey,
                "Properties": [{
                    "PropertyName": "POB_ConsigneeCode",
                    "PropertyNewValue": Consignee_code
                }, {
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

        function Submit() {
            UpdateRecords(one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Buyer, "CREATED").then(function (response) {
                if (response.data.Status === "Success") {
                    // Refresh grid
                    // helperService.refreshGrid();
                    toastr.success("Task initiated...");
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.IsNewOrder = true;
                    one_poBatchUploadConfig.GlobalVar.IsClosed = true;
                    // using for modal close
                    var item = response.data.Response;
                    one_one_PoBatchUploadDirectiveCtrl.modalClose({
                        item: item
                    });
                }
            });
        }

        function Complete() {
            var _filterInput = {
                "POB_PK": one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.BuyerOrder.API.findall.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    (response.data.Response.length > 0) ? TaskCompletion(): toastr.warning("Please create atleast one order to complete...");
                } else {
                    toastr.warning("Please create atleast one order to complete...");
                }
            });
        }

        function TaskCompletion() {
            UpdateRecords(one_one_PoBatchUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Buyer, "COMPLETED").then(function (response) {
                if (response.data.Status === "Success") {
                    // Refresh grid
                    // helperService.refreshGrid();
                    toastr.success("Task Completed...");
                    one_one_PoBatchUploadDirectiveCtrl.ePage.Masters.IsTaskCompletion = false;
                    one_poBatchUploadConfig.GlobalVar.IsClosed = true;
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