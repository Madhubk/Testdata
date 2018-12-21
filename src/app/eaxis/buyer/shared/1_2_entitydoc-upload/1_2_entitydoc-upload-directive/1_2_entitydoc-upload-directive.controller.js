(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneTwoEntityDocUploadDirectiveController", oneTwoEntityDocUploadDirectiveController);

    oneTwoEntityDocUploadDirectiveController.$inject = ["APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "errorWarningService", "confirmation", "toastr"];

    function oneTwoEntityDocUploadDirectiveController(APP_CONSTANT, authService, apiService, helperService, appConfig, errorWarningService, confirmation, toastr) {
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
        console.log(oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities);
            InitAsnFun();
        }



        function InitAsnFun() {
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.SourceRefKey=oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK

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
            oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.TitleName=oneTwoEntityDocUploadDirectiveCtrl.titleName;

            GetDocumentsTypeList();
            GetDocumentsDetails();
        }


        // Asn upload 
        function GetDocumentsDetails() {
            var _input = {
                "EntityRefKey": oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "SHP",
                "DocumentType": oneTwoEntityDocUploadDirectiveCtrl.docType,
                // "EntityRefCode": oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "Status": "Success"
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.List = response.data.Response;
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments = response.data.Response;
            });
        }

        function GetDocumentsTypeList() {
            var _filter = {
                "DocType":oneTwoEntityDocUploadDirectiveCtrl.docType
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
                    EntitySource: "SHP",
                    DocumentType: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.DocType,
                    DocumentName: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.Desc,
                    PartyType_Code: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_Code,
                    PartyType_FK: oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.DocTypeList.PartyType_FK,
                    Status: "Success",
                    EntityRefKey: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.PK,
                    EntityRefCode: oneTwoEntityDocUploadDirectiveCtrl.ePage.Entities.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo,
                };
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.List.push(_obj);
            });
        }

        function UploadedFiles(Files, DocType, mode) {
            Files.map(function (value1, key1) {
                oneTwoEntityDocUploadDirectiveCtrl.ePage.Masters.ASNDocuments.List.map(function (value2, key2) {
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
                    EntitySource: 'SHP',
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
                    console.log("Empty Documents Response");
                }
            });
            row.IsNew = false;
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
                    GetDocumentsDetails();
                } else {
                    toastr.success("Document delete failed...");
                }
            });
        }

        Init();
    }
})();