(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadDocumentController", UploadDocumentController);

    UploadDocumentController.$inject = ["$scope", "$timeout", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "confirmation", "toastr"];

    function UploadDocumentController($scope, $timeout, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, confirmation, toastr) {
        /* jshint validthis: true */
        var UploadDocumentCtrl = this;

        function Init() {
            UploadDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": UploadDocumentCtrl.input
            };

            UploadDocumentCtrl.ePage.Masters.OnDocumentUploadChange = OnDocumentUploadChange;
            InitDocument();
            GetDocumentUploadFilterList();
        }

        function InitDocument() {
            UploadDocumentCtrl.ePage.Masters.Document = {};
            UploadDocumentCtrl.ePage.Masters.Document.ListSource = [];

            UploadDocumentCtrl.ePage.Masters.Document.Autherization = authService.getUserInfo().AuthToken;
            UploadDocumentCtrl.ePage.Masters.Document.fileDetails = [];
            UploadDocumentCtrl.ePage.Masters.Document.fileSize = 10;

            var _additionalValue = {
                "Entity": UploadDocumentCtrl.ePage.Entities.Entity,
                "Path": UploadDocumentCtrl.ePage.Entities.Entity + "," + UploadDocumentCtrl.ePage.Entities.EntityRefCode
            };

            UploadDocumentCtrl.ePage.Masters.Document.AdditionalValue = JSON.stringify(_additionalValue);
            UploadDocumentCtrl.ePage.Masters.Document.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            UploadDocumentCtrl.ePage.Masters.Document.GetUploadedFiles = GetUploadedFiles;
            UploadDocumentCtrl.ePage.Masters.Document.GetSelectedFiles = GetSelectedFiles;
        }

        function GetSelectedFiles(files, mode, docType, row) {
            UploadDocumentCtrl.ePage.Masters.TempFileName = files[0].name;
            UploadDocumentCtrl.ePage.Masters.IsLoading = true;
            if (mode == "mode3") {
                files.map(function (value, key) {
                    var _obj = {
                        type: value.type,
                        name: value.name,
                        IsActive: true,
                        DocumentType: UploadDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType,
                        DocumentName: UploadDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.Desc,
                        BelongTo_Code: UploadDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.BelongTo_Code,
                        BelongTo_FK: UploadDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.BelongTo_FK,
                        PartyType_Code: UploadDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.PartyType_Code,
                        PartyType_FK: UploadDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.PartyType_FK,
                        Status: "Success",
                        IsNew: true
                    };

                    UploadDocumentCtrl.ePage.Masters.Document.ListSource.push(_obj);
                });
            }
        }


        function GetUploadedFiles(files, mode, docType, row) {
            files.map(function (value1, key1) {
                UploadDocumentCtrl.ePage.Masters.Document.ListSource.map(function (value2, key2) {
                    if (value1.FileName == value2.name && value1.DocType == value2.type) {
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

                if (UploadDocumentCtrl.ePage.Entities.EntityRefKey) {
                    _input.EntityRefKey = UploadDocumentCtrl.ePage.Entities.EntityRefKey;
                    _input.EntitySource = UploadDocumentCtrl.ePage.Entities.EntitySource;
                    _input.EntityRefCode = UploadDocumentCtrl.ePage.Entities.EntityRefCode;
                }

                if (UploadDocumentCtrl.ePage.Entities.ParentEntityRefKey) {
                    _input.ParentEntityRefKey = UploadDocumentCtrl.ePage.Entities.ParentEntityRefKey;
                    _input.ParentEntitySource = UploadDocumentCtrl.ePage.Entities.ParentEntitySource;
                    _input.ParentEntityRefCode = UploadDocumentCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (UploadDocumentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    _input.AdditionalEntityRefKey = UploadDocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
                    _input.AdditionalEntitySource = UploadDocumentCtrl.ePage.Entities.AdditionalEntitySource;
                    _input.AdditionalEntityRefCode = UploadDocumentCtrl.ePage.Entities.AdditionalEntityRefCode;
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
                        UploadDocumentCtrl.ePage.Masters.IsLoading = false;
                        UploadDocumentCtrl.ePage.Masters.IsShowRecords = true;
                        UploadDocumentCtrl.ePage.Masters.UploadResponse = response.data.Response[0];
                    }
                } else {
                    toastr.error("Failed to Save...!");
                    UploadDocumentCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }


        function GetDocumentUploadFilterList() {
            UploadDocumentCtrl.ePage.Masters.DocumentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "DocType",
                "Key": UploadDocumentCtrl.ePage.Entities.Entity
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        UploadDocumentCtrl.ePage.Masters.DocumentTypeList = response.data.Response[0].Value;
                        GetDocumentUploadList(response.data.Response[0].Value);
                    } else {
                        var _docUploadList = [{
                            DocType: "GEN",
                            Desc: "General",
                            ListType: "Upload"
                        }];

                        UploadDocumentCtrl.ePage.Masters.ListSource = _docUploadList;
                        UploadDocumentCtrl.ePage.Masters.DocumentTypeList = "GEN";
                    }
                }
            });
        }

        function GetDocumentUploadList($item) {
            UploadDocumentCtrl.ePage.Masters.ListSource = undefined;
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
                        var _obj = {
                            DocType: "ALL",
                            Desc: "All"
                        };

                        _list.push(_obj);
                        _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);
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

                    UploadDocumentCtrl.ePage.Masters.ListSource = _list;

                    OnDocumentUploadChange(UploadDocumentCtrl.ePage.Masters.ListSource[0]);
                }
            });
        }

        function OnDocumentUploadChange($item) {
            UploadDocumentCtrl.ePage.Masters.DocumentUpload = {};
            UploadDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload = angular.copy($item);

            if ($item) {

            } else {
                UploadDocumentCtrl.ePage.Masters.Document.ListSource = [];
            }
        }

        Init();
    }
})();
