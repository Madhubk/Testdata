(function () {
    "use strict";

    angular
        .module("Application")
        .directive("document", Document);

    function Document() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/document/document/document.html",
            controller: 'SMDocumentController',
            controllerAs: 'SMDocumentCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                config: "=",
                type: "=",
                listSource: "=?",
                closeModal: "&"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("SMDocumentController", SMDocumentController);

    SMDocumentController.$inject = ["$scope", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "confirmation", "toastr"];

    function SMDocumentController($scope, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, confirmation, toastr) {
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

            SMDocumentCtrl.Config = SMDocumentCtrl.config ? SMDocumentCtrl.config : {};
            SMDocumentCtrl.ePage.Masters.CheckControlAccess = CheckControlAccess;

            InitDocument();
        }

        function CheckControlAccess(controlId) {
            return helperService.checkUIControl(controlId);
        }

        function InitDocument() {
            SMDocumentCtrl.ePage.Masters.Document = {};

            SMDocumentCtrl.ePage.Masters.Document.OnRadioButtonChange = OnRadioButtonChange;
            SMDocumentCtrl.ePage.Masters.Document.OnDocumentTypeChange = OnDocumentTypeChange;
            SMDocumentCtrl.ePage.Masters.Document.OnDocumentGenerateChange = OnDocumentGenerateChange;
            SMDocumentCtrl.ePage.Masters.Document.Refresh = Refresh;
            SMDocumentCtrl.ePage.Masters.Document.BulkDocDownload = BulkDocDownload;
            SMDocumentCtrl.ePage.Masters.Document.OnDocumentCheck = OnDocumentCheck;
            SMDocumentCtrl.ePage.Masters.Document.OnDocumentCheckAll = OnDocumentCheckAll;
            SMDocumentCtrl.ePage.Masters.Document.SelectedDocumentList = [];

            SMDocumentCtrl.ePage.Masters.Document.DeletedHistory = GetDeletedHistory;
            SMDocumentCtrl.ePage.Masters.Document.DownloadedHistroy = GetDownloadedHistroy;
            SMDocumentCtrl.ePage.Masters.Document.AmendedHistroy = GetAmendedHistroy;
            SMDocumentCtrl.ePage.Masters.CloseHistoryModal = CloseHistoryModal;

            SMDocumentCtrl.ePage.Masters.Document.DownloadDocument = DownloadDocument;
            SMDocumentCtrl.ePage.Masters.Document.OnDocDescChange = OnDocDescChange;
            SMDocumentCtrl.ePage.Masters.Document.DeleteDocument = DeleteConfirmation;

            SMDocumentCtrl.ePage.Masters.Document.UserId = authService.getUserInfo().UserId;
            SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue = "Upload";

            InitUpload();
            InitGenerate();
            InitRelatedDocument();
            CheckMode();
        }

        function CheckMode() {
            if (SMDocumentCtrl.mode == "2" && SMDocumentCtrl.input.DocumentType) {
                let _type = SMDocumentCtrl.input.DocumentType,
                    _index = _type.indexOf(","),
                    _typeList = [];

                if (_index != -1) {
                    let _split = _type.split(",");
                    _split.map(x => {
                        let _obj = {
                            DocType: x,
                            Desc: x
                        };
                        _typeList.push(_obj);
                    });
                } else {
                    let _obj = {
                        DocType: _type,
                        Desc: _type
                    };
                    _typeList.push(_obj);
                }

                SMDocumentCtrl.ePage.Masters.Document.DocumentTypeList = _typeList;
                OnDocumentTypeChange(SMDocumentCtrl.ePage.Masters.Document.DocumentTypeList[0]);
            } else if (SMDocumentCtrl.mode != "2") {
                if (!SMDocumentCtrl.Config.IsDisableUpload) {
                    GetDocumentTypeConfiguration();
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue = "Generate";
                }
                if (!SMDocumentCtrl.Config.IsDisableGenerate) {
                    GetDocumentGenerateConfiguration();
                }
            }
        }

        function OnRadioButtonChange() {
            SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource = [];
            if (SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue == "Upload") {
                OnDocumentTypeChange(SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType);
            } else if (SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue == "Generate") {
                OnDocumentGenerateChange(SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate, '$event');
            }
        }

        // #region Document Type
        function GetDocumentTypeConfiguration() {
            let _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "DocType",
                "Key": SMDocumentCtrl.ePage.Entities.Entity,
                "SAP_FK": authService.getUserInfo().AppPK,
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _type = response.data.Response[0].Value;
                    SMDocumentCtrl.ePage.Masters.Document.DocumentTypeConfigValue = _type;
                    if (_type) {
                        GetDocumentTypeList();
                    }
                } else {
                    let _type = "GEN";
                    SMDocumentCtrl.ePage.Masters.Document.DocumentTypeConfigValue = _type;
                    GetDocumentTypeList();
                }
            });
        }

        function GetDocumentTypeList() {
            SMDocumentCtrl.ePage.Masters.Document.DocumentTypeList = undefined;
            let _filter = {
                DocType: SMDocumentCtrl.ePage.Masters.Document.DocumentTypeConfigValue
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    let _list = response.data.Response ? response.data.Response : [];
                    let _all = [{
                        DocType: "ALL",
                        Desc: "All"
                    }];

                    _list = [..._all, ..._list];
                    SMDocumentCtrl.ePage.Masters.Document.DocumentTypeList = _list;

                    OnDocumentTypeChange(SMDocumentCtrl.ePage.Masters.Document.DocumentTypeList[0]);
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.DocumentTypeList = [];
                    SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                }
            });
        }

        function OnDocumentTypeChange($item) {
            SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType = angular.copy($item);

            if (!SMDocumentCtrl.Config.IsDisableEntityDocument) {
                GetDocumentList();
            }
            if (!SMDocumentCtrl.Config.IsDisableRelatedDocument) {
                GetRelatedDocumentList();
            }
        }
        // #endregion

        // #region Document Generate
        function GetDocumentGenerateConfiguration() {
            let _filter = {
                SourceEntityRefKey: "DocType",
                EntitySource: "CONFIGURATION",
                Key: SMDocumentCtrl.ePage.Entities.Entity + "_Document",
                ModuleCode: "GEN",
                SAP_FK: authService.getUserInfo().AppPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _type = response.data.Response[0].Value;
                    SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateConfigValue = _type;
                    if (_type) {
                        GetDocumentGenerateList();
                    }
                } else {
                    let _type = "GEN";
                    SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateConfigValue = _type;
                    GetDocumentGenerateList();
                }
            });
        }

        function GetDocumentGenerateList() {
            SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateList = undefined;
            let _filter = {
                USR_SAP_FK: authService.getUserInfo().AppPK,
                USR_TenantCode: authService.getUserInfo().TenantCode,
                USR_UserName: authService.getUserInfo().UserId,
                PageType: "Document",
                Code: SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateConfigValue
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    let _list = response.data.Response ? response.data.Response : [];
                    let _all = [{
                        Code: "ALL",
                        Description: "All"
                    }];

                    _list = [..._all, ..._list];
                    SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateList = _list;

                    OnDocumentGenerateChange(SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateList[0]);
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateList = [];
                    SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                }
            });
        }

        function OnDocumentGenerateChange($item, $event) {
            SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate = angular.copy($item);

            if ($event || SMDocumentCtrl.Config.IsDisableUpload) {
                if (!SMDocumentCtrl.Config.IsDisableEntityDocument) {
                    GetDocumentList();
                }
                if (!SMDocumentCtrl.Config.IsDisableRelatedDocument) {
                    GetRelatedDocumentList();
                }
            }
        }
        // #endregion

        // #region Header Button
        function Refresh() {
            if (!SMDocumentCtrl.Config.IsDisableEntityDocument) {
                GetDocumentList();
            }
            if (!SMDocumentCtrl.Config.IsDisableRelatedDocument) {
                GetRelatedDocumentList();
            }
        }

        function BulkDocDownload() {
            let _pk = [];
            SMDocumentCtrl.ePage.Masters.Document.SelectedDocumentList.map(x => _pk.push(x.PK));
            let _filter = {
                FileName: SMDocumentCtrl.ePage.Entities.EntityRefCode,
                PKMultiple: _pk.join(",")
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DMS.API.DownloadZip.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DMS.API.DownloadZip.Url, _input).then(response => helperService.DownloadDocument(response.data.Response));
        }

        function GetDeletedHistory() {
            HistoryModalInstance('delete').result.then(response => {}, () => {});

            SMDocumentCtrl.ePage.Masters.Document.DeletedHistoryList = undefined;
            let _filter = {
                "Status": "Deleted",
                "EntityRefKey": SMDocumentCtrl.ePage.Entities.EntityRefKey
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    SMDocumentCtrl.ePage.Masters.Document.DeletedHistoryList = response.data.Response;
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.DeletedHistoryList = [];
                }
            });
        }

        function GetDownloadedHistroy($item) {
            HistoryModalInstance('download').result.then(response => {}, () => {});

            SMDocumentCtrl.ePage.Masters.Document.DownloadedHistoryList = undefined;
            let _filter = {
                "ClassSource": "JobDocument",
                "FieldName": "Download",
                "EntityRefKey": $item.PK,
                "EntitySource": "DOC"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataAudit.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataAudit.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    SMDocumentCtrl.ePage.Masters.Document.DownloadedHistoryList = response.data.Response;
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.DownloadedHistoryList = [];
                }
            });
        }

        function GetAmendedHistroy($item) {
            HistoryModalInstance('amend').result.then(response => {}, () => {});

            SMDocumentCtrl.ePage.Masters.Document.AmendedHistoryList = undefined;
            let _filter = {
                "Status": "AMENDED",
                "Parent_FK": $item.PK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    SMDocumentCtrl.ePage.Masters.Document.AmendedHistoryList = response.data.Response;
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.AmendedHistoryList = [];
                }
            });
        }

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
        // #endregion

        // #region Document List
        function GetDocumentList() {
            SMDocumentCtrl.ePage.Masters.Document.ListSource = undefined;
            let _filter = {
                Status: "Success",
                EntityRefKey: SMDocumentCtrl.ePage.Entities.EntityRefKey,
            };

            if (SMDocumentCtrl.ePage.Entities.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = SMDocumentCtrl.ePage.Entities.ParentEntityRefKey;
            }

            if (SMDocumentCtrl.ePage.Entities.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
            }

            if (SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue == "Upload") {
                if (SMDocumentCtrl.mode == "2") {
                    _filter.DocumentType = SMDocumentCtrl.type.DocType;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.DocType == "ALL" ? SMDocumentCtrl.ePage.Masters.Document.DocumentTypeConfigValue : SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.DocType;
                }
            } else if (SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue == "Generate") {
                if (SMDocumentCtrl.mode == "2") {
                    _filter.DocumentType = SMDocumentCtrl.type.DocType;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code == "ALL" ? SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateConfigValue : SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code;
                }
            }

            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    SMDocumentCtrl.ePage.Masters.Document.ListSource = response.data.Response;

                    if (SMDocumentCtrl.ePage.Masters.Document.ListSource.length > 0) {
                        SMDocumentCtrl.ePage.Masters.Document.ListSource.map(x => {
                            x.DocumentNameTemp = x.DocumentName;
                            x.GroupMapping = PrepareAccessInput(x);
                            x.MailObj = PrepareEmailAsAttachment(x);
                            x.SaveBtnTxt = "Save";
                            x.IsDisableSaveBtn = false;
                        });
                    }
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                }
            });
        }

        function PrepareAccessInput($item) {
            return {
                "Item": $item,
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
        }

        function PrepareEmailAsAttachment($item) {
            return {
                // Subject: "_subject",
                // Template: "OrderSummaryReport",
                // TemplateObj: {
                //     Key: "OrderSummaryReport",
                //     Description: "Order Summary Report"
                // },
                AttachmentList: [$item]
            };
        }

        function OnDocumentCheck($event, $item) {
            let _target = $event.target,
                _isChecked = _target.checked,
                _downloadLimit = 10,
                _selectedDocuments = SMDocumentCtrl.ePage.Masters.Document.SelectedDocumentList;

            if (_isChecked) {
                if (_selectedDocuments.length >= _downloadLimit) {
                    toastr.warning(`Cannot select more then ${_downloadLimit} files to download...!`);
                    $item.IsChecked = false;
                } else {
                    _selectedDocuments.push($item);
                    $item.IsChecked = true;
                }
            } else {
                let _index = _selectedDocuments.findIndex(x => x.PK === $item.PK);
                if (_index !== -1) {
                    _selectedDocuments.splice(_index, 1);
                }
            }

            SMDocumentCtrl.ePage.Masters.Document.SelectedDocumentList = _selectedDocuments;
        }

        function OnDocumentCheckAll($event) {
            let _target = $event.target,
                _isChecked = _target.checked,
                _selectedDocuments = [];

            if (_isChecked) {
                SMDocumentCtrl.ePage.Masters.Document.ListSource.map(x => {
                    x.IsChecked = true;
                    _selectedDocuments.push(x);
                });
            } else {
                SMDocumentCtrl.ePage.Masters.Document.ListSource.map(x => {
                    x.IsChecked = false;
                });
            }

            SMDocumentCtrl.ePage.Masters.Document.SelectedDocumentList = _selectedDocuments;
        }

        function DownloadDocument($item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + $item.PK + "/" + authService.getUserInfo().AppPK).then(response => {
                if (response.data.Response && response.data.Response !== "No Records Found!") {
                    helperService.DownloadDocument(response.data.Response);
                    $item.DownloadCount += 1;
                } else {
                    console.log("Invalid response...! or No Records Found..!");
                }
            });
        }

        function OnDocDescChange($item) {
            $item.SaveBtnTxt = "Please Wait...";
            $item.IsDisableSaveBtn = true;

            let _input = $item;
            _input.DocumentName = _input.DocumentNameTemp;
            _input.IsModified = true;

            UpdateDocument($item);
        }

        function DeleteConfirmation($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteDocument($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteDocument($item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.Delete.Url + $item.PK + '/' + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response == "Success") {
                    let _index = SMDocumentCtrl.ePage.Masters.Document.ListSource.findIndex(x => x.PK === $item.PK);

                    if (_index != -1) {
                        SMDocumentCtrl.ePage.Masters.Document.ListSource.splice(_index, 1);
                    }
                }
            });
        }
        //#endregion

        // #region Upload
        function InitUpload() {
            let _additionalValue = {
                "Entity": SMDocumentCtrl.ePage.Entities.Entity,
                "Path": SMDocumentCtrl.ePage.Entities.Entity + "," + SMDocumentCtrl.ePage.Entities.EntityRefCode
            };
            SMDocumentCtrl.ePage.Masters.Document.Upload = {
                Autherization: authService.getUserInfo().AuthToken,
                fileDetails: [],
                fileSize: 10,
                UserId: authService.getUserInfo().UserId,
                AdditionalValue: JSON.stringify(_additionalValue),
                UploadUrl: APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url
            };

            SMDocumentCtrl.ePage.Masters.Document.Upload.GetSelectedFiles = GetSelectedFiles;
            SMDocumentCtrl.ePage.Masters.Document.Upload.GetUploadedFiles = GetUploadedFiles;

            SMDocumentCtrl.ePage.Masters.Document.Upload.UploadBtnTxt = "Upload";
            SMDocumentCtrl.ePage.Masters.Document.Upload.IsUploading = false;
        }

        function GetSelectedFiles(files, $item) {
            if ($item) {
                // Amend
                files.map(x => {
                    let _obj = {
                        type: x.type,
                        name: x.name,
                        DocumentType: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.DocType,
                    };

                    $item.AmendedObj = _obj;
                });
            } else {
                SMDocumentCtrl.ePage.Masters.Document.Upload.UploadBtnTxt = "Please Wait...";
                SMDocumentCtrl.ePage.Masters.Document.Upload.IsUploading = true;

                // Normal Upload
                SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource = SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource ? SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource : [];

                files.map(x => {
                    let _obj = {
                        type: x.type,
                        name: x.name,
                        DocumentType: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.DocType,
                        IsNew: true
                    };

                    SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource.push(_obj);
                });
            }
        }

        function GetUploadedFiles(files, $item) {
            if ($item) {
                // Amend
                files.map(value1 => AmendDocument(value1, $item));
            } else {
                // Normal Upload
                files.map(value1 => SaveDocument(value1));
            }
        }

        function AmendDocument($item, row) {
            let _input = angular.copy(row);
            _input.DocFK = $item.Doc_PK;
            _input.ContentType = $item.DocType;
            _input.FileName = $item.FileName;
            _input.FileExtension = $item.FileExtension;

            if (_input.GroupMapping) {
                _input.GroupMapping = {};
            }
            if (_input.MailObj) {
                _input.MailObj = {};
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.AmendDocument.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    let _response = response.data.Response;
                    _response.GroupMapping = PrepareAccessInput(_response);

                    let _index = SMDocumentCtrl.ePage.Masters.Document.ListSource.findIndex(value => value.PK == _input.PK);

                    if (_index != -1) {
                        SMDocumentCtrl.ePage.Masters.Document.ListSource[_index] = _response;
                    }
                } else {
                    toastr.error("Failed to Upload...!");
                }
            });
        }

        function SaveDocument($item) {
            let _input = {
                Status: "Success",
                FileName: $item.FileName,
                FileExtension: $item.FileExtension,
                ContentType: $item.DocType,
                IsActive: true,
                IsModified: true,
                DocFK: $item.Doc_PK,
                DocumentName: ($item.FileName.indexOf(".") != -1) ? $item.FileName.split(".")[0] : $item.FileName,
                DocumentType: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.DocType,
                BelongTo_Code: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.BelongTo_Code,
                BelongTo_FK: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.BelongTo_FK,
                PartyType_Code: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.PartyType_Code,
                PartyType_FK: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.PartyType_FK,

                EntityRefKey: SMDocumentCtrl.ePage.Entities.EntityRefKey,
                EntitySource: SMDocumentCtrl.ePage.Entities.EntitySource,
                EntityRefCode: SMDocumentCtrl.ePage.Entities.EntityRefCode,

                ParentEntityRefKey: SMDocumentCtrl.ePage.Entities.ParentEntityRefKey,
                ParentEntitySource: SMDocumentCtrl.ePage.Entities.ParentEntitySource,
                ParentEntityRefCode: SMDocumentCtrl.ePage.Entities.ParentEntityRefCode,

                AdditionalEntityRefKey: SMDocumentCtrl.ePage.Entities.AdditionalEntityRefKey,
                AdditionalEntitySource: SMDocumentCtrl.ePage.Entities.AdditionalEntitySource,
                AdditionalEntityRefCode: SMDocumentCtrl.ePage.Entities.AdditionalEntityRefCode
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];

                    if (SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource && SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource.length > 0) {
                        SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource.map(x => {
                            if ($item.FileName == x.name && x.IsNew) {
                                x.IsNew = false;
                            }
                        });
                        _response.GroupMapping = PrepareAccessInput(_response);
                        SMDocumentCtrl.ePage.Masters.Document.ListSource.push(_response);

                        let _isExist = SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource.some(x => x.IsNew == true);

                        if (!_isExist) {
                            SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource = undefined;

                            SMDocumentCtrl.ePage.Masters.Document.Upload.UploadBtnTxt = "Upload";
                            SMDocumentCtrl.ePage.Masters.Document.Upload.IsUploading = false;
                        }
                    }
                } else {
                    toastr.error("Failed to Upload...!");
                }
            });
        }

        function UpdateDocument($item) {
            let _input = angular.copy($item);
            _input.GroupMapping = {};
            _input.AmendedObj = {};
            _input.MailObj = {};

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Update.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    let _response = response.data.Response;
                    for (let x in _response) {
                        $item[x] = _response[x];
                    }
                    $item.DocumentNameTemp = _response.DocumentName;
                } else {
                    toastr.error("Failed to Save...!");
                }

                $item.SaveBtnTxt = "Save";
                $item.IsDisableSaveBtn = false;
            });
        }
        // #endregion

        // #region Generate
        function InitGenerate() {
            SMDocumentCtrl.ePage.Masters.Document.Generate = {};
            SMDocumentCtrl.ePage.Masters.Document.Generate.OnGenerateDocument = OnGenerateDocument;

            SMDocumentCtrl.ePage.Masters.Document.Generate.GenerateBtnTxt = "Generate";
            SMDocumentCtrl.ePage.Masters.Document.Generate.IsGenerating = false;
        }

        function OnGenerateDocument() {
            SMDocumentCtrl.ePage.Masters.Document.Generate.GenerateBtnTxt = "Please Wait...";
            SMDocumentCtrl.ePage.Masters.Document.Generate.IsGenerating = true;

            SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource = SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource ? SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource : [];

            let _obj = {
                type: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code,
                name: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code,
                IsActive: true,
                DocumentType: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code,
                DocumentName: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code,
                Status: "Success",
                IsNew: true
            };
            SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource.push(_obj);

            let _filter = {
                SourceEntityRefKey: "Documents",
                EntitySource: "EXCELCONFIG",
                ModuleCode: SMDocumentCtrl.input.EntitySource,
                Key: SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code,
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };

            helperService.excelDocObjPreparation(_filter, SMDocumentCtrl.input.RowObj).then(response => {
                if (!SMDocumentCtrl.ePage.Masters.Document.ListSource) {
                    SMDocumentCtrl.ePage.Masters.Document.ListSource = [];
                }

                if (SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource.length > 0) {
                    SMDocumentCtrl.ePage.Masters.Document.ListSource.push(response);

                    SMDocumentCtrl.ePage.Masters.Document.Upload.TempListSource = undefined;
                }

                SMDocumentCtrl.ePage.Masters.Document.Generate.GenerateBtnTxt = "Generate";
                SMDocumentCtrl.ePage.Masters.Document.Generate.IsGenerating = false;
            });
        }
        // #endregion

        // #region Related Document
        function InitRelatedDocument() {
            SMDocumentCtrl.ePage.Masters.Document.RelatedDocument = {};
        }

        function GetRelatedDocumentList() {
            SMDocumentCtrl.ePage.Masters.Document.RelatedDocument.ListSource = undefined;
            let _filter = {
                Status: "Success",
                ParentAdditionalRefKey: SMDocumentCtrl.ePage.Entities.EntityRefKey
            };

            if (SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue == "Upload") {
                if (SMDocumentCtrl.mode == "2") {
                    _filter.DocumentType = SMDocumentCtrl.type.DocType;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.DocType == "ALL" ? SMDocumentCtrl.ePage.Masters.Document.DocumentTypeConfigValue : SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentType.DocType;
                }
            } else if (SMDocumentCtrl.ePage.Masters.Document.RadioButtonValue == "Generate") {
                if (SMDocumentCtrl.mode == "2") {
                    _filter.DocumentType = SMDocumentCtrl.type.DocType;
                } else {
                    _filter.DocumentType = SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code == "ALL" ? SMDocumentCtrl.ePage.Masters.Document.DocumentGenerateConfigValue : SMDocumentCtrl.ePage.Masters.Document.ActiveDocumentGenerate.Code;
                }
            }

            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    SMDocumentCtrl.ePage.Masters.Document.RelatedDocument.ListSource = response.data.Response;
                } else {
                    SMDocumentCtrl.ePage.Masters.Document.RelatedDocument.ListSource = [];
                }
            });
        }
        // #endregion

        Init();
    }
})();