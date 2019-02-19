(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneTwoEntityDocUploadDirectiveController", oneTwoEntityDocUploadDirectiveController);

    oneTwoEntityDocUploadDirectiveController.$inject = ["APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "errorWarningService", "confirmation", "toastr", "$timeout"];

    function oneTwoEntityDocUploadDirectiveController(APP_CONSTANT, authService, apiService, helperService, appConfig, errorWarningService, confirmation, toastr, $timeout) {
        /* jshint validthis: true */
        var oneTwoEntityDocUploadDirectiveCtrl = this;

        function Init() {
            var currentAsn = oneTwoEntityDocUploadDirectiveCtrl.currentAsn[oneTwoEntityDocUploadDirectiveCtrl.currentAsn.label].ePage.Entities;
            oneTwoEntityDocUploadDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "ASN_Upload_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAsn
            };
            InitAsnFun();
        }



        function InitAsnFun() {
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.SourceRefKey = oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK

            // ASN file upload
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments = {};
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.ListSource = [];
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.Autherization = authService.getUserInfo().AuthToken;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.UserId = authService.getUserInfo().UserId;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.fileDetails = [];
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.fileCount = 0;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.fileSize = 10;

            var _additionalValue = {
                "Entity": "Booking",
                "Path": oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo + ",asn-upload"
            };
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.AdditionalValue = JSON.stringify(_additionalValue);
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.GetFileDetails = GetFileDetails;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.SelectedGridRow = SelectedGridRow;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.UploadedFiles = UploadedFiles;
            //oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.DocType=oneTwoEntityDocUploadDirectiveCtrl.docType;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.TitleName = oneTwoEntityDocUploadDirectiveCtrl.titleName;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.UpdateRecords = UpdateRecords;

            GetUIControlList();
            InitDocument();
            GetDocumentsTypeList();
        }

        function InitDocument() {
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.CheckUIControl = CheckUIControl;
            if (!oneTwoEntityDocUploadDirectiveCtrl.currentAsn.isNew) {
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey = oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK;
                GetDocumentsDetails();
            } else {
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.GridData = [];
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey = oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK;
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.BatchUploadNo = oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo;
                CheckOrg();
            }
        }

        function AutoCompleteOnSelect($item) {
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Buyer = $item.Code;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Consignee_FK = $item.PK;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.ConsigneeName = $item.FullName;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.PODocuments.isDisabled = false;
        }

        function SelectedLookupData($item) {
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Buyer = $item.data.entity.Code;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Consignee_FK = $item.data.entity.PK;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.ConsigneeName = $item.data.entity.FullName;
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.PODocuments.isDisabled = false;
        }
        // Asn upload 
        function GetDocumentsDetails() {
            var _input = {
                "EntityRefKey": oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Source,
                "DocumentType": oneTwoEntityDocUploadDirectiveCtrl.docType,
                // "EntityRefCode": oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "Status": "Success"
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
                if (response.data.Response) {
                    oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.ListSource = response.data.Response;
                    GetDocumentDetail();
                } else {
                    oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentDetail() {
            var _gridData = [];
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.GridData = undefined;
            $timeout(function () {
                if (oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.ListSource.length > 0) {
                    oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.GridData = _gridData;
            });
        }

        function GetDocumentsTypeList() {
            var _filter = {
                "DocType": oneTwoEntityDocUploadDirectiveCtrl.docType
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList = response.data.Response[0];
                    }
                } else {
                    oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList = [];
                }
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
                        oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Buyer = response.data.Response[0].ROLE_Code;
                        oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Consignee_FK = response.data.Response[0].ROLE_FK;
                        oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.ConsigneeName = response.data.Response[0].ORG_FullName;
                    } else {

                    }
                }
            });
        }

        function GetUIControlList() {
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.UIControlList = undefined;
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
                    oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.UIControlList = _controlList;
                } else {
                    oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.UIControlList, controlId);
        }


        function GetFileDetails(Files, DocType, mode) {
            Files.map(function (value, key) {
                var _obj = {
                    type: value.type,
                    FileName: value.name,
                    IsActive: true,
                    IsNew: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: value.Doc_PK,
                    EntitySource: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Source,
                    DocumentType: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.DocType,
                    DocumentName: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.Desc,
                    PartyType_Code: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_Code,
                    PartyType_FK: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_FK,
                    Status: "Success",
                    EntityRefKey: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                    EntityRefCode: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo,
                };
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.ListSource.push(_obj);
            });
        }

        function UploadedFiles(Files, DocType, mode) {
            Files.map(function (value1, key1) {
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.ListSource.map(function (value2, key2) {
                    if (value1.FileName == value2.FileName && value1.DocType == value2.type) {
                        SaveDocument(value1, value2);
                    }
                });
            });
        }

        function SaveDocument($item, row) {
            var _input = {};
            if ($item) {
                var _index = $item.FileName.indexOf(".");
                if (_index != -1) {
                    var _object = $item.FileName.split(".")[0];
                }
                var _input = {
                    FileName: $item.FileName,
                    FileExtension: $item.FileExtension,
                    ContentType: $item.DocType,
                    IsActive: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: $item.Doc_PK,
                    EntitySource: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.Source,
                    EntityRefKey: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                    EntityRefCode: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.BatchUploadNo,
                    DocumentName: _object,
                    PartyType_Code: row.PartyType_Code,
                    PartyType_FK: row.PartyType_FK,
                    DocumentType: row.DocumentType,
                    Status: "Success"
                };
            }
            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    GetDocumentsDetails();
                } else {
                    GetDocumentsDetails();
                    console.log("Empty Documents Response");
                }
            });
            row.IsNew = false;
        }

        function UpdateRecords(Consignee_code, Status) {
            var deferred = $q.defer();
            var _tempObj = {
                "EntityRefPK": oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.SourceEntityRefKey,
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


        function SelectedGridRow($item, action) {
            if (action === "download") {
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
                    }
                } else {
                    console.log("Invalid response");
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
                    GetDocumentDetail();
                } else {
                    toastr.success("Document delete failed...");
                }
            });
        }

        Init();
    }
})();