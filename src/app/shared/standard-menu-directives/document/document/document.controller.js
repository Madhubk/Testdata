(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DocumentController", DocumentController);

    DocumentController.$inject = ["$scope", "$timeout", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "confirmation", "Upload", "toastr"];

    function DocumentController($scope, $timeout, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, confirmation, Upload, toastr) {
        /* jshint validthis: true */
        var DocumentCtrl = this;

        function Init() {
            DocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": DocumentCtrl.input
            };

            if (DocumentCtrl.ePage.Entities) {
                InitDocuments();
            }
        }

        function InitDocuments() {
            DocumentCtrl.ePage.Masters.Documents = {};
            DocumentCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            DocumentCtrl.ePage.Masters.Documents.fileDetails = [];
            DocumentCtrl.ePage.Masters.Documents.fileSize = 10;
            DocumentCtrl.ePage.Masters.Documents.UserId = authService.getUserInfo().UserId;

            var _additionalValue = {
                "Entity": DocumentCtrl.ePage.Entities.Entity,
                "Path": DocumentCtrl.ePage.Entities.Entity + "," + DocumentCtrl.ePage.Entities.EntityRefCode
            };

            DocumentCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            DocumentCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            DocumentCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            DocumentCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            DocumentCtrl.ePage.Masters.Documents.RemoveRecord = DeleteConfirmation;
            DocumentCtrl.ePage.Masters.Documents.OnDocDescChanges = OnDocDescChanges;
            DocumentCtrl.ePage.Masters.Documents.DownloadRecord = DownloadRecord;
            DocumentCtrl.ePage.Masters.Documents.Refresh = Refresh;
            DocumentCtrl.ePage.Masters.Documents.DeleteHistory = DeleteHistory;
            DocumentCtrl.ePage.Masters.Documents.AmendHistory = AmendHistory;
            DocumentCtrl.ePage.Masters.Documents.DownloadHistory = DownloadHistory;
            DocumentCtrl.ePage.Masters.Documents.CloseHistoryModal = CloseHistoryModal;

            InitSideBar();
        }

        function Refresh() {
            GetDocumentsList();
        }

        // ============================ SideBar Start ============================

        function InitSideBar() {
            DocumentCtrl.ePage.Masters.Documents.SideBar = {};
            DocumentCtrl.ePage.Masters.Documents.SideBar.OnListClick = OnSideBarListClick;

            if (DocumentCtrl.mode == "1") {
                GetDocumentFilterList();
            } else {
                GetDocumentsList();
            }
        }

        function GetDocumentFilterList() {
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "DocType",
                "Key": DocumentCtrl.ePage.Entities.Entity
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

                    DocumentCtrl.ePage.Masters.Documents.DocumentTypeList = _list;

                    OnSideBarListClick(DocumentCtrl.ePage.Masters.Documents.DocumentTypeList[0]);
                }
            });
        }

        function OnSideBarListClick($item) {
            DocumentCtrl.ePage.Masters.Documents.SideBar.ActiveDocumentType = $item;

            if ($item) {
                GetDocumentsList();
            }
        }

        function GetDocumentsList() {
            DocumentCtrl.ePage.Masters.Documents.ListSource = undefined;
            var _filter = {
                "Status": "Success",
                "EntityRefKey": DocumentCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": DocumentCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": DocumentCtrl.ePage.Entities.EntityRefCode
            };

            if (DocumentCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = DocumentCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = DocumentCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = DocumentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (DocumentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = DocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = DocumentCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = DocumentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            if (DocumentCtrl.ePage.Masters.Documents.SideBar.ActiveDocumentType && DocumentCtrl.ePage.Masters.Documents.SideBar.ActiveDocumentType.DocType != "ALL") {
                _filter.DocumentType = DocumentCtrl.ePage.Masters.Documents.SideBar.ActiveDocumentType.DocType;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DocumentCtrl.ePage.Masters.Documents.ListSource = response.data.Response;
                    DocumentCtrl.ePage.Masters.Documents.ListSourceCopy = angular.copy(response.data.Response);
                    if(DocumentCtrl.mode == "1"){
                        DocumentCtrl.ePage.Masters.Documents.ListSource.map(function (value, key) {
                            PrepareGroupMapping(value);
                        });
                    }
                } else {
                    DocumentCtrl.ePage.Masters.Documents.ListSource = [];
                }
            });
        }

        function PrepareGroupMapping($item) {
            $item.GroupMapping = undefined;
            $timeout(function () {
                $item.GroupMapping = {
                    "MappingCode": "DOCU_GRUP_APP_TNT",
                    "Item_FK": $item.PK,
                    "ItemCode": $item.FileName,
                    "ItemName": "GRUP",
                    "Title": " Group Access",
                    "AccessTo": {
                        "Type": "DOCUMENT",
                        "API": "authAPI",
                        "APIUrl": "SecMappings/FindAll",
                        "FilterID": "SECMAPP",
                        "TextField": "ItemCode",
                        "ValueField": "Item_FK",
                        "Input": [{
                            "FieldName": "AccessCode",
                            "Value": $item.DocumentType
                        }, {
                            "FieldName": "MappingCode",
                            "Value": "GRUP_DTYP_APP_TNT"
                        }, {
                            "FieldName": "AppCode",
                            "Value": authService.getUserInfo().AppCode
                        }, {
                            "FieldName": "TenantCode",
                            "Value": authService.getUserInfo().TenantCode
                        }]
                    }
                };
            });
        }

        // Delete
        function DeleteConfirmation($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    RemoveRecord($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveRecord($item, $index) {
            if ($index != -1) {
                if ($item.PK) {
                    if ($item.DocFK) {
                        DeleteDocument($item, $index);
                    }
                } else {
                    DocumentCtrl.ePage.Masters.Documents.ListSource.splice($index, 1);
                }
            }
        }

        function DeleteDocument($item, $index) {
            var _input = angular.copy($item);
            _input.IsActive = true;
            _input.Status = "Deleted";
            // _input.IsDeleted = true;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    if ($index != -1) {
                        DocumentCtrl.ePage.Masters.Documents.ListSource.splice($index, 1);
                    }
                }
            });
        }

        // Download
        function DownloadRecord($item, $index) {
            if ($index != -1) {
                if ($item.PK) {
                    DownloadDocument($item);
                }
            }
        }

        function DownloadDocument($item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + $item.PK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                        $item.DownloadCount += 1;
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        // Upload
        function GetSelectedFiles(Files, docType, mode, row) {
            if (mode == "amend") {
                row.IsNew = true;
                row.type = Files[0].type;
                row.name = Files[0].name;
            } else if (mode == "new") {
                Files.map(function (value1, key1) {
                    var _obj = {
                        type: value1.type,
                        name: value1.name,
                        IsActive: true,
                        DocumentType: docType.DocType,
                        DocumentName: docType.Desc,
                        BelongTo_Code: docType.BelongTo_Code,
                        BelongTo_FK: docType.BelongTo_FK,
                        Status: "Success",
                        IsNew: true
                    };
                    DocumentCtrl.ePage.Masters.Documents.ListSource.push(_obj);
                });
            } else if (mode == "attach") {
                if (DocumentCtrl.type) {
                    if (DocumentCtrl.type.DocType) {
                        Files.map(function (value1, key1) {
                            var _obj = {
                                type: value1.type,
                                name: value1.name,
                                IsActive: true,
                                DocumentType: DocumentCtrl.type.DocType,
                                DocumentName: DocumentCtrl.type.Desc,
                                BelongTo_Code: DocumentCtrl.type.BelongTo_Code,
                                BelongTo_FK: DocumentCtrl.type.BelongTo_FK,
                                Status: "Success",
                                IsNew: true
                            };
                            DocumentCtrl.ePage.Masters.Documents.ListSource.push(_obj);
                        });
                    } else {
                        toastr.warning("Please Select Document type...!");
                    }
                } else {
                    toastr.warning("Please Select Document type...!");
                }
            }
        }

        function GetUploadedFiles(Files, docType, mode, row) {
            Files.map(function (value1, key1) {
                DocumentCtrl.ePage.Masters.Documents.ListSource.map(function (value2, key2) {
                    if (value1.FileName == value2.name && value1.DocType == value2.type) {
                        if (mode === "amend") {
                            value2.DocumentType = docType.DocumentType;
                            AmendDocument(value1, value2, docType);
                        } else if (mode === "new" || mode === "attach") {
                            SaveDocument(value1, value2, mode);
                        }
                    }
                });
            });
        }

        function OnDocDescChanges($item, $index) {
            // var _obj = $item.FileName.split(".")[0];
            // var _index = DocumentCtrl.ePage.Masters.Documents.ListSourceCopy.map(function (value, key) {
            //     return value.PK;
            // }).indexOf($item.PK);

            // if (_index != -1) {
            //     if (DocumentCtrl.ePage.Masters.Documents.ListSourceCopy[_index].PK == $item.PK) {
            //         if (DocumentCtrl.ePage.Masters.Documents.ListSourceCopy[_index].DocumentName != $item.DocumentName && $item.DocumentName) {
            //             SaveRecord($item, $item, "update");
            //         }
            //     }
            // }

            SaveRecord($item, $item, "update");
        }

        function SaveRecord($item, $index, type) {
            if ($index != -1) {
                SaveDocument(undefined, $index, $item, type)
            }
        }

        function SaveDocument($item, row, mode, type) {
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
                    EntitySource: DocumentCtrl.ePage.Entities.EntitySource,
                    EntityRefKey: DocumentCtrl.ePage.Entities.EntityRefKey,
                    EntityRefCode: DocumentCtrl.ePage.Entities.EntityRefCode,
                    DocumentName: _object,
                    DocumentType: row.DocumentType,
                    BelongTo_Code: row.BelongTo_Code,
                    BelongTo_FK: row.BelongTo_FK
                };
            } else {
                _input = row;
                _input.IsModified = true;
            }
            _input.Status = "Success";

            if (DocumentCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.ParentEntityRefKey = DocumentCtrl.ePage.Entities.ParentEntityRefKey;
                _input.ParentEntitySource = DocumentCtrl.ePage.Entities.ParentEntitySource;
                _input.ParentEntityRefCode = DocumentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (DocumentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = DocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = DocumentCtrl.ePage.Entities.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = DocumentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    for (var x in _response) {
                        row[x] = _response[x];
                    }
                    row.IsNew = false;

                    if (type != "update" && DocumentCtrl.mode == "1") {
                        PrepareGroupMapping(row);
                    }
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Failed to Save...!");
                }
            });
        }

        // Amend/Edit
        function AmendDocument($item, row, doc) {
            var _input = doc;
            _input.DocFK = $item.Doc_PK;
            _input.ContentType = $item.DocType;
            _input.FileName = $item.FileName;
            _input.FileExtension = $item.FileExtension;

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.AmendDocument.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DocumentCtrl.ePage.Masters.Documents.ListSource.map(function (val, key) {
                        if (!val.DocumentName) {
                            DocumentCtrl.ePage.Masters.Documents.ListSource.splice(key, 1);
                        }
                    });

                    var _index = DocumentCtrl.ePage.Masters.Documents.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(doc.PK);

                    if (_index != -1) {
                        DocumentCtrl.ePage.Masters.Documents.ListSource[_index] = response.data.Response;
                        DocumentCtrl.ePage.Masters.Documents.ListSource[_index].IsNew = false;

                        if(DocumentCtrl.mode == "1"){
                            PrepareGroupMapping(response.data.Response);
                        }
                        toastr.success("Saved Successfully...!");
                    }
                } else {
                    toastr.error("Failed to Save...!");
                }
            });
        }

        // View History
        function DeleteHistory($item, type) {
            var _filter = {
                "Status": "Deleted",
                "EntityRefKey": $item.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DocumentCtrl.ePage.Masters.Documents.DeleteHistoryList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        HistoryModalInstance($item, 'delete').result.then(function (response) {}, function () {});
                    } else {
                        toastr.info("No Deleted History...!");
                    }
                } else {
                    DocumentCtrl.ePage.Masters.Documents.DeleteHistoryList = [];
                    toastr.info("No Deleted History...!");
                }
            });
        }

        function AmendHistory($item, type) {
            var _filter = {
                "Status": "AMENDED",
                "Parent_FK": $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DocumentCtrl.ePage.Masters.Documents.AmendHistoryList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        HistoryModalInstance($item, 'amend').result.then(function (response) {}, function () {});
                    } else {
                        toastr.info("No Amended History...!");
                    }
                } else {
                    DocumentCtrl.ePage.Masters.Documents.AmendHistoryList = [];
                    toastr.info("No Amended History...!");
                }
            });
        }

        function DownloadHistory($item) {
            var _filter = {
                "ClassSource": "JobDocument",
                "FieldName": "Download",
                "EntityRefKey": $item.PK,
                "EntitySource": "DOC"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataAudit.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataAudit.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DocumentCtrl.ePage.Masters.Documents.DownloadHistoryList = response.data.Response;
                    if (response.data.Response.length > 0) {
                        HistoryModalInstance($item, 'download').result.then(function (response) {}, function () {});
                    } else {
                        toastr.info("No Download History...!");
                    }
                } else {
                    DocumentCtrl.ePage.Masters.Documents.DownloadHistoryList = [];
                    toastr.info("No Download History...!");
                }
            });
        }

        function HistoryModalInstance($item, type) {
            return DocumentCtrl.ePage.Masters.HistoryModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "document-history-modal right",
                scope: $scope,
                templateUrl: "app/shared/standard-menu-directives/document/document/document-history/" + type + "-history.html"
            });
        }

        function CloseHistoryModal() {
            DocumentCtrl.ePage.Masters.HistoryModal.dismiss('cancel');
        }

        Init();
    }
})();
