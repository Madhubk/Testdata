(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadDocumentOrdController", UploadDocumentOrdController);

    UploadDocumentOrdController.$inject = ["authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr"];

    function UploadDocumentOrdController(authService, apiService, helperService, appConfig, APP_CONSTANT, toastr) {
        /* jshint validthis: true */
        var UploadDocumentOrdCtrl = this;

        function Init() {
            UploadDocumentOrdCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": UploadDocumentOrdCtrl.input
            };

            InitDocument();
            GetDocumentUploadFilterList(UploadDocumentOrdCtrl.docVisible);
        }

        function InitDocument() {
            UploadDocumentOrdCtrl.ePage.Masters.OnDocumentUploadChange = OnDocumentUploadChange;
            UploadDocumentOrdCtrl.ePage.Masters.DocTypeDsc = UploadDocumentOrdCtrl.docTypeDsc;
            UploadDocumentOrdCtrl.ePage.Masters.Document = {};
            UploadDocumentOrdCtrl.ePage.Masters.Document.ListSource = [];

            UploadDocumentOrdCtrl.ePage.Masters.Document.Autherization = authService.getUserInfo().AuthToken;
            UploadDocumentOrdCtrl.ePage.Masters.Document.fileDetails = [];
            UploadDocumentOrdCtrl.ePage.Masters.Document.fileSize = 10;

            var _additionalValue = {
                "Entity": UploadDocumentOrdCtrl.ePage.Entities.Entity,
                "Path": UploadDocumentOrdCtrl.ePage.Entities.Entity + "," + UploadDocumentOrdCtrl.ePage.Entities.EntityRefCode
            };

            UploadDocumentOrdCtrl.ePage.Masters.Document.AdditionalValue = JSON.stringify(_additionalValue);
            UploadDocumentOrdCtrl.ePage.Masters.Document.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            UploadDocumentOrdCtrl.ePage.Masters.Document.GetUploadedFiles = GetUploadedFiles;
            UploadDocumentOrdCtrl.ePage.Masters.Document.GetSelectedFiles = GetSelectedFiles;
            UploadDocumentOrdCtrl.ePage.Masters.IsUplaodDisable = false;
        }

        function GetSelectedFiles(files, mode, docType, row) {
            UploadDocumentOrdCtrl.ePage.Masters.IsUplaodDisable = true;
            UploadDocumentOrdCtrl.ePage.Masters.TempFileName = files[0].name;
            UploadDocumentOrdCtrl.ePage.Masters.IsLoading = true;
            if (mode == "mode3") {
                files.map(function (value, key) {
                    var _obj = {
                        type: value.type,
                        name: value.name,
                        IsActive: true,
                        DocumentType: UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType,
                        DocumentName: UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.Desc,
                        BelongTo_Code: UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.BelongTo_Code,
                        BelongTo_FK: UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.BelongTo_FK,
                        PartyType_Code: UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.PartyType_Code,
                        PartyType_FK: UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.PartyType_FK,
                        Status: "Success",
                        IsNew: true
                    };

                    UploadDocumentOrdCtrl.ePage.Masters.Document.ListSource.push(_obj);
                });
            }
        }


        function GetUploadedFiles(files, mode, docType, row) {
            files.map(function (value1, key1) {
                UploadDocumentOrdCtrl.ePage.Masters.Document.ListSource.map(function (value2, key2) {
                    if (value1.FileName == value2.name) {
                        SaveDocument(value1, value2, mode);
                    }
                });
            });
        }

        function SaveDocument($item, row, mode) {
            if ($item) {
                var _index = $item.FileName.indexOf(".");
                if (_index != -1) {
                    var _object = $item.FileName.split(".")[0];
                }

                var _input = {
                    FileName: $item.FileName,
                    FileExtension: $item.FileExtension,
                    ContentType: $item.DocType,
                    DocFK: $item.Doc_PK,
                    DocumentName: _object,
                    DocumentType: row.DocumentType,
                    BelongTo_Code: row.BelongTo_Code,
                    BelongTo_FK: row.BelongTo_FK,
                    PartyType_Code: row.PartyType_Code,
                    PartyType_FK: row.PartyType_FK,
                    Status: "Success",
                    IsActive: true,
                    IsModified: true
                };

                if (UploadDocumentOrdCtrl.ePage.Entities.EntityRefKey) {
                    _input.EntityRefKey = UploadDocumentOrdCtrl.ePage.Entities.EntityRefKey;
                    _input.EntitySource = UploadDocumentOrdCtrl.ePage.Entities.EntitySource;
                    _input.EntityRefCode = UploadDocumentOrdCtrl.ePage.Entities.EntityRefCode;
                }

                if (UploadDocumentOrdCtrl.ePage.Entities.ParentEntityRefKey) {
                    _input.ParentEntityRefKey = UploadDocumentOrdCtrl.ePage.Entities.ParentEntityRefKey;
                    _input.ParentEntitySource = UploadDocumentOrdCtrl.ePage.Entities.ParentEntitySource;
                    _input.ParentEntityRefCode = UploadDocumentOrdCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (UploadDocumentOrdCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    _input.AdditionalEntityRefKey = UploadDocumentOrdCtrl.ePage.Entities.AdditionalEntityRefKey;
                    _input.AdditionalEntitySource = UploadDocumentOrdCtrl.ePage.Entities.AdditionalEntitySource;
                    _input.AdditionalEntityRefCode = UploadDocumentOrdCtrl.ePage.Entities.AdditionalEntityRefCode;
                }
            } else {
                var _input = angular.copy(row);
                _input.DocumentName = row.DocumentNameTemp;
                _input.Status = "Success";
                _input.IsModified = true;
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        for (var x in _response) {
                            row[x] = _response[x];
                        }
                        row.IsNew = false;
                        row.DocumentNameTemp = row.DocumentName;
                        toastr.success("Document Uploaded Successfully");
                        UploadDocumentOrdCtrl.ePage.Masters.IsLoading = false;
                        UploadDocumentOrdCtrl.ePage.Masters.IsUplaodDisable = false;
                        UploadDocumentOrdCtrl.isUploaded({
                            $item: $item
                        });
                        // UploadDocumentOrdCtrl.ePage.Masters.IsShowRecords = true;
                        // UploadDocumentOrdCtrl.ePage.Masters.UploadResponse = response.data.Response[0];
                    } else {
                        toastr.error("Failed to Upload...!");
                        UploadDocumentOrdCtrl.ePage.Masters.IsLoading = false;
                        UploadDocumentOrdCtrl.ePage.Masters.IsUplaodDisable = false;
                    }
                } else {
                    toastr.error("Failed to Upload...!");
                    UploadDocumentOrdCtrl.ePage.Masters.IsLoading = false;
                    UploadDocumentOrdCtrl.ePage.Masters.IsUplaodDisable = false;
                }
            });
        }


        function GetDocumentUploadFilterList(type) {
            UploadDocumentOrdCtrl.ePage.Masters.DocumentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "DocType",
                "Key": (!type ? UploadDocumentOrdCtrl.ePage.Entities.Entity : type)
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        UploadDocumentOrdCtrl.ePage.Masters.DocumentTypeList = response.data.Response[0].Value;
                        GetDocumentUploadList(response.data.Response[0].Value);
                    } else {
                        var _docUploadList = [{
                            DocType: "GEN",
                            Desc: "General",
                            ListType: "Upload"
                        }];

                        UploadDocumentOrdCtrl.ePage.Masters.ListSource = _docUploadList;
                        UploadDocumentOrdCtrl.ePage.Masters.DocumentTypeList = "GEN";
                    }
                }
            });
        }

        function GetDocumentUploadList($item) {
            UploadDocumentOrdCtrl.ePage.Masters.ListSource = undefined;
            var _filter = {
                DocType: $item
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = angular.copy(response.data.Response);
                    if (!_list) {
                        _list = [];
                    }

                    if (_list.length > 0) {
                        // var _obj = {
                        //     DocType: "ALL",
                        //     Desc: "All"
                        // };

                        // _list.push(_obj);
                        // _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);
                    } else {
                        _list = [{
                            DocType: "ALL",
                            Desc: "All"
                        }, {
                            DocType: "GEN",
                            Desc: "General",
                            ListType: "Upload"
                        }];
                    }

                    UploadDocumentOrdCtrl.ePage.Masters.ListSource = _list;

                    OnDocumentUploadChange(UploadDocumentOrdCtrl.ePage.Masters.ListSource[0]);
                }
            });
        }

        function OnDocumentUploadChange($item) {
            UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload = {};
            UploadDocumentOrdCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload = angular.copy($item);
            if ($item) {} else {
                UploadDocumentOrdCtrl.ePage.Masters.Document.ListSource = [];
            }
        }

        Init();
    }
})();