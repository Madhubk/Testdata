(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailController", EmailController);

    EmailController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "toastr", "APP_CONSTANT"];

    function EmailController($timeout, authService, apiService, helperService, appConfig, toastr, APP_CONSTANT) {
        /* jshint validthis: true */
        var EmailCtrl = this;

        function Init() {
            EmailCtrl.ePage = {
                "Title": "",
                "Prefix": "Email",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": EmailCtrl.input
            };

            if (EmailCtrl.input) {
                InitEmail();
            }
        }

        function InitEmail() {
            EmailCtrl.ePage.Masters.Email = {};
            EmailCtrl.ePage.Masters.Email.Compose = Compose;
            EmailCtrl.ePage.Masters.Email.GetUserList = GetUserList;
            EmailCtrl.ePage.Masters.SummernoteOptions = APP_CONSTANT.SummernoteOptions;

            InitSideBar();
            InitListView();
            InitReadView();
            InitEditView();
            InitAttachment();

            if (EmailCtrl.mode == "1") {
                EmailCtrl.ePage.Masters.Email.ViewMode = "List";
            } else if (EmailCtrl.mode == "2") {
                Compose();
            }
        }

        function Compose() {
            EmailCtrl.ePage.Masters.Email.ViewMode = "Edit";
            EmailCtrl.ePage.Masters.Email.EditView.ModeType = "Compose";
            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = {};

            helperService.generateNewPk().then(function (response) {
                EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK = response;
            });

            if (EmailCtrl.mode == "2") {
                EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = angular.copy(EmailCtrl.type);
                if (EmailCtrl.type.TemplateObj) {
                    if (EmailCtrl.type.TemplateObj.Key) {
                        if (EmailCtrl.ePage.Masters.Email.EditView.TemplateList && EmailCtrl.ePage.Masters.Email.EditView.TemplateList.length > 0) {
                            var _index = EmailCtrl.ePage.Masters.Email.EditView.TemplateList.map(function (value, key) {
                                return value.Key;
                            }).indexOf(EmailCtrl.type.TemplateObj.Key);

                            if (_index !== -1) {
                                OnTemplateChange(EmailCtrl.ePage.Masters.Email.EditView.TemplateList[_index]);
                            }
                        }
                    }
                }
            }

            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.FROM = authService.getUserInfo().UserId;
        }

        function GetUserList(val) {
            var _val = val;
            if (_val.indexOf(",") != -1) {
                _val = _val.split(",").pop().replace(/ /g, '');
            }

            if (_val != "" || _val != " ") {
                var _filter = {
                    "Autocompletefield": _val
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
                };

                return apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function (response) {
                    return response.data.Response;
                });
            }
        }

        // region SideBar
        function InitSideBar() {
            EmailCtrl.ePage.Masters.Email.SideBar = {};
            EmailCtrl.ePage.Masters.Email.SideBar.OnListClick = OnSideBarListClick;

            GetSideBarList();
        }

        function GetSideBarList() {
            EmailCtrl.ePage.Masters.Email.SideBar.MenuList = [{
                Code: "inbox",
                Desc: "Inbox"
            }, {
                Code: "sent",
                Desc: "Sent"
            }];

            OnSideBarListClick(EmailCtrl.ePage.Masters.Email.SideBar.MenuList[0]);
        }

        function OnSideBarListClick($item) {
            EmailCtrl.ePage.Masters.Email.SideBar.ActiveMenu = $item;
        }
        // endregion

        // region List View
        function InitListView() {
            EmailCtrl.ePage.Masters.Email.ListView = {};
            EmailCtrl.ePage.Masters.Email.ListView.Refresh = RefreshListView;
            EmailCtrl.ePage.Masters.Email.ListView.OnListViewClick = OnListViewClick;
            EmailCtrl.ePage.Masters.Email.ListView.ToolbarOptions = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['insertImage', 'insertLink']
            ];

            GetEmailList();
        }

        function GetEmailList() {
            EmailCtrl.ePage.Masters.Email.ListView.ListSource = undefined;
            var _filter = {
                "EntityRefKey": EmailCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": EmailCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": EmailCtrl.ePage.Entities.EntityRefCode
            };

            if (EmailCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = EmailCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = EmailCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = EmailCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (EmailCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = EmailCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = EmailCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = EmailCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAllWithAccess.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    EmailCtrl.ePage.Masters.Email.ListView.ListSource = response.data.Response;
                } else {
                    EmailCtrl.ePage.Masters.Email.ListView.ListSource = [];
                }
            });
        }

        function RefreshListView() {
            GetEmailList();
        }

        function OnListViewClick($item) {
            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = angular.copy($item);
            EmailCtrl.ePage.Masters.Email.ViewMode = "Read";

            PrepareGroupMapping();
            GetAttachmentList();
        }

        function PrepareGroupMapping() {
            EmailCtrl.ePage.Masters.Email.ReadView.GroupMapping = undefined;

            $timeout(function () {
                EmailCtrl.ePage.Masters.Email.ReadView.GroupMapping = {
                    "MappingCode": "GRUP_ELTYP_APP_TNT",
                    "Item_FK": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK,
                    "ItemCode": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Description,
                    "ItemName": "GRUP",
                    "Title": " Group Access",
                    "MappingAPI": {
                        "API":"eAxisAPI",
                        "FilterID":"JOEMAC",
                        "FindAll":appConfig.Entities.JobEmailAccess.API.FindAll.Url,
                        "Insert":appConfig.Entities.JobEmailAccess.API.Insert.Url,
                        "Update":appConfig.Entities.JobEmailAccess.API.Update.Url,
                        "Delete":appConfig.Entities.JobEmailAccess.API.Delete.Url
                    },
                    "AccessTo": {
                        "Type": "EMAIL",
                        "API": "eAxisAPI",
                        "APIUrl": "JobEmail/EmailTypeAccess",
                        "TextField": "ItemCode",
                        "ValueField": "Item_FK",
                         "Input": {
                            "PartyTypeCode": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PartyType_Code,
                            "PartyTypeRefKey": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PartyType_FK,
                            "StandardType": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.TypeCode,
                            "ParentRefKey": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.EntityRefKey,
                            "ParentRefCode":EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.EntityRefCode,
                            "ParentSource":EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.EntitySource,
                            "MappingCode": "GRUP_ELTYP_APP_TNT",
                            "IsroleInclude":"True"
                        }
                    }
                };
                EmailCtrl.ePage.Masters.Email.ViewMode = "Read";
            });
        }
        // endregion

        // region Read View
        function InitReadView() {
            EmailCtrl.ePage.Masters.Email.ReadView = {};
            EmailCtrl.ePage.Masters.Email.ReadView.GoToList = GoToList;
            EmailCtrl.ePage.Masters.Email.ReadView.Reply = Reply;
            EmailCtrl.ePage.Masters.Email.ReadView.Forward = Forward;
        }

        function GoToList() {
            EmailCtrl.ePage.Masters.Email.ViewMode = "List";
            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = undefined;
        }

        function Reply() {
            var _temp = angular.copy(EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail);
            var _input = angular.copy(EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail);
            _input.TO = _temp.FROM;
            _input.FROM = authService.getUserInfo().UserId;
            _input.AttachmentList = [];

            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = _input;
            EmailCtrl.ePage.Masters.Email.ViewMode = "Edit";
            EmailCtrl.ePage.Masters.Email.EditView.ModeType = "Reply";

            helperService.generateNewPk().then(function (response) {
                EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK = response;
            });
        }

        function Forward() {
            var _input = angular.copy(EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail);
            _input.TO = "";
            _input.FROM = authService.getUserInfo().UserId;
            _input.AttachmentList = [];

            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = _input;
            EmailCtrl.ePage.Masters.Email.ViewMode = "Edit";
            EmailCtrl.ePage.Masters.Email.EditView.ModeType = "Forward";

            helperService.generateNewPk().then(function (response) {
                EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK = response;
            });
        }
        // endregion

        // region Edit View
        function InitEditView() {
            EmailCtrl.ePage.Masters.Email.EditView = {};
            EmailCtrl.ePage.Masters.Email.EditView.Discard = Discard;
            EmailCtrl.ePage.Masters.Email.EditView.Send = UpdateMail;
            EmailCtrl.ePage.Masters.Email.EditView.OnTemplateChange = OnTemplateChange;
            EmailCtrl.ePage.Masters.Email.EditView.ModeType = "Compose";
            EmailCtrl.ePage.Masters.Email.EditView.SendBtnText = "Send";
            EmailCtrl.ePage.Masters.Email.EditView.IsDisableSendBtn = false;

            GetTemplateList();
        }

        function Discard() {
            if (EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList) {
                if (EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList.length > 0) {
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList.map(function (value, key) {
                        DeleteAttachment(value);
                    });
                }
            }

            if (EmailCtrl.mode == "1") {
                EmailCtrl.ePage.Masters.Email.ViewMode = "List";
                EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = undefined;
            } else if (EmailCtrl.mode == "2") {
                CloseModal();
            }
        }

        function GetTemplateList() {
            EmailCtrl.ePage.Masters.Email.EditView.TemplateList = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstEmailType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstEmailType.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EmailCtrl.ePage.Masters.Email.EditView.TemplateList = response.data.Response;
                } else {
                    EmailCtrl.ePage.Masters.Email.EditView.TemplateList = [];
                }
            });
        }

        function OnTemplateChange($item) {
            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Template = undefined;
            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Body = "";

            $timeout(function () {
                if ($item) {
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Template = $item.Key;
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PartyType_FK = $item.PartyType_FK;
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PartyType_Code = $item.PartyType_Code;
                } else {
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Template = undefined;
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PartyType_FK = undefined;
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PartyType_Code = undefined;
                }
            });
        }

        function UpdateMail() {
            var _input = angular.copy(EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail);
            _input.PK = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.Status = "Sent";
            _input.FROM = authService.getUserInfo().UserId;
            _input.TypeCode = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Template;

            if (EmailCtrl.ePage.Entities.EntityRefKey) {
                _input.EntityRefKey = EmailCtrl.ePage.Entities.EntityRefKey;
                _input.EntitySource = EmailCtrl.ePage.Entities.EntitySource;
                _input.EntityRefCode = EmailCtrl.ePage.Entities.EntityRefCode;
            }

            if (EmailCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.ParentEntityRefKey = EmailCtrl.ePage.Entities.ParentEntityRefKey;
                _input.ParentEntitySource = EmailCtrl.ePage.Entities.ParentEntitySource;
                _input.ParentEntityRefCode = EmailCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (EmailCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = EmailCtrl.ePage.Entities.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = EmailCtrl.ePage.Entities.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = EmailCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            if (EmailCtrl.ePage.Masters.Email.EditView.ModeType == "Reply" || EmailCtrl.ePage.Masters.Email.EditView.ModeType == "Forward") {
                _input.ParentEntityRefKey = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK;
                _input.ParentEntitySource = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.EntitySource;
                _input.ParentEntityRefCode = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.EntityRefCode;
            }

            if (_input.TO || _input.CC || _input.BCC) {
                if (_input.Body && _input.Subject) {
                    EmailCtrl.ePage.Masters.Email.EditView.SendBtnText = "Please Wait...";
                    EmailCtrl.ePage.Masters.Email.EditView.IsDisableSendBtn = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.Insert.Url, [_input]).then(function (response) {
                        if (response.data.Response) {
                            if (EmailCtrl.mode == "1") {
                                EmailCtrl.ePage.Masters.Email.ViewMode = "List";
                                EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail = undefined;
                            }
                        } else {
                            toastr.error("Mail Send Failed...!");
                        }
                        EmailCtrl.ePage.Masters.Email.EditView.SendBtnText = "Send";
                        EmailCtrl.ePage.Masters.Email.EditView.IsDisableSendBtn = false;
                        if (EmailCtrl.mode == "1") {
                            GetEmailList();
                        } else if (EmailCtrl.mode == "2") {
                            CloseModal();
                        }
                        EmailCtrl.onComplete({
                            $item: response
                        });
                    });
                } else {
                    toastr.warning("Please Enter the Subject and Body...!");
                }
            } else {
                toastr.warning("Please Enter mail Address...!");
            }
        }

        function CloseModal() {
            EmailCtrl.closeModal();
        }
        // endregion

        // region Attachment
        function InitAttachment() {
            EmailCtrl.ePage.Masters.Email.Attachment = {};

            EmailCtrl.ePage.Masters.Email.Attachment.Autherization = authService.getUserInfo().AuthToken;
            EmailCtrl.ePage.Masters.Email.Attachment.fileDetails = [];
            EmailCtrl.ePage.Masters.Email.Attachment.fileSize = 10;
            EmailCtrl.ePage.Masters.Email.Attachment.UserId = authService.getUserInfo().UserId;

            var _additionalValue = {
                "Entity": EmailCtrl.ePage.Entities.Entity,
                "Path": EmailCtrl.ePage.Entities.Entity + "," + EmailCtrl.ePage.Entities.EntityRefCode
            };

            EmailCtrl.ePage.Masters.Email.Attachment.AdditionalValue = JSON.stringify(_additionalValue);
            EmailCtrl.ePage.Masters.Email.Attachment.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            EmailCtrl.ePage.Masters.Email.Attachment.GetUploadedFiles = GetUploadedFiles;
            EmailCtrl.ePage.Masters.Email.Attachment.GetSelectedFiles = GetSelectedFiles;
            EmailCtrl.ePage.Masters.Email.Attachment.DownloadAttachment = DownloadAttachment;
            EmailCtrl.ePage.Masters.Email.Attachment.DeleteAttachment = DeleteAttachment;
        }

        function GetAttachmentList() {
            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList = undefined;
            var _filter = {
                "Status": "Success",
                "ParentEntityRefKey": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK,
                "ParentEntitySource": EmailCtrl.ePage.Entities.EntitySource,
                "ParentEntityRefCode": EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Subject,
                "DocumentType": "EML"
            };

            if (EmailCtrl.ePage.Entities.EntityRefKey) {
                _filter.EntityRefKey = EmailCtrl.ePage.Entities.EntityRefKey;
                _filter.EntitySource = EmailCtrl.ePage.Entities.EntitySource;
                _filter.EntityRefCode = EmailCtrl.ePage.Entities.EntityRefCode;
            }

            if (EmailCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.AdditionalEntityRefKey = EmailCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.AdditionalEntitySource = EmailCtrl.ePage.Entities.ParentEntitySource;
                _filter.AdditionalEntityRefCode = EmailCtrl.ePage.Entities.ParentEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            if (_filter.EntityRefKey) {
                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                    if (response.data.Response) {
                        EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList = response.data.Response;
                    } else {
                        EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList = [];
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

                if (!EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList) {
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList = [];
                }

                EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList.push(_obj);
            });
        }

        function GetUploadedFiles(files) {
            if (files.length > 0) {
                files.map(function (value1, key1) {
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList.map(function (value2, key2) {
                        if (value1.FileName == value2.name && value1.DocType == value2.type) {
                            SaveAttachment(value1);

                            // value2.EntityRefKey = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK;
                            // value2.EntitySource = EmailCtrl.ePage.Entities.EntitySource;
                            // value2.EntityRefCode = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Subject;

                            // if (EmailCtrl.ePage.Entities.EntityRefKey) {
                            //     value2.ParentEntityRefKey = EmailCtrl.ePage.Entities.EntityRefKey;
                            //     value2.ParentEntitySource = EmailCtrl.ePage.Entities.EntitySource;
                            //     value2.ParentEntityRefCode = EmailCtrl.ePage.Entities.EntityRefCode;
                            // }
                            // if (EmailCtrl.ePage.Entities.ParentEntityRefKey) {
                            //     value2.AdditionalEntityRefKey = EmailCtrl.ePage.Entities.ParentEntityRefKey;
                            //     value2.AdditionalEntitySource = EmailCtrl.ePage.Entities.ParentEntitySource;
                            //     value2.AdditionalEntityRefCode = EmailCtrl.ePage.Entities.ParentEntityRefCode;
                            // }

                            // for (var x in value1) {
                            //     value2[x] = value1[x];
                            // }
                            // value2.IsNew = false;
                        }
                    });
                });
            }

            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.JobDocuments = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList;
        }

        function SaveAttachment($item) {
            var _index = $item.FileName.indexOf(".");
            if (_index != -1) {
                var _docName = $item.FileName.split(".")[0];
            }
            var _input = {
                Status: "Success",
                ParentEntityRefKey: EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.PK,
                ParentEntitySource: EmailCtrl.ePage.Entities.EntitySource,
                ParentEntityRefCode: EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.Subject,
                DocumentType: "EML",
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

            if (EmailCtrl.ePage.Entities.EntityRefKey) {
                _input.EntityRefKey = EmailCtrl.ePage.Entities.EntityRefKey;
                _input.EntitySource = EmailCtrl.ePage.Entities.EntitySource;
                _input.EntityRefCode = EmailCtrl.ePage.Entities.EntityRefCode;
            }

            if (EmailCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.AdditionalEntityRefKey = EmailCtrl.ePage.Entities.ParentEntityRefKey;
                _input.AdditionalEntitySource = EmailCtrl.ePage.Entities.ParentEntitySource;
                _input.AdditionalEntityRefCode = EmailCtrl.ePage.Entities.ParentEntityRefCode;
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    var _index = EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList.map(function (value, key) {
                        return value.name;
                    }).indexOf($item.FileName);

                    if (_index !== -1) {
                        for (var x in _response) {
                            EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList[_index][x] = _response[x];
                        }
                    }
                    EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList[_index].IsNew = false;
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

        function DeleteAttachment($item) {
            // var _input = angular.copy($item);
            // _input.IsActive = true;
            // _input.Status = "Deleted";
            // _input.IsModified = true;
            // _input.IsDeleted = true;

            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.Delete.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    // if ($index != -1) {
                    //     EmailCtrl.ePage.Masters.Email.ListView.ActiveEmail.AttachmentList.splice($index, 1);
                    // }
                }
            });
        }
        // endregion

        Init();
    }
})();
