(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DocDirectiveController", DocDirectiveController);

    DocDirectiveController.$inject = ["apiService", "appConfig", "helperService", "authService", "APP_CONSTANT", "toastr"];

    function DocDirectiveController(apiService, appConfig, helperService, authService, APP_CONSTANT, toastr) {
        /* jshint validthis: true */
        var DocDirectiveCtrl = this;

        function Init() {
            DocDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Doc_Directive",
                "Masters": {},
                "Meta": {},
                "Entities": {},
            };

            GetDocumentsInit();
        }

        function GetDocumentsInit() {
            DocDirectiveCtrl.ePage.Masters.Documents = {};
            DocDirectiveCtrl.ePage.Masters.Autherization = authService.getUserInfo().AuthToken;
            DocDirectiveCtrl.ePage.Masters.fileDetails = [];
            DocDirectiveCtrl.ePage.Masters.fileSize = 10;
            DocDirectiveCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;
            DocDirectiveCtrl.ePage.Masters.DocObj = DocDirectiveCtrl.currentObj

            var _additionalValue = {
                "Entity": DocDirectiveCtrl.entity,
                "Path": DocDirectiveCtrl.ePage.Masters.DocObj.KeyReference
            };

            DocDirectiveCtrl.ePage.Masters.AdditionalValue = JSON.stringify(_additionalValue);
            DocDirectiveCtrl.ePage.Masters.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            DocDirectiveCtrl.ePage.Masters.GetUploadedFiles = GetUploadedFiles;
            DocDirectiveCtrl.ePage.Masters.GetSelectedFiles = GetSelectedFiles;
            DocDirectiveCtrl.ePage.Masters.DownloadDoc = DownloadDoc;
            DocDirectiveCtrl.ePage.Masters.DocumentDetails = [];
            
            GetDocType();
            GetJobDocuments();
        }

        function GetDocType() {
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "DocType",
                "Key": DocDirectiveCtrl.entity
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if (!_response.Value) {
                            _response.Value = "GEN";
                        }
                        GetDocumentTypeList(_response.Value);
                    } else {
                        GetDocumentTypeList("GEN");
                    }
                }
            });
        }

        function GetJobDocuments() {
            var _input = {
                "EntityRefKey": DocDirectiveCtrl.ePage.Masters.DocObj.EntityRefKey,
                "EntitySource": DocDirectiveCtrl.ePage.Masters.DocObj.EntitySource,
                "EntityRefCode": DocDirectiveCtrl.ePage.Masters.DocObj.KeyReference,
                "Status": "Success"
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
                DocDirectiveCtrl.ePage.Masters.DocumentDetails = response.data.Response;
            });
        }

        function GetDocumentTypeList($item) {
            var _filter = {
                DocType: $item
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    var _obj = {
                        DocType: "ALL",
                        Desc: "All"
                    };

                    _list.push(_obj);
                    _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

                    DocDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = _list;
                }
            });
        }

        function GetSelectedFiles(Files, docType) {
            Files.map(function (value, key) {
                var _obj = {
                    type: value.type,
                    FileName: value.name,
                    IsActive: true,
                    DocumentType: docType.DocType,
                    DocumentName: docType.Desc,
                    DocFK: value.Doc_PK,
                    Status: "Success",
                    IsNew: true,
                    IsDeleted: false,
                    UploadedDateTime: new Date()
                };
                DocDirectiveCtrl.ePage.Masters.DocumentDetails.push(_obj);
            });

        }

        function GetUploadedFiles(Files, docType) {
            Files.map(function (value1, key1) {
                DocDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value2, key2) {
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
                    EntitySource: DocDirectiveCtrl.ePage.Masters.DocObj.EntitySource,
                    EntityRefKey: DocDirectiveCtrl.ePage.Masters.DocObj.EntityRefKey,
                    EntityRefCode: DocDirectiveCtrl.ePage.Masters.DocObj.KeyReference,
                    DocumentName: _object,
                    DocumentType: row.DocumentType
                };
            }
            _input.Status = "Success"
            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    for (var x in _response) {
                        row[x] = _response[x];
                    }
                    row.IsNew = false;
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Failed to Save...!");
                }
            });

        }

        function DownloadDoc(doc) {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DMSDownload.Url + "/" + doc.DocFK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        Init();
    }
})();