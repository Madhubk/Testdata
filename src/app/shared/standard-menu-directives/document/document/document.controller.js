(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SMDocumentController", SMDocumentController);

    SMDocumentController.$inject = ["$scope", "$timeout", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "confirmation", "toastr"];

    function SMDocumentController($scope, $timeout, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, confirmation, toastr) {
        /* jshint validthis: true */
        var SMDocumentCtrl = this;

        function Init() {
            SMDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "SM_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": SMDocumentCtrl.input
            };

            (SMDocumentCtrl.config) ? SMDocumentCtrl.Config = SMDocumentCtrl.config: SMDocumentCtrl.Config = {};

            if (SMDocumentCtrl.ePage.Entities) {
                InitHeader();
                InitDocument();
                InitRelatedDocument();

                if (SMDocumentCtrl.mode == "2") {
                    if (SMDocumentCtrl.type) {
                        GetDocumentList();
                        if (!SMDocumentCtrl.Config.IsDisableRelatedDocument) {
                            GetParentDocumentList();
                        }
                    } else {
                        SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                        SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = {};
                    }
                } else {
                    InitDocumentUpload();
                    InitDocumentGenerate();
                }

                SMDocumentCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;
                SMDocumentCtrl.ePage.Masters.CloseHistoryModal = CloseHistoryModal;
            }
        }

        // region Header
        function InitHeader() {
            SMDocumentCtrl.ePage.Masters.Header = {};

            SMDocumentCtrl.ePage.Masters.Header.RefreshAll = RefreshAll;
            SMDocumentCtrl.ePage.Masters.Header.ViewAllDeleteHistroy = ViewAllDeleteHistroy;
            SMDocumentCtrl.ePage.Masters.Header.OnHeaderRadioButtonChange = OnHeaderRadioButtonChange;

            if (!SMDocumentCtrl.Config.IsDisableUpload && !SMDocumentCtrl.Config.IsDisableGenerate) {
                SMDocumentCtrl.ePage.Masters.Header.RadioButtonValue = "Upload";
            } else if (SMDocumentCtrl.Config.IsDisableUpload == true) {
                SMDocumentCtrl.ePage.Masters.Header.RadioButtonValue = "Generate";
            } else if (SMDocumentCtrl.Config.IsDisableGenerate == true) {
                SMDocumentCtrl.ePage.Masters.Header.RadioButtonValue = "Upload";
            }

            if (SMDocumentCtrl.Config.IsDisableRelatedDocument == true) {
                SMDocumentCtrl.ePage.Masters.ActiveTabIndex = 0;
            }
        }

        function OnHeaderRadioButtonChange() {
            SMDocumentCtrl.ePage.Masters.Header.RadioButtonValue;
        }

        function RefreshAll() {
            GetDocumentList();
            if (!SMDocumentCtrl.Config.IsDisableRelatedDocument) {
                GetParentDocumentList();
            }
        }

        function ViewAllDeleteHistroy() {
            SMDocumentCtrl.ePage.Masters.Header.DeleteAllHistoryList = undefined;
            var _filter = {
                "Status": "Deleted",
                "EntityRefKey": SMDocumentCtrl.ePage.Entities.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    SMDocumentCtrl.ePage.Masters.Header.DeleteAllHistoryList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        HistoryModalInstance('delete').result.then(function (response) {}, function () {});
                    } else {
                        toastr.info("No Deleted History...!");
                    }
                } else {
                    SMDocumentCtrl.ePage.Masters.Header.DeleteAllHistoryList = [];
                    toastr.info("No Deleted History...!");
                }
            });
        }
        // endregion

        // region Document
        function InitDocument() {
            SMDocumentCtrl.ePage.Masters.Document = {};

            SMDocumentCtrl.ePage.Masters.Document.Autherization = authService.getUserInfo().AuthToken;
            SMDocumentCtrl.ePage.Masters.Document.fileDetails = [];
            SMDocumentCtrl.ePage.Masters.Document.fileSize = 1024;

            var _additionalValue = {
                "Entity": SMDocumentCtrl.ePage.Entities.Entity,
                "Path": SMDocumentCtrl.ePage.Entities.Entity + "," + SMDocumentCtrl.ePage.Entities.EntityRefCode
            };

            SMDocumentCtrl.ePage.Masters.Document.AdditionalValue = JSON.stringify(_additionalValue);
            SMDocumentCtrl.ePage.Masters.Document.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            SMDocumentCtrl.ePage.Masters.Document.GetUploadedFiles = GetUploadedFiles;
            SMDocumentCtrl.ePage.Masters.Document.GetSelectedFiles = GetSelectedFiles;
            SMDocumentCtrl.ePage.Masters.Document.ViewDownloadHistroy = ViewDownloadHistroy;
            SMDocumentCtrl.ePage.Masters.Document.ViewAmendHistroy = ViewAmendHistroy;

            SMDocumentCtrl.ePage.Masters.Document.OnDocDescChanges = OnDocDescChanges;
            SMDocumentCtrl.ePage.Masters.Document.DownloadRecord = DownloadRecord;
            SMDocumentCtrl.ePage.Masters.Document.DeleteDocument = DeleteConfirmation;
        }

        function GetDocumentList() {
            SMDocumentCtrl.ePage.Masters.Document.ListSource = undefined;
            var _filter = {
                "Status": "Success",
                // "CommonRefKey": SMDocumentCtrl.ePage.Entities.EntityRefKey
            };

            if (SMDocumentCtrl.ePage.Entities.EntityRefKey) {
                _filter.EntityRefKey = SMDocumentCtrl.ePage.Entities.EntityRefKey;
                _filter.EntitySource = SMDocumentCtrl.ePage.Entities.EntitySource;
                _filter.EntityRefCode = SMDocumentCtrl.ePage.Entities.EntityRefCode;
            }

            if (SMDocumentCtrl.ePage.Entities.ParentEntityRefKey && SMDocumentCtrl.ePage.Entities.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = SMDocumentCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = SMDocumentCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = SMDocumentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey && SMDocumentCtrl.ePage.Entities.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = SMDocumentCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = SMDocumentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            if (SMDocumentCtrl.mode == "1") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType != "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            } else if (SMDocumentCtrl.mode == "2") {
                _filter.DocumentType = SMDocumentCtrl.type.DocType;
            } else if (SMDocumentCtrl.mode == "3") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType == "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    SMDocumentCtrl.ePage.Masters.Document.ListSource = response.data.Response;
                    SMDocumentCtrl.listSource = SMDocumentCtrl.ePage.Masters.Document.ListSource;
                    SMDocumentCtrl.ePage.Masters.Document.ListSourceCopy = angular.copy(response.data.Response);

                    if (response.data.Response.length > 0) {
                        SMDocumentCtrl.ePage.Masters.Document.ListSource.map(function (value, key) {
                            value.DocumentNameTemp = value.DocumentName;
                        });

                        if (SMDocumentCtrl.mode == "1") {
                            SMDocumentCtrl.ePage.Masters.Document.ListSource.map(function (value, key) {
                                if ((value.CreatedBy == SMDocumentCtrl.ePage.Masters.UserId) || (value.CreatedBy != SMDocumentCtrl.ePage.Masters.UserId && !value.IsResticted && value.IsShared)) {
                                    PrepareGroupMapping(value);
                                }
                            });
                        }
                    }
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                }
            });
        }

        function ViewDownloadHistroy($item) {
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
                    SMDocumentCtrl.ePage.Masters.Document.DownloadHistoryList = response.data.Response;
                    if (response.data.Response.length > 0) {
                        HistoryModalInstance('download').result.then(function (response) {}, function () {});
                    } else {
                        toastr.info("No Download History...!");
                    }
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.DownloadHistoryList = [];
                    toastr.info("No Download History...!");
                }
            });
        }

        function ViewAmendHistroy($item) {
            var _filter = {
                "Status": "AMENDED",
                "Parent_FK": $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    SMDocumentCtrl.ePage.Masters.Document.AmendHistoryList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        HistoryModalInstance('amend').result.then(function (response) {}, function () {});
                    } else {
                        toastr.info("No Amended History...!");
                    }
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.AmendHistoryList = [];
                    toastr.info("No Amended History...!");
                }
            });
        }

        function DownloadRecord($item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + $item.PK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                        $item.DownloadCount += 1;
                    } else {
                        console.log("No Records Found..!");
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteRecord($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteRecord($item) {
            // var _input = $item;
            // _input.IsActive = true;
            // _input.Status = "Deleted";
            // _input.IsModified = true;

            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.Delete.Url + $item.PK + '/' + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    // if ($index != -1) {
                    //     SMDocumentCtrl.ePage.Masters.Document.ListSource.splice($index, 1);
                    // }
                }
            });
        }

        function OnDocDescChanges($item) {
            SaveDocument(undefined, $item, "update");
        }

        function GetSelectedFiles(files, mode, docType, row) {
            SMDocumentCtrl.ePage.Masters.Document.IsUploading = true;
            if (mode == "mode1") {
                files.map(function (value, key) {
                    var _obj = {
                        type: value.type,
                        name: value.name,
                        IsActive: true,
                        DocumentType: docType.DocType,
                        DocumentName: docType.Desc,
                        BelongTo_Code: docType.BelongTo_Code,
                        BelongTo_FK: docType.BelongTo_FK,
                        PartyType_Code: docType.PartyType_Code,
                        PartyType_FK: docType.PartyType_FK,
                        Status: "Success",
                        IsNew: true
                    };

                    SMDocumentCtrl.ePage.Masters.Document.ListSource.push(_obj);
                });
            } else if (mode == "mode2") {
                files.map(function (value, key) {
                    var _obj = {
                        type: value.type,
                        name: value.name,
                        IsActive: true,
                        DocumentType: SMDocumentCtrl.type.DocType,
                        DocumentName: SMDocumentCtrl.type.Desc,
                        BelongTo_Code: SMDocumentCtrl.type.BelongTo_Code,
                        BelongTo_FK: SMDocumentCtrl.type.BelongTo_FK,
                        PartyType_Code: SMDocumentCtrl.type.PartyType_Code,
                        PartyType_FK: SMDocumentCtrl.type.PartyType_FK,
                        Status: "Success",
                        IsNew: true
                    };

                    SMDocumentCtrl.ePage.Masters.Document.ListSource.push(_obj);
                });
            } else if (mode == "mode3") {
                files.map(function (value, key) {
                    var _obj = {
                        type: value.type,
                        name: value.name,
                        IsActive: true,
                        DocumentType: SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType,
                        DocumentName: SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.Desc,
                        BelongTo_Code: SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.BelongTo_Code,
                        BelongTo_FK: SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.BelongTo_FK,
                        PartyType_Code: SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.PartyType_Code,
                        PartyType_FK: SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.PartyType_FK,
                        Status: "Success",
                        IsNew: true
                    };

                    SMDocumentCtrl.ePage.Masters.Document.ListSource.push(_obj);
                });
            } else if (mode == "amend") {
                row.IsNew = true;
                row.type = files[0].type;
                row.name = files[0].name;
            }
        }

        function GetUploadedFiles(files, mode, docType, row) {
            if (files.length > 0) {
                files.map(function (value1, key1) {
                    if(SMDocumentCtrl.ePage.Masters.Document.ListSource && SMDocumentCtrl.ePage.Masters.Document.ListSource.length > 0){
                        SMDocumentCtrl.ePage.Masters.Document.ListSource.map(function (value2, key2) {
                            // if (value1.FileName == value2.name && value1.DocType == value2.type) {
                            if (value1.FileName == value2.name) {
                                if (mode === "amend") {
                                    value2.DocumentType = row.DocumentType;
                                    AmendDocument(value1, value2);
                                } else {
                                    SaveDocument(value1, value2, mode);
                                }
                            } else {
                                if (value1.FileName == value2.name) {
                                    toastr.error("Could not Upload " + value1.FileName + " ...! Type mismatch...!");
                                    SMDocumentCtrl.ePage.Masters.Document.ListSource.splice(key2, 1);
                                }
                            }
                        });
                    }
                });
            } else {
                var _index = SMDocumentCtrl.ePage.Masters.Document.ListSource.map(function (value2, key2) {
                    return value2.IsFailed;
                }).indexOf(true);
                if (_index != -1) {
                    toastr.error("Upload failed...!");
                    SMDocumentCtrl.ePage.Masters.Document.ListSource.splice(_index, 1);
                }
            }
        }

        function AmendDocument($item, row) {
            var _input = row;
            _input.DocFK = $item.Doc_PK;
            _input.ContentType = $item.DocType;
            _input.FileName = $item.FileName;
            _input.FileExtension = $item.FileExtension;
            _input.PartyType_Code = row.PartyType_Code;
            _input.PartyType_FK = row.PartyType_FK;

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.AmendDocument.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    SMDocumentCtrl.ePage.Masters.Document.ListSource.map(function (val, key) {
                        if (!val.DocumentName) {
                            SMDocumentCtrl.ePage.Masters.Document.ListSource.splice(key, 1);
                        }
                    });

                    var _index = SMDocumentCtrl.ePage.Masters.Document.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(row.PK);

                    if (_index != -1) {
                        SMDocumentCtrl.ePage.Masters.Document.ListSource[_index] = response.data.Response;
                        SMDocumentCtrl.ePage.Masters.Document.ListSource[_index].IsNew = false;
                        SMDocumentCtrl.ePage.Masters.Document.ListSource[_index].DocumentNameTemp = SMDocumentCtrl.ePage.Masters.Document.ListSource[_index].DocumentName;

                        if (SMDocumentCtrl.mode == "1") {
                            PrepareGroupMapping(response.data.Response);
                        }
                        toastr.success("Saved Successfully...!");
                    }
                } else {
                    toastr.error("Failed to Save...!");
                }

                SMDocumentCtrl.ePage.Masters.Document.IsUploading = false;
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

                if (SMDocumentCtrl.ePage.Entities.EntityRefKey) {
                    _input.EntityRefKey = SMDocumentCtrl.ePage.Entities.EntityRefKey;
                    _input.EntitySource = SMDocumentCtrl.ePage.Entities.EntitySource;
                    _input.EntityRefCode = SMDocumentCtrl.ePage.Entities.EntityRefCode;
                }

                if (SMDocumentCtrl.ePage.Entities.ParentEntityRefKey) {
                    _input.ParentEntityRefKey = SMDocumentCtrl.ePage.Entities.ParentEntityRefKey;
                    _input.ParentEntitySource = SMDocumentCtrl.ePage.Entities.ParentEntitySource;
                    _input.ParentEntityRefCode = SMDocumentCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    _input.AdditionalEntityRefKey = SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
                    _input.AdditionalEntitySource = SMDocumentCtrl.ePage.Entities.AdditionalEntitySource;
                    _input.AdditionalEntityRefCode = SMDocumentCtrl.ePage.Entities.AdditionalEntityRefCode;
                }
            } else {
                var _input = angular.copy(row);
                _input.DocumentName = row.DocumentNameTemp;
                _input.Status = "Success";
                _input.IsModified = true;
            }
            if (_input.PK) {
                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Update.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                    if (response.data.Response) {
                        var _response = response.data.Response;
                        for (var x in _response) {
                            row[x] = _response[x];
                        }
                        row.IsNew = false;
                        row.DocumentNameTemp = row.DocumentName;

                        if (mode != "update" && SMDocumentCtrl.mode == "1") {
                            PrepareGroupMapping(row);
                        }
                    } else {
                        toastr.error("Failed to Save...!");
                    }
                    SMDocumentCtrl.ePage.Masters.Document.IsUploading = false;
                });
            } else {
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

                    if (SMDocumentCtrl.ePage.Entities.EntityRefKey) {
                        _input.EntityRefKey = SMDocumentCtrl.ePage.Entities.EntityRefKey;
                        _input.EntitySource = SMDocumentCtrl.ePage.Entities.EntitySource;
                        _input.EntityRefCode = SMDocumentCtrl.ePage.Entities.EntityRefCode;
                    }


                    if (SMDocumentCtrl.ePage.Entities.ParentEntityRefKey) {
                        _input.ParentEntityRefKey = SMDocumentCtrl.ePage.Entities.ParentEntityRefKey;
                        _input.ParentEntitySource = SMDocumentCtrl.ePage.Entities.ParentEntitySource;
                        _input.ParentEntityRefCode = SMDocumentCtrl.ePage.Entities.ParentEntityRefCode;
                    }

                    if (SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                        _input.AdditionalEntityRefKey = SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
                        _input.AdditionalEntitySource = SMDocumentCtrl.ePage.Entities.AdditionalEntitySource;
                        _input.AdditionalEntityRefCode = SMDocumentCtrl.ePage.Entities.AdditionalEntityRefCode;
                    }
                } else {
                    var _input = angular.copy(row);
                    _input.DocumentName = row.DocumentNameTemp;
                    _input.Status = "Success";
                    _input.IsModified = true;
                }

                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            var _response = response.data.Response[0];
                            for (var x in _response) {
                                row[x] = _response[x];
                            }
                            row.IsNew = false;
                            row.DocumentNameTemp = row.DocumentName;

                            if (mode != "update" && SMDocumentCtrl.mode == "1") {
                                PrepareGroupMapping(row);
                            }
                        }
                    } else {
                        toastr.error("Failed to Save...!");
                    }
                    SMDocumentCtrl.ePage.Masters.Document.IsUploading = false;
                });
            }
        }

        function PrepareGroupMapping($item) {
            $item.GroupMapping = undefined;
            $timeout(function () {
                $item.GroupMapping = {
                    "MappingCode": "DOCU_GRUP_APP_TNT",
                    "Item_FK": $item.PK,
                    "ItemCode": $item.FileName,
                    "ItemName": "GRUP",
                    "Title": "Group Access",
                    "MappingAPI": {
                        "API": "eAxisAPI",
                        "FilterID": "JOBDOCU",
                        "FindAll": appConfig.Entities.JobDocumentAccess.API.FindAll.Url,
                        "Insert": appConfig.Entities.JobDocumentAccess.API.Insert.Url,
                        "Update": appConfig.Entities.JobDocumentAccess.API.Update.Url,
                        "Delete": appConfig.Entities.JobDocumentAccess.API.Delete.Url
                    },
                    "AccessTo": {
                        "Type": "DOCUMENT",
                        "API": "eAxisAPI",
                        "APIUrl": appConfig.Entities.JobDocument.API.DocumentTypeAccess.Url,
                        "TextField": "ItemCode",
                        "ValueField": "Item_FK",
                        "Input": {
                            "PartyTypeCode": $item.PartyType_Code,
                            "PartyTypeRefKey": $item.PartyType_FK,
                            "StandardType": $item.DocumentType,
                            "MappingCode": "GRUP_DTYP_APP_TNT",
                            "ParentRefKey": $item.EntityRefKey,
                            "ParentRefCode": $item.EntityRefCode,
                            "ParentSource": $item.EntitySource,
                            "IsroleInclude": "True"
                        }
                    }
                };
            });
        }
        // endregion

        // region Document Upload
        function InitDocumentUpload() {
            SMDocumentCtrl.ePage.Masters.DocumentUpload = {};
            SMDocumentCtrl.ePage.Masters.DocumentUpload.OnDocumentUploadChange = OnDocumentUploadChange;

            if (!SMDocumentCtrl.Config.IsDisableUpload) {
                GetDocumentUploadFilterList();
            } else {
                var _docUploadList = [{
                    DocType: "ALL",
                    Desc: "All"
                }, {
                    DocType: "GEN",
                    Desc: "General",
                    ListType: "Upload"
                }];

                SMDocumentCtrl.ePage.Masters.DocumentUpload.ListSource = _docUploadList;
                SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList = "GEN";

                OnDocumentUploadChange(SMDocumentCtrl.ePage.Masters.DocumentUpload.ListSource[0]);
            }
        }

        function GetDocumentUploadFilterList() {
            SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "DocType",
                "Key": SMDocumentCtrl.ePage.Entities.Entity
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList = response.data.Response[0].Value;
                        GetDocumentUploadList(response.data.Response[0].Value);
                    } else {
                        var _docUploadList = [{
                            DocType: "ALL",
                            Desc: "All"
                        }, {
                            DocType: "GEN",
                            Desc: "General",
                            ListType: "Upload"
                        }];

                        SMDocumentCtrl.ePage.Masters.DocumentUpload.ListSource = _docUploadList;

                        SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList = "GEN";

                        OnDocumentUploadChange(SMDocumentCtrl.ePage.Masters.DocumentUpload.ListSource[0]);
                    }
                }
            });
        }

        function GetDocumentUploadList($item) {
            SMDocumentCtrl.ePage.Masters.DocumentUpload.ListSource = undefined;
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

                    SMDocumentCtrl.ePage.Masters.DocumentUpload.ListSource = _list;

                    OnDocumentUploadChange(SMDocumentCtrl.ePage.Masters.DocumentUpload.ListSource[0]);
                }
            });
        }

        function OnDocumentUploadChange($item) {
            SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload = angular.copy($item);

            if ($item) {
                GetDocumentList();
                if (!SMDocumentCtrl.Config.IsDisableRelatedDocument) {
                    GetParentDocumentList();
                }
            } else {
                SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = {};
            }
        }
        // endregion

        // region Document Generate
        function InitDocumentGenerate() {
            SMDocumentCtrl.ePage.Masters.DocumentGenerate = {};
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.DocumentGenerateChange = DocumentGenerateChange;
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.OnDocumentGenerate = OnDocumentGenerate;
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.OnDocumentGenerateBtnClick = OnDocumentGenerateBtnClick;

            SMDocumentCtrl.ePage.Masters.DocumentGenerate.GenerateBtnTxt = "Generate";
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.IsDisabledGenerateBtn = false;

            if (!SMDocumentCtrl.Config.IsDisableGenerate) {
                GetDocumentGenerateFilterList();
            }
        }

        function GetDocumentGenerateFilterList() {
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.ListSource = undefined;
            var _filter = {
                SourceEntityRefKey: "DocType",
                EntitySource: "CONFIGURATION",
                // ModuleCode: SMDocumentCtrl.input.EntitySource,
                ModuleCode: "GEN",
                Key: "Shipment_Document",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        GetDocumentGenerateList(_response);
                    } else {
                        SMDocumentCtrl.ePage.Masters.DocumentGenerate.ListSource = [];
                    }
                } else {
                    SMDocumentCtrl.ePage.Masters.DocumentGenerate.ListSource = [];
                }
            });
        }

        function GetDocumentGenerateList($item) {
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.ListSource = undefined;
            var _filter = {
                USR_SAP_FK: authService.getUserInfo().AppPK,
                USR_TenantCode: authService.getUserInfo().TenantCode,
                USR_UserName: authService.getUserInfo().UserId,
                PageType: "Document",
                Code: $item.Value
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SMDocumentCtrl.ePage.Masters.DocumentGenerate.ListSource = response.data.Response;

                    if (response.data.Response.length > 0) {
                        SMDocumentCtrl.ePage.Masters.DocumentGenerate.ListSource.map(function (value, key) {
                            value.ListType = "Generate";
                            value.GenerateBtnTxt = "Generate";
                            value.IsDisabledGenerateBtn = false;
                        });
                    }
                } else {
                    SMDocumentCtrl.ePage.Masters.DocumentGenerate.ListSource = [];
                }
            });
        }

        function OnDocumentGenerateBtnClick($item){
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.ActiveDocumentGenerate = angular.copy($item);
        }

        function DocumentGenerateChange($item) {
            SMDocumentCtrl.ePage.Masters.DocumentGenerate.ActiveDocumentGenerate = angular.copy($item);
        }

        function OnDocumentGenerate($item) {
            var _code;
            if (!$item) {
                SMDocumentCtrl.ePage.Masters.DocumentGenerate.GenerateBtnTxt = "Please Wait...!";
                SMDocumentCtrl.ePage.Masters.DocumentGenerate.IsDisabledGenerateBtn = true;
                _code = SMDocumentCtrl.ePage.Masters.DocumentGenerate.ActiveDocumentGenerate.Code;
            } else {
                $item.GenerateBtnTxt = "Please Wait...!";
                $item.IsDisabledGenerateBtn = true;
                _code = $item.Code;
            }

            var _filter = {
                SourceEntityRefKey: "Documents",
                EntitySource: "EXCELCONFIG",
                ModuleCode: SMDocumentCtrl.input.EntitySource,
                Key: _code,
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
            };

            helperService.excelDocObjPreparation(_filter, SMDocumentCtrl.input.RowObj).then(function (response) {
                if (response) {
                    if (!SMDocumentCtrl.ePage.Masters.Document.ListSource) {
                        SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                    }

                    SMDocumentCtrl.ePage.Masters.Document.ListSource.push(response);
                }

                if (!$item) {
                    SMDocumentCtrl.ePage.Masters.DocumentGenerate.GenerateBtnTxt = "Generate";
                    SMDocumentCtrl.ePage.Masters.DocumentGenerate.IsDisabledGenerateBtn = false;
                } else {
                    $item.GenerateBtnTxt = "Generate";
                    $item.IsDisabledGenerateBtn = false;
                }
            });
        }
        // endregion

        // region History Modal
        function HistoryModalInstance(type) {
            return SMDocumentCtrl.ePage.Masters.HistoryModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "document-history-modal right",
                scope: $scope,
                templateUrl: "app/shared/standard-menu-directives/document/document/document-history/" + type + "-history.html"
            });
        }

        function CloseHistoryModal() {
            SMDocumentCtrl.ePage.Masters.HistoryModal.dismiss('cancel');
        }
        // endregion

        // region Related Documents
        function InitRelatedDocument() {
            SMDocumentCtrl.ePage.Masters.RelatedDocument = {};
            SMDocumentCtrl.ePage.Masters.RelatedDocument.OnRelatedDocumentClick = OnRelatedDocumentClick;
        }

        function GetParentDocumentList() {
            SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = undefined;
            var _filter = {
                Status: "Success",
                ParentEntityRefKey: SMDocumentCtrl.ePage.Entities.EntityRefKey,
                ParentEntitySource: SMDocumentCtrl.ePage.Entities.EntitySource,
                ParentEntityRefCode: SMDocumentCtrl.ePage.Entities.EntityRefCode
            };

            if (SMDocumentCtrl.mode == "1") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType != "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            } else if (SMDocumentCtrl.mode == "2") {
                _filter.DocumentType = SMDocumentCtrl.type.DocType;
            } else if (SMDocumentCtrl.mode == "3") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType == "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            if (_filter.ParentEntityRefKey) {
                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            if (!SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource) {
                                SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = {};
                            }

                            response.data.Response.map(function (value, key) {
                                if (!SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource]) {
                                    SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource] = {
                                        ListSource: []
                                    };
                                }

                                if (value.EntityRefKey) {
                                    var _obj = {
                                        EntitySource: value.EntitySource,
                                        EntityRefKey: value.EntityRefKey,
                                        EntityRefCode: value.EntityRefCode
                                    };

                                    var _index = SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.map(function (v1, k1) {
                                        return v1.EntityRefKey;
                                    }).indexOf(_obj.EntityRefKey);

                                    if (_index == -1) {
                                        SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.push(_obj);
                                    }
                                }

                                if (value.AdditionalEntityRefKey) {
                                    var _obj = {
                                        EntitySource: value.AdditionalEntitySource,
                                        EntityRefKey: value.AdditionalEntityRefKey,
                                        EntityRefCode: value.AdditionalEntityRefCode
                                    };

                                    var _index = SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.map(function (v1, k1) {
                                        return v1.EntityRefKey;
                                    }).indexOf(_obj.EntityRefKey);

                                    if (_index == -1) {
                                        SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.push(_obj);
                                    }
                                }
                            });
                        }
                    } else {
                        if (!SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource) {
                            SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = {};
                        }
                    }
                    GetAdditionalDocumentList();
                });
            } else {
                GetAdditionalDocumentList();
            }
        }

        function GetAdditionalDocumentList() {
            var _filter = {
                Status: "Success",
                AdditionalEntityRefKey: SMDocumentCtrl.ePage.Entities.EntityRefKey,
                AdditionalEntitySource: SMDocumentCtrl.ePage.Entities.EntitySource,
                AdditionalEntityRefCode: SMDocumentCtrl.ePage.Entities.EntityRefCode
            };

            if (SMDocumentCtrl.mode == "1") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType != "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            } else if (SMDocumentCtrl.mode == "2") {
                _filter.DocumentType = SMDocumentCtrl.type.DocType;
            } else if (SMDocumentCtrl.mode == "3") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType == "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            if (_filter.AdditionalEntityRefKey) {
                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                    if (response.data.Response) {
                        if (!SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource) {
                            SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = {};
                        }

                        if (response.data.Response.length > 0) {
                            response.data.Response.map(function (value, key) {
                                if (!SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource]) {
                                    SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource] = {
                                        ListSource: []
                                    };
                                }

                                if (value.EntityRefKey) {
                                    var _obj = {
                                        EntitySource: value.EntitySource,
                                        EntityRefKey: value.EntityRefKey,
                                        EntityRefCode: value.EntityRefCode
                                    };

                                    var _index = SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.map(function (v1, k1) {
                                        return v1.EntityRefKey;
                                    }).indexOf(_obj.EntityRefKey);

                                    if (_index == -1) {
                                        SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.push(_obj);
                                    }
                                }

                                if (value.ParentEntityRefKey) {
                                    var _obj = {
                                        EntitySource: value.ParentEntitySource,
                                        EntityRefKey: value.ParentEntityRefKey,
                                        EntityRefCode: value.ParentEntityRefCode
                                    };

                                    var _index = SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.map(function (v1, k1) {
                                        return v1.EntityRefKey;
                                    }).indexOf(_obj.EntityRefKey);

                                    if (_index == -1) {
                                        SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource[value.EntitySource].ListSource.push(_obj);
                                    }
                                }
                            });
                        }
                    } else {
                        if (!SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource) {
                            SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = {};
                        }
                    }
                });
            } else {
                if (!SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource) {
                    SMDocumentCtrl.ePage.Masters.RelatedDocument.EntitySource = {};
                }
            }
        }

        function OnRelatedDocumentClick($item) {
            $item.ListSource = undefined;
            var _filter = {
                "Status": "Success",
                "EntityRefKey": $item.EntityRefKey,
                "EntitySource": $item.EntitySource,
                "EntityRefCode": $item.EntityRefCode,
                // "CommonRefKey": $item.EntityRefKey
            };

            if (SMDocumentCtrl.mode == "1") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType != "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            } else if (SMDocumentCtrl.mode == "2") {
                _filter.DocumentType = SMDocumentCtrl.type.DocType;
            } else if (SMDocumentCtrl.mode == "3") {
                if (SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType == "ALL") {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.DocumentTypeList;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.DocumentUpload.ActiveDocumentUpload.DocType;
                }
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    $item.ListSource = response.data.Response;
                } else {
                    $item.ListSource = [];
                }
            });
        }
        // endregion

        Init();
    }
})();
