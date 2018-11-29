(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptionController", ExceptionController);

    ExceptionController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ExceptionController($timeout, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
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

            if (ExceptionCtrl.ePage.Entities) {
                InitException();
            }
        }

        function InitException() {
            ExceptionCtrl.ePage.Masters.Exception = {};
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.UserId = authService.getUserInfo().UserId;
            ExceptionCtrl.ePage.Masters.Exception.Compose = Compose;

            InitReadView();
            InitEditView();
            InitListView();
            InitSideBar();
            InitAttachment();
        }

        function Compose($item) {
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Edit";
            ExceptionCtrl.ePage.Masters.Exception.EditView.ModeType = "Compose";
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = {};

            // helperService.generateNewPk().then(function (response) {
            //     ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK = response;
            // });

            if ($item.OtherConfig) {
                OnMstExceptionClick($item, "New");
            } else {
                ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponseTemp = undefined;
                ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse = undefined;
                OnMstExceptionClick($item);
            }
        }

        // region SideBar
        function InitSideBar() {
            ExceptionCtrl.ePage.Masters.Exception.SideBar = {};
            ExceptionCtrl.ePage.Masters.Exception.SideBar.OnListClick = OnMstExceptionClick;

            if (ExceptionCtrl.mode == "1") {
                GetExceptionFilterList();
            } else {
                ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException = {};
                OnMstExceptionClick(ExceptionCtrl.type, "New");
            }
        }

        function GetExceptionFilterList() {
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "ExceptionType",
                "Key": ExceptionCtrl.ePage.Entities.Entity
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
                        GetMstExceptionList(_response.Value);
                    } else {
                        GetMstExceptionList("GEN");
                    }
                }
            });
        }

        function GetMstExceptionList($item) {
            var _filter = {
                // "TypeCode": ExceptionCtrl.ePage.Entities.EntitySource + ",OTH",
                "Key": $item,
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstExceptionType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstExceptionType.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    // if (!_list) {
                    //     _list = [{
                    //         Key: "GEN",
                    //         Description: "General",
                    //         Value: "Genaral",
                    //         TypeCode: ExceptionCtrl.ePage.Entities.EntitySource,
                    //         SAP_FK: authService.getUserInfo().AppPK,
                    //         TenantCode: authService.getUserInfo().TenantCode
                    //     }];
                    // }
                    var _obj = {
                        Description: "All",
                        Value: "All",
                        TypeCode: ExceptionCtrl.ePage.Entities.EntitySource,
                        SAP_FK: authService.getUserInfo().AppPK,
                        TenantCode: authService.getUserInfo().TenantCode
                    };

                    _list.push(_obj);
                    _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

                    if (_list.length > 0) {
                        _list.map(function (value, key) {
                            if (value.OtherConfig) {
                                if (typeof value.OtherConfig == "string") {
                                    value.OtherConfig = JSON.parse(value.OtherConfig);
                                }
                            }
                        });

                        ExceptionCtrl.ePage.Masters.Exception.SideBar.MstExceptionList = _list;
                        OnMstExceptionClick(ExceptionCtrl.ePage.Masters.Exception.SideBar.MstExceptionList[0]);
                    } else {
                        ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                    }
                } else {
                    ExceptionCtrl.ePage.Masters.Exception.SideBar.MstExceptionList = [];
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                }
            });
        }

        function OnMstExceptionClick($item, type) {
            if (type == "New") {
                ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException = $item;
                GetConfigDetails($item);
                GetJobExceptionList();
            } else if (!ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException || ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.Key != $item.Key) {
                ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException = $item;
                GetJobExceptionList();
            }
        }

        function GetConfigDetails($item) {
            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponseTemp = undefined;
            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse = undefined;
            var _filter = {};
            if ($item) {
                _filter.DataEntryName = $item.OtherConfig.CustomFormName;
            } else {
                _filter.DataEntryName = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CustomFormName;
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (typeof response.data.Response == "object") {
                        var _isEmpty = angular.equals({}, response.data.Response);

                        if (!_isEmpty) {
                            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponseTemp = angular.copy(response.data.Response);
                            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse = response.data.Response;

                            if (ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.RelatedDetails) {
                                ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse.Entities = JSON.parse(ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.RelatedDetails);
                            }
                        }
                    }
                }
            });
        }
        // endregion

        // region List View
        function InitListView() {
            ExceptionCtrl.ePage.Masters.Exception.ListView = {};
            ExceptionCtrl.ePage.Masters.Exception.ListView.Refresh = RefreshListView;
            ExceptionCtrl.ePage.Masters.Exception.ListView.OnListViewClick = OnListViewClick;
        }

        function GetJobExceptionList() {
            ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = undefined;
            var _filter = {
                "Type": ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.Key,
                "EntitySource": ExceptionCtrl.ePage.Entities.EntitySource,
                "EntityRefKey": ExceptionCtrl.ePage.Entities.EntityRefKey,
                "EntityRefCode": ExceptionCtrl.ePage.Entities.EntityRefCode,
                // "CommonRefKey": ExceptionCtrl.ePage.Entities.EntityRefKey
            };

            if (ExceptionCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobException.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobException.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = response.data.Response;
                } else {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                }
            });
        }

        function RefreshListView() {
            GetJobExceptionList();
        }

        function OnListViewClick($item) {
            ExceptionCtrl.ePage.Masters.Exception.ReadView.IsShowDynamicForm = false;
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = angular.copy($item);
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput = undefined;

            GetConfigDetails();
            GetAttachmentList();
            if (ExceptionCtrl.mode == "1") {
                PrepareGroupMapping();
            }

            $timeout(function () {
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput = angular.copy(ExceptionCtrl.ePage.Entities);

                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.EntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.EntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.EntitySource = ExceptionCtrl.ePage.Entities.EntitySource;

                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.ParentEntityRefCode = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.ParentEntityRefKey = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.ParentEntitySource = "EXC";

                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.CommentsType = "PUB";
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.PartyType_FK = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_FK;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.PartyType_Code = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_Code;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.Description = "Exception General";

                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.IsReadOnly = ExceptionCtrl.ePage.Entities.IsReadOnly;

                ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Read";
            });
        }

        function PrepareGroupMapping() {
            ExceptionCtrl.ePage.Masters.Exception.ReadView.GroupMapping = undefined;

            $timeout(function () {
                ExceptionCtrl.ePage.Masters.Exception.ReadView.GroupMapping = {
                    "MappingCode": "EXCE_GRUP_APP_TNT",
                    "Item_FK": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK,
                    "ItemCode": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Description,
                    "ItemName": "GRUP",
                    "Title": " Group Access",
                    "MappingAPI": {
                        "API":"eAxisAPI",
                        "FilterID":"JOEXAC",
                        "FindAll":appConfig.Entities.JobExceptionAccess.API.FindAll.Url,
                        "Insert":appConfig.Entities.JobExceptionAccess.API.Insert.Url,
                        "Update":appConfig.Entities.JobExceptionAccess.API.Update.Url,
                        "Delete":appConfig.Entities.JobExceptionAccess.API.Delete.Url
                    },
                    "AccessTo": {
                        "Type": "EXCEPTION",
                        "API": "eAxisAPI",
                        "APIUrl": "JobException/ExceptionTypeAccess",
                        "TextField": "ItemCode",
                        "ValueField": "Item_FK",
                        "Input": {
                            "PartyTypeCode": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PartyType_Code,
                            "PartyTypeRefKey": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PartyType_FK,
                            "StandardType": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Type,
                            "ParentRefKey": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.EntityRefKey,
                            "ParentRefCode":ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.EntityRefCode,
                            "ParentSource":ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.EntitySource,
                            "MappingCode": "GRUP_ETYP_APP_TNT",
                            "IsroleInclude":"True"
                        }
                    }
                };
                ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Read";
            });
        }
        // endregion

        // region Read View
        function InitReadView() {
            ExceptionCtrl.ePage.Masters.Exception.ReadView = {};
            ExceptionCtrl.ePage.Masters.Exception.ReadView.GoToList = GoToList;

            ExceptionCtrl.ePage.Masters.Exception.ReadView.UpdateBtnText = "Update";
            ExceptionCtrl.ePage.Masters.Exception.ReadView.IsDisableUpdateBtn = false;
        }

        function GoToList() {
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = undefined;
        }
        // endregion

        // region Edit View
        function InitEditView() {
            ExceptionCtrl.ePage.Masters.Exception.EditView = {};
            ExceptionCtrl.ePage.Masters.Exception.EditView.Discard = Discard;
            ExceptionCtrl.ePage.Masters.Exception.EditView.Create = SaveException;

            ExceptionCtrl.ePage.Masters.Exception.EditView.ModeType = "Compose";

            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Create";
            ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
        }

        function SaveException(type) {
            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Please Wait...";
            ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = true;

            var _input = angular.copy(ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException);
            _input.IsModified = true;

            if (type == "insert") {
                _input.TenantCode = authService.getUserInfo().TenantCode;
                _input.SAP_FK = authService.getUserInfo().AppPK;
                _input.Type = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.Key;
                _input.PartyType_FK = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_FK;
                _input.PartyType_Code = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_Code;

                _input.EntitySource = ExceptionCtrl.ePage.Entities.EntitySource;
                _input.EntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
                _input.EntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;

                if (ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse) {
                    _input.RelatedDetails = JSON.stringify(ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse.Entities);
                }

                if (ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig) {
                    _input.OtherConfig = JSON.stringify(ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.Choices);
                    _input.CustomFormName = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.CustomFormName;
                    _input.ProcessCode = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.ProcessCode;
                }

                if (ExceptionCtrl.ePage.Entities.ParentEntityRefKey) {
                    _input.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
                    _input.ParentEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
                    _input.ParentEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    _input.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey;
                    _input.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.AdditionalEntitySource;
                    _input.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.AdditionalEntityRefCode;
                }
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobException.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        var _index = ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource.push(_response);
                        } else {
                            ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource[_index] = _response;
                        }

                        ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = _response;

                        if (type == "insert") {
                            CreateComment();
                        }

                        // if (type == "insert" && ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig) {
                        //     // CreateInstance();
                        // } else {
                        Discard();
                        ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Save";
                        ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
                        // }
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    if (type == "update") {
                        Discard();
                        ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Save";
                        ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
                    }
                }
            });
        }

        function CreateInstance() {
            var _input = {
                EntityName: "Exception",

                ParentEntityRefCode: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title,
                ParentEntityRefKey: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK,
                ParentEntitySource: "EXC",
                PartyType_FK: ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_FK,
                PartyType_Code: ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_Code,

                EntityRefCode: ExceptionCtrl.ePage.Entities.EntityRefCode,
                EntityRefKey: ExceptionCtrl.ePage.Entities.EntityRefKey,
                EntitySource: ExceptionCtrl.ePage.Entities.EntitySource,

                AdditionalEntityRefCode: ExceptionCtrl.ePage.Entities.ParentEntityRefCode,
                AdditionalEntityRefKey: ExceptionCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntitySource: ExceptionCtrl.ePage.Entities.ParentEntitySource,

                ProcessName: ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.ProcessName,

                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true
            };

            if (ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.DataSlots) {
                _input.DataSlots = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.DataSlots;
            }

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.InstanceNo = response.data.Response.InstanceNo;
                    SaveException("update");
                }
            });
        }

        function CreateComment() {
            var _input = {};
            _input.Comments = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Description;
            _input.Description = "Exception General";

            _input.ParentEntityRefKey = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK;
            _input.ParentEntitySource = "EXC";
            _input.ParentEntityRefCode = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title;
            _input.CommentsType = "PUB";

            _input.PartyType_FK = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_FK;
            _input.PartyType_Code = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.PartyType_Code;

            if (ExceptionCtrl.ePage.Entities.EntityRefKey) {
                _input.EntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
                _input.EntitySource = ExceptionCtrl.ePage.Entities.EntitySource;
                _input.EntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;
            }

            if (ExceptionCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
                _input.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
                _input.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {}
            });
        }

        function Discard() {
            if (ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList) {
                if (ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList.length > 0) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList.map(function (value, key) {
                        DeleteAttachment(value, key);
                    });
                }
            }

            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = undefined;
        }
        // endregion

        // region Attachment
        function InitAttachment() {
            ExceptionCtrl.ePage.Masters.Exception.Attachment = {};

            ExceptionCtrl.ePage.Masters.Exception.Attachment.Autherization = authService.getUserInfo().AuthToken;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.fileDetails = [];
            ExceptionCtrl.ePage.Masters.Exception.Attachment.fileSize = 10;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.UserId = authService.getUserInfo().UserId;

            var _additionalValue = {
                "Entity": ExceptionCtrl.ePage.Entities.Entity,
                "Path": ExceptionCtrl.ePage.Entities.Entity + "," + ExceptionCtrl.ePage.Entities.EntityRefCode
            };

            ExceptionCtrl.ePage.Masters.Exception.Attachment.AdditionalValue = JSON.stringify(_additionalValue);
            ExceptionCtrl.ePage.Masters.Exception.Attachment.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            ExceptionCtrl.ePage.Masters.Exception.Attachment.GetUploadedFiles = GetUploadedFiles;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.GetSelectedFiles = GetSelectedFiles;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.DownloadAttachment = DownloadAttachment;
            ExceptionCtrl.ePage.Masters.Exception.Attachment.DeleteAttachment = DeleteAttachmentConfirmation;
        }

        function GetAttachmentList() {
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList = undefined;
            var _filter = {
                "Status": "Success",
                "ParentEntityRefKey": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK,
                "ParentEntitySource": "EXC",
                "ParentEntityRefCode": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title,
                "DocumentType": "EXC"
            };

            if (ExceptionCtrl.ePage.Entities.EntityRefKey) {
                _filter.EntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
                _filter.EntitySource = ExceptionCtrl.ePage.Entities.EntitySource;
                _filter.EntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;
            }

            if (ExceptionCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
                _filter.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            if (_filter.EntityRefKey) {
                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                    if (response.data.Response) {
                        ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList = response.data.Response;
                    } else {
                        ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList = [];
                    }
                });
            }
        }

        function GetSelectedFiles(files) {
            files.map(function (value1, key1) {
                var _obj = {
                    type: value1.type,
                    name: value1.name,
                    IsActive: true,
                    DocumentType: "EML",
                    DocumentName: value1.name,
                    // BelongTo_Code: docType.BelongTo_Code,
                    // BelongTo_FK: docType.BelongTo_FK,
                    // PartyType_Code: docType.PartyType_Code,
                    // PartyType_FK: docType.PartyType_FK,
                    Status: "Success",
                    IsNew: true
                };

                if (!ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList = [];
                }

                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList.push(_obj);
            });
        }

        function GetUploadedFiles(files) {
            if (files.length > 0) {
                files.map(function (value1, key1) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList.map(function (value2, key2) {
                        if (value1.FileName == value2.name && value1.DocType == value2.type) {
                            SaveAttachment(value1);
                        }
                    });
                });
            }
        }

        function SaveAttachment($item) {
            var _index = $item.FileName.indexOf(".");
            if (_index != -1) {
                var _docName = $item.FileName.split(".")[0];
            }
            var _input = {
                Status: "Success",
                ParentEntityRefKey: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK,
                ParentEntitySource: "EXC",
                ParentEntityRefCode: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title,
                DocumentType: "EXC",
                FileName: $item.FileName,
                FileExtension: $item.FileExtension,
                ContentType: $item.DocType,
                IsActive: true,
                IsModified: true,
                DocFK: $item.Doc_PK,
                DocumentName: _docName,
                // BelongTo_Code: row.BelongTo_Code,
                // BelongTo_FK: row.BelongTo_FK,
                // PartyType_Code: row.PartyType_Code,
                // PartyType_FK: row.PartyType_FK
            };

            if (ExceptionCtrl.ePage.Entities.EntityRefKey) {
                _input.EntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
                _input.EntitySource = ExceptionCtrl.ePage.Entities.EntitySource;
                _input.EntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;
            }

            if (ExceptionCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
                _input.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
                _input.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    var _index = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList.map(function (value, key) {
                        return value.name;
                    }).indexOf($item.FileName);

                    if (_index !== -1) {
                        for (var x in _response) {
                            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList[_index][x] = _response[x];
                        }
                    }
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList[_index].IsNew = false;
                }
            });
        }

        function DownloadAttachment($item) {
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

        function DeleteAttachmentConfirmation($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteAttachment($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteAttachment($item, $index) {
            var _input = angular.copy($item);
            // _input.IsActive = true;
            // _input.Status = "Deleted";
            // _input.IsModified = true;
            // _input.IsDeleted = true;

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Delete.Url, $item.PK).then(function (response) {
                // if (response.data.Response) {
                //     if ($index != -1) {
                //         ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.AttachmentList.splice($index, 1);
                //     }
                // }
            });
        }

        Init();
    }
})();
