(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exception", Exception);

    function Exception() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/exception/exception/exception.html",
            controller: 'ExceptionController',
            controllerAs: 'ExceptionCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("ExceptionController", ExceptionController);

    ExceptionController.$inject = ["authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ExceptionController(authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var ExceptionCtrl = this;

        function Init() {
            ExceptionCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ExceptionCtrl.input
            };

            ExceptionCtrl.ePage.Masters.CheckControlAccess = CheckControlAccess;
            InitException();
        }

        function CheckControlAccess(controlId) {
            return helperService.checkUIControl(controlId);
        }

        function InitException() {
            ExceptionCtrl.ePage.Masters.Exception = {};

            ExceptionCtrl.ePage.Masters.Exception.UserId = authService.getUserInfo().UserId;
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";

            InitListView();
            InitReadView();
            InitEditView();
        }

        // #region ListView
        function InitListView() {
            ExceptionCtrl.ePage.Masters.Exception.ListView = {};

            ExceptionCtrl.ePage.Masters.Exception.ListView.OnExceptionTypeChange = OnExceptionTypeChange;
            ExceptionCtrl.ePage.Masters.Exception.ListView.AddNewException = AddNewException;
            ExceptionCtrl.ePage.Masters.Exception.ListView.Refresh = Refresh;
            ExceptionCtrl.ePage.Masters.Exception.ListView.OnExceptionClick = OnExceptionClick;

            CheckMode();
        }

        function CheckMode() {
            if (ExceptionCtrl.mode == "2" && ExceptionCtrl.input.ExceptionType) {
                let _type = ExceptionCtrl.input.ExceptionType,
                    _index = _type.indexOf(","),
                    _typeList = [];

                if (_index != -1) {
                    let _split = _type.split(",");
                    _split.map(x => {
                        let _obj = {
                            Description: x,
                            TypeCode: x,
                            Value: x,
                            Key: x
                        };
                        _typeList.push(_obj);
                    });
                } else {
                    let _obj = {
                        Description: _type,
                        TypeCode: _type,
                        Value: _type,
                        Key: _type
                    };
                    _typeList.push(_obj);
                }

                ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeList = _typeList;
                OnExceptionTypeChange(ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeList[0]);
            } else if (ExceptionCtrl.mode != "2") {
                GetExceptionTypeConfiguration();
            }
        }

        function GetExceptionTypeConfiguration() {
            let _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "ExceptionType",
                "Key": ExceptionCtrl.ePage.Entities.Entity
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _type = response.data.Response[0].Value;
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeConfigValue = _type;
                    if (_type) {
                        GetExceptionTypeList();
                    }
                } else {
                    let _type = "GEN";
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeConfigValue = _type;
                    GetExceptionTypeList();
                }
            });
        }

        function GetExceptionTypeList() {
            ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeList = undefined;
            let _filter = {
                "Key": ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeConfigValue,
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstExceptionType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstExceptionType.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    let _list = response.data.Response ? response.data.Response : [];
                    if (_list.length > 0) {
                        _list.map(x => x.OtherConfig = (x.OtherConfig && typeof x.OtherConfig == "string") ? JSON.parse(x.OtherConfig) : x.OtherConfig)
                    }
                    let _all = [{
                        Description: "All",
                        TypeCode: "ALL",
                        Value: "All",
                        Key: "All"
                    }];

                    _list = [..._all, ..._list];
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeList = _list;

                    OnExceptionTypeChange(ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeList[0]);
                } else {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeList = [];
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                }
            });
        }

        function OnExceptionTypeChange($item) {
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType = angular.copy($item);

            GetExceptionList();
        }

        function GetExceptionList() {
            ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = undefined;
            let _filter = {
                EntityRefKey: ExceptionCtrl.ePage.Entities.EntityRefKey,
            };

            if (ExceptionCtrl.mode == "2") {
                _filter.Type = ExceptionCtrl.input.ExceptionType;
            } else {
                _filter.Type = (ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.TypeCode == "ALL") ? ExceptionCtrl.ePage.Masters.Exception.ListView.ExceptionTypeConfigValue :
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.Key;
            }

            _filter.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
            _filter.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey;

            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobException.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobException.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = response.data.Response;

                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource.map(x => {
                        if (x.OtherConfig && typeof x.OtherConfig == "string") {
                            x.OtherConfig = JSON.parse(x.OtherConfig);
                        }

                        if (ExceptionCtrl.mode == "1") {
                            x.GroupMapping = PrepareAccessInput(x);
                        }
                    });
                } else {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                }
            });
        }

        function PrepareAccessInput($item) {
            return {
                "Item": $item,
                "MappingCode": "EXCE_GRUP_APP_TNT",
                "Item_FK": $item.PK,
                "ItemCode": $item.Title,
                "ItemName": "GRUP",
                "Title": " Group Access",
                "MappingAPI": {
                    "API": "eAxisAPI",
                    "FilterID": "JOEXAC",
                    "FindAll": appConfig.Entities.JobExceptionAccess.API.FindAll.Url,
                    "Insert": appConfig.Entities.JobExceptionAccess.API.Insert.Url,
                    "Update": appConfig.Entities.JobExceptionAccess.API.Update.Url,
                    "Delete": appConfig.Entities.JobExceptionAccess.API.Delete.Url
                },
                "AccessTo": {
                    "Type": "EXCEPTION",
                    "API": "eAxisAPI",
                    "APIUrl": "JobException/ExceptionTypeAccess",
                    "TextField": "ItemCode",
                    "ValueField": "Item_FK",
                    "Input": {
                        "PartyTypeCode": $item.PartyType_Code,
                        "PartyTypeRefKey": $item.PartyType_FK,
                        "StandardType": $item.Type,
                        "ParentRefKey": $item.EntityRefKey,
                        "ParentRefCode": $item.EntityRefCode,
                        "ParentSource": $item.EntitySource,
                        "MappingCode": "GRUP_ETYP_APP_TNT",
                        "IsroleInclude": "True"
                    }
                }
            };
        }

        function Refresh() {
            GetExceptionList();
        }

        function AddNewException() {
            ExceptionCtrl.ePage.Masters.Exception.ActiveException = {};

            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Edit";
            RelatedDetails(true);
        }

        function OnExceptionClick($item) {
            ExceptionCtrl.ePage.Masters.Exception.ActiveException = angular.copy($item);

            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Read";
            ExceptionCtrl.ePage.Masters.Exception.ReadView.IsShowDynamicForm = false;

            if (ExceptionCtrl.ePage.Masters.Exception.ActiveException.RelatedDetails) {
                ExceptionCtrl.ePage.Masters.Exception.ActiveException.DataConfig = {
                    Entities: JSON.parse(ExceptionCtrl.ePage.Masters.Exception.ActiveException.RelatedDetails)
                };
            } else {
                RelatedDetails(false);
            }

            PrepareCommentInput();
            GetAttachmentList();
        }
        // #endregion

        // #region ReadView
        function InitReadView() {
            ExceptionCtrl.ePage.Masters.Exception.ReadView = {};
            ExceptionCtrl.ePage.Masters.Exception.ReadView.GoToListView = GoToListView;

            InitAttachment();
        }

        function PrepareCommentInput() {
            let _commentInput = angular.copy(ExceptionCtrl.ePage.Entities);

            _commentInput.ParentEntityRefCode = ExceptionCtrl.ePage.Masters.Exception.ActiveException.Title;
            _commentInput.ParentEntityRefKey = ExceptionCtrl.ePage.Masters.Exception.ActiveException.PK;
            _commentInput.ParentEntitySource = "EXC";

            _commentInput.CommentsType = "EXC";
            _commentInput.Description = "Exception General";

            _commentInput.PartyType_FK = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.PartyType_FK;
            _commentInput.PartyType_Code = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.PartyType_Code;

            ExceptionCtrl.ePage.Masters.Exception.ActiveException.CommentInput = _commentInput;
        }

        function GoToListView() {
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.ActiveException = undefined;
        }

        // #region Attachment
        function InitAttachment() {
            let _additionalValue = {
                "Entity": ExceptionCtrl.ePage.Entities.Entity,
                "Path": ExceptionCtrl.ePage.Entities.Entity + "," + ExceptionCtrl.ePage.Entities.EntityRefCode
            };

            ExceptionCtrl.ePage.Masters.Exception.Attachment = {
                Autherization: authService.getUserInfo().AuthToken,
                fileDetails: [],
                fileSize: 10,
                UserId: authService.getUserInfo().UserId,
                AdditionalValue: JSON.stringify(_additionalValue),
                UploadUrl: APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url
            };

            ExceptionCtrl.ePage.Masters.Exception.Attachment.GetSelectedFiles = GetSelectedFiles;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.GetUploadedFiles = GetUploadedFiles;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.DownloadAttachment = DownloadAttachment;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.DeleteAttachment = DeleteAttachmentConfirmation;
        }

        function GetAttachmentList() {
            ExceptionCtrl.ePage.Masters.Exception.Attachment.ListSource = undefined;
            let _filter = {
                Status: "Success",
                DocumentType: "EXC",
                EntityRefKey: ExceptionCtrl.ePage.Entities.EntityRefKey,
                ParentEntityRefKey: ExceptionCtrl.ePage.Masters.Exception.ActiveException.PK,
                AdditionalEntityRefKey: ExceptionCtrl.ePage.Entities.ParentEntityRefKey,
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    ExceptionCtrl.ePage.Masters.Exception.Attachment.ListSource = response.data.Response;
                } else {
                    ExceptionCtrl.ePage.Masters.Exception.Attachment.ListSource = [];
                }
            });
        }

        function GetSelectedFiles(files) {
            ExceptionCtrl.ePage.Masters.Exception.Attachment.TempListSource = [];
            files.map(x => {
                let _obj = {
                    type: x.type,
                    name: x.name,
                    IsActive: true,
                    DocumentType: "EXC",
                    DocumentName: x.name,
                    Status: "Success",
                    IsNew: true
                };

                ExceptionCtrl.ePage.Masters.Exception.Attachment.TempListSource.push(_obj);
            });
        }

        function GetUploadedFiles(files) {
            files.map(value1 => {
                SaveAttachment(value1);
            });
        }

        function SaveAttachment($item) {
            let _input = {
                Status: "Success",
                DocumentType: "EXC",
                FileName: $item.FileName,
                FileExtension: $item.FileExtension,
                ContentType: $item.DocType,
                IsActive: true,
                IsModified: true,
                DocFK: $item.Doc_PK,
                DocumentName: ($item.FileName.indexOf(".") != -1) ? $item.FileName.split(".")[0] : $item.FileName,

                EntityRefKey: ExceptionCtrl.ePage.Entities.EntityRefKey,
                EntitySource: ExceptionCtrl.ePage.Entities.EntitySource,
                EntityRefCode: ExceptionCtrl.ePage.Entities.EntityRefCode,

                ParentEntityRefKey: ExceptionCtrl.ePage.Masters.Exception.ActiveException.PK,
                ParentEntitySource: "EXC",
                ParentEntityRefCode: ExceptionCtrl.ePage.Masters.Exception.ActiveException.Title,

                AdditionalEntityRefKey: ExceptionCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntitySource: ExceptionCtrl.ePage.Entities.ParentEntitySource,
                AdditionalEntityRefCode: ExceptionCtrl.ePage.Entities.ParentEntityRefCode
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    ExceptionCtrl.ePage.Masters.Exception.Attachment.TempListSource.map(x => {
                        if ($item.FileName == x.name && x.IsNew) {
                            x.IsNew = false;
                        }
                    });

                    ExceptionCtrl.ePage.Masters.Exception.Attachment.ListSource.push(_response);

                    let _isExist = ExceptionCtrl.ePage.Masters.Exception.Attachment.TempListSource.some(x => x.IsNew == true);

                    if (!_isExist) {
                        ExceptionCtrl.ePage.Masters.Exception.Attachment.TempListSource = undefined;
                    }
                } else {
                    toastr.error("Failed to Upload...!");
                }
            });
        }

        function DownloadAttachment($item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + $item.PK + "/" + authService.getUserInfo().AppPK).then(response => {
                if (response.data.Response && response.data.Response !== "No Records Found!") {
                    helperService.DownloadDocument(response.data.Response);
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function DeleteAttachmentConfirmation($item, $index) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(() => DeleteAttachment($item));
        }

        function DeleteAttachment($item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.Delete.Url + authService.getUserInfo().AppPK + "/" + $item.PK).then(response => {
                if (response.data.Status == "Success") {
                    let _index = ExceptionCtrl.ePage.Masters.Exception.Attachment.ListSource.findIndex(x => x.PK === $item.PK);
                    if (_index !== -1) {
                        ExceptionCtrl.ePage.Masters.Exception.Attachment.ListSource.splice(_index, 1);
                    }
                } else {
                    toastr.error("Failed to Delete...!");
                }
            });
        }
        //#endregion
        // #endregion

        // #region EditView
        function InitEditView() {
            ExceptionCtrl.ePage.Masters.Exception.EditView = {};

            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateException = CreateException;
            ExceptionCtrl.ePage.Masters.Exception.EditView.Discard = Discard;

            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Create";
            ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
        }

        function RelatedDetails(isNew) {
            ExceptionCtrl.ePage.Masters.Exception.ActiveException.DataConfig = undefined;
            let _filter = {};

            if (isNew) {
                _filter.DataEntryName = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.OtherConfig ? ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.OtherConfig.CustomFormName : undefined;
            } else {
                _filter.DataEntryName = ExceptionCtrl.ePage.Masters.Exception.ActiveException.CustomFormName;
            }

            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            if (_filter.DataEntryName) {
                apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(response => {
                    if (response.data.Response && typeof response.data.Response == "object") {
                        let _isEmpty = angular.equals({}, response.data.Response);

                        if (!_isEmpty) {
                            ExceptionCtrl.ePage.Masters.Exception.ActiveException.DataConfig = response.data.Response;

                            if (ExceptionCtrl.ePage.Masters.Exception.ActiveException.RelatedDetails) {
                                ExceptionCtrl.ePage.Masters.Exception.ActiveException.DataConfig.Entities = JSON.parse(ExceptionCtrl.ePage.Masters.Exception.ActiveException.RelatedDetails);
                            }
                        }
                    }
                });
            }
        }

        function CreateException() {
            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Please Wait...";
            ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = true;

            let _input = angular.copy(ExceptionCtrl.ePage.Masters.Exception.ActiveException);
            _input.IsModified = true;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = authService.getUserInfo().AppPK;
            _input.Type = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.Key;
            _input.PartyType_FK = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.PartyType_FK;
            _input.PartyType_Code = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.PartyType_Code;

            if (ExceptionCtrl.ePage.Masters.Exception.ActiveException.DataConfig) {
                _input.RelatedDetails = JSON.stringify(ExceptionCtrl.ePage.Masters.Exception.ActiveException.DataConfig.Entities);
            }

            if (ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.OtherConfig) {
                _input.OtherConfig = JSON.stringify(ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.OtherConfig.Choices);
                _input.CustomFormName = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.OtherConfig.CustomFormName;
                _input.ProcessCode = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.OtherConfig.ProcessCode;
            }

            _input.EntitySource = ExceptionCtrl.ePage.Entities.EntitySource;
            _input.EntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
            _input.EntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;

            _input.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
            _input.ParentEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
            _input.ParentEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;

            _input.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey;
            _input.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.AdditionalEntitySource;
            _input.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.AdditionalEntityRefCode;

            apiService.post("eAxisAPI", appConfig.Entities.JobException.API.Insert.Url, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [...[_response], ...ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource];

                    if (_response.OtherConfig && typeof _response.OtherConfig == "string") {
                        _response.OtherConfig = JSON.parse(_response.OtherConfig);
                    }
                    if (ExceptionCtrl.mode == "1") {
                        _response.GroupMapping = PrepareAccessInput(_response);
                    }
                    _response.RelatedDetails = _input.RelatedDetails;

                    ExceptionCtrl.ePage.Masters.Exception.ActiveException = _response;

                    CreateComment();
                }

                ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Create";
                ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
            });
        }

        function CreateComment() {
            let _input = {
                Comments: ExceptionCtrl.ePage.Masters.Exception.ActiveException.Description,
                Description: "Exception General",
                CommentsType: "EXC",

                PartyType_FK: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.PartyType_FK,
                PartyType_Code: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveExceptionType.PartyType_Code,

                EntityRefKey: ExceptionCtrl.ePage.Entities.EntityRefKey,
                EntitySource: ExceptionCtrl.ePage.Entities.EntitySource,
                EntityRefCode: ExceptionCtrl.ePage.Entities.EntityRefCode,

                ParentEntityRefKey: ExceptionCtrl.ePage.Masters.Exception.ActiveException.PK,
                ParentEntitySource: "EXC",
                ParentEntityRefCode: ExceptionCtrl.ePage.Masters.Exception.ActiveException.Title,

                AdditionalEntityRefKey: ExceptionCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntitySource: ExceptionCtrl.ePage.Entities.ParentEntitySource,
                AdditionalEntityRefCode: ExceptionCtrl.ePage.Entities.ParentEntityRefCode
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(response => {});
        }

        function Discard() {
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.ActiveException = undefined;
        }
        // #endregion

        Init();
    }
})();
