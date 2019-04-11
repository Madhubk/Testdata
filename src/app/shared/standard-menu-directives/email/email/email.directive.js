(function () {
    "use strict";

    angular
        .module("Application")
        .directive("prepareEmailTemplate", PrepareEmailTemplate);

    PrepareEmailTemplate.$inject = ["$compile", "$http", "$templateCache", "$timeout"];

    function PrepareEmailTemplate($compile, $http, $templateCache, $timeout) {
        let exports = {
            restrict: "EA",
            scope: {
                templateName: "=",
                obj: "=",
                tempHtml: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            scope.$watch("templateName", (newVal, oldVal) => {
                if (newVal) {
                    ChangeEmailBody();
                }
            }, true);

            function ChangeEmailBody() {
                let _loader = GetTemplate(scope.templateName);

                _loader.success(html => ele.html(html)).then(response => {
                    let el = angular.element(response.data);
                    ele.empty();
                    ele.append(el);
                    $compile(el)(scope);
                    $timeout(function () {
                        scope.tempHtml = ele.html();
                        ele.empty();
                    });
                });
            }
        }

        function GetTemplate($item) {
            let _baseUrl = 'app/shared/standard-menu-directives/email/email/template/';
            let _templateUrl = _baseUrl + $item + ".html";
            let _templateName = $http.get(_templateUrl, {
                cache: $templateCache
            });

            return _templateName;
        }
    }

    angular
        .module("Application")
        .directive("email", Email);

    function Email() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/email/email/email.html",
            controller: 'EmailController',
            controllerAs: 'EmailCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&",
                onComplete: "&"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("EmailController", EmailController);

    EmailController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "toastr", "APP_CONSTANT", "confirmation"];

    function EmailController($timeout, authService, apiService, helperService, appConfig, toastr, APP_CONSTANT, confirmation) {
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

            EmailCtrl.ePage.Masters.CheckControlAccess = CheckControlAccess;
            InitEmail();
        }

        function CheckControlAccess(controlId) {
            return helperService.checkUIControl(controlId);
        }

        function InitEmail() {
            EmailCtrl.ePage.Masters.Email = {};

            EmailCtrl.ePage.Masters.Email.UserId = authService.getUserInfo().UserId;
            EmailCtrl.ePage.Masters.Email.SummernoteOptions = APP_CONSTANT.SummernoteOptions;

            InitAttachment();
            InitListView();
            InitReadView();
            InitEditView();

            EmailCtrl.mode == "2" ? Compose() : EmailCtrl.ePage.Masters.Email.ViewMode = "List";
        }

        function CloseModal() {
            EmailCtrl.closeModal();
        }

        // #region ListView
        function InitListView() {
            EmailCtrl.ePage.Masters.Email.ListView = {};

            EmailCtrl.ePage.Masters.Email.ListView.Compose = Compose;
            EmailCtrl.ePage.Masters.Email.ListView.Refresh = Refresh;
            EmailCtrl.ePage.Masters.Email.ListView.OnEmailClick = OnEmailClick;

            CheckMode();
        }

        function CheckMode() {
            if (EmailCtrl.mode == "2") {
                Compose();
            } else {
                GetEmailList();
            }
        }

        function GetEmailList() {
            EmailCtrl.ePage.Masters.Email.ListView.ListSource = undefined;
            let _filter = {
                EntityRefKey: EmailCtrl.ePage.Entities.EntityRefKey,
                ParentEntityRefKey: EmailCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntityRefKey: EmailCtrl.ePage.Entities.AdditionalEntityRefKey,
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAllWithAccess.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response;

                    if (EmailCtrl.mode == "1") {
                        _response.map(x => {
                            x.GroupMapping = PrepareAccessInput(x);
                        });
                    }

                    EmailCtrl.ePage.Masters.Email.ListView.ListSource = _response;
                } else {
                    EmailCtrl.ePage.Masters.Email.ListView.ListSource = [];
                }
            });
        }

        function PrepareAccessInput($item) {
            return {
                "Item": $item,
                "MappingCode": "GRUP_ELTYP_APP_TNT",
                "Item_FK": $item.PK,
                "ItemCode": $item.Description,
                "ItemName": "GRUP",
                "Title": " Group Access",
                "MappingAPI": {
                    "API": "eAxisAPI",
                    "FilterID": "JOEMAC",
                    "FindAll": appConfig.Entities.JobEmailAccess.API.FindAll.Url,
                    "Insert": appConfig.Entities.JobEmailAccess.API.Insert.Url,
                    "Update": appConfig.Entities.JobEmailAccess.API.Update.Url,
                    "Delete": appConfig.Entities.JobEmailAccess.API.Delete.Url
                },
                "AccessTo": {
                    "Type": "EMAIL",
                    "API": "eAxisAPI",
                    "APIUrl": "JobEmail/EmailTypeAccess",
                    "TextField": "ItemCode",
                    "ValueField": "Item_FK",
                    "Input": {
                        "PartyTypeCode": $item.PartyType_Code,
                        "PartyTypeRefKey": $item.PartyType_FK,
                        "StandardType": $item.TypeCode,
                        "ParentRefKey": $item.EntityRefKey,
                        "ParentRefCode": $item.EntityRefCode,
                        "ParentSource": $item.EntitySource,
                        "MappingCode": "GRUP_ELTYP_APP_TNT",
                        "IsroleInclude": "True"
                    }
                }
            };
        }

        function Refresh() {
            GetEmailList();
        }

        function Compose($item) {
            if($item){
                EmailCtrl.ePage.Masters.Email.ActiveEmail = $item;
            } else {
                EmailCtrl.ePage.Masters.Email.ActiveEmail = {
                    Status: "Sent",
                    TenantCode: authService.getUserInfo().TenantCode
                };
                EmailCtrl.ePage.Masters.Email.Attachment.ListSource = [];
            }

            EmailCtrl.ePage.Masters.Email.ActiveEmail.FROM = authService.getUserInfo().UserId;

            EmailCtrl.ePage.Masters.Email.ViewMode = "Edit";
            EmailCtrl.ePage.Masters.Email.Attachment.TempListSource = [];

            helperService.generateNewPk().then(response => EmailCtrl.ePage.Masters.Email.ActiveEmail.PK = response);

            if (EmailCtrl.mode == "2") {
                if (EmailCtrl.type) {
                    if (EmailCtrl.type.TemplateObj) {
                        if (EmailCtrl.type.TemplateObj.Key) {
                            EmailCtrl.ePage.Masters.Email.ActiveEmail.TypeCode = EmailCtrl.type.TemplateObj.Key;

                            if (EmailCtrl.ePage.Masters.Email.EditView.TemplateList && EmailCtrl.ePage.Masters.Email.EditView.TemplateList.length > 0) {
                                var _index = EmailCtrl.ePage.Masters.Email.EditView.TemplateList.findIndex(value => value.Key == EmailCtrl.type.TemplateObj.Key);

                                if (_index !== -1) {
                                    OnTemplateChange(EmailCtrl.ePage.Masters.Email.EditView.TemplateList[_index]);
                                }
                            }
                        }
                    }

                    if (EmailCtrl.type.AttachmentList && EmailCtrl.type.AttachmentList.length > 0) {
                        CopyDocument(EmailCtrl.type.AttachmentList);
                    }
                }
            }
        }

        function OnEmailClick($item) {
            EmailCtrl.ePage.Masters.Email.ActiveEmail = angular.copy($item);

            EmailCtrl.ePage.Masters.Email.ViewMode = "Read";
            GetAttachmentList();
        }
        // #endregion

        // #region ReadView
        function InitReadView() {
            EmailCtrl.ePage.Masters.Email.ReadView = {};
            EmailCtrl.ePage.Masters.Email.ReadView.GoToListView = GoToListView;
        }

        function GoToListView() {
            EmailCtrl.ePage.Masters.Email.ViewMode = "List";
            EmailCtrl.ePage.Masters.Email.ActiveEmail = undefined;
        }
        // #endregion

        // #region EditView
        function InitEditView() {
            EmailCtrl.ePage.Masters.Email.EditView = {};

            EmailCtrl.ePage.Masters.Email.EditView.OnTemplateChange = OnTemplateChange;
            EmailCtrl.ePage.Masters.Email.EditView.Discard = Discard;
            EmailCtrl.ePage.Masters.Email.EditView.Send = SendMail;
            EmailCtrl.ePage.Masters.Email.ReadView.Reply = Reply;
            EmailCtrl.ePage.Masters.Email.ReadView.Forward = Forward;

            EmailCtrl.ePage.Masters.Email.EditView.SendBtnText = "Send";
            EmailCtrl.ePage.Masters.Email.EditView.IsDisableSendBtn = false;

            GetTemplateList();
        }

        function GetTemplateList() {
            EmailCtrl.ePage.Masters.Email.EditView.TemplateList = undefined;
            let _filter = {};
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstEmailType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstEmailType.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    EmailCtrl.ePage.Masters.Email.EditView.TemplateList = response.data.Response;
                } else {
                    EmailCtrl.ePage.Masters.Email.EditView.TemplateList = [];
                }
            });
        }

        function OnTemplateChange($item) {
            EmailCtrl.ePage.Masters.Email.ActiveEmail.Body = "";

            $timeout(() => {
                if ($item) {
                    EmailCtrl.ePage.Masters.Email.ActiveEmail.PartyType_FK = $item.PartyType_FK;
                    EmailCtrl.ePage.Masters.Email.ActiveEmail.PartyType_Code = $item.PartyType_Code;
                } else {
                    EmailCtrl.ePage.Masters.Email.ActiveEmail.PartyType_FK = undefined;
                    EmailCtrl.ePage.Masters.Email.ActiveEmail.PartyType_Code = undefined;
                }
            });
        }

        function Reply(){
            let _mailInput = angular.copy(EmailCtrl.ePage.Masters.Email.ActiveEmail);
            _mailInput.TO = _mailInput.FROM;

            Compose(_mailInput);
        }

        function Forward(){
            let _mailInput = angular.copy(EmailCtrl.ePage.Masters.Email.ActiveEmail);
            _mailInput.TO = undefined;

            Compose(_mailInput);
        }

        function Discard() {
            EmailCtrl.ePage.Masters.Email.ViewMode = "List";
            EmailCtrl.ePage.Masters.Email.ActiveEmail = undefined;
            EmailCtrl.ePage.Masters.Email.Attachment.TempListSource = [];

            if (EmailCtrl.ePage.Masters.Email.Attachment.ListSource && EmailCtrl.ePage.Masters.Email.Attachment.ListSource.length > 0) {
                EmailCtrl.ePage.Masters.Email.Attachment.ListSource.map(x => DeleteAttachment(x));
            }

            if (EmailCtrl.mode == "2") {
                CloseModal();
            }
        }

        function SendMail() {
            let _input = angular.copy(EmailCtrl.ePage.Masters.Email.ActiveEmail);
            _input.GroupMapping = {};
            _input.JobDocuments = EmailCtrl.ePage.Masters.Email.Attachment.ListSource;

            _input.EntityRefKey = EmailCtrl.ePage.Entities.EntityRefKey;
            _input.EntitySource = EmailCtrl.ePage.Entities.EntitySource;
            _input.EntityRefCode = EmailCtrl.ePage.Entities.EntityRefCode;

            _input.ParentEntityRefKey = EmailCtrl.ePage.Entities.ParentEntityRefKey;
            _input.ParentEntitySource = EmailCtrl.ePage.Entities.ParentEntitySource;
            _input.ParentEntityRefCode = EmailCtrl.ePage.Entities.ParentEntityRefCode;

            _input.AdditionalEntityRefKey = EmailCtrl.ePage.Entities.AdditionalEntityRefKey;
            _input.AdditionalEntitySource = EmailCtrl.ePage.Entities.AdditionalEntitySource;
            _input.AdditionalEntityRefCode = EmailCtrl.ePage.Entities.AdditionalEntityRefCode;

            if (_input.TO || _input.CC || _input.BCC) {
                if (_input.Body && _input.Subject) {
                    EmailCtrl.ePage.Masters.Email.EditView.SendBtnText = "Please Wait...";
                    EmailCtrl.ePage.Masters.Email.EditView.IsDisableSendBtn = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.Insert.Url, [_input]).then(response => {
                        if (response.data.Response && response.data.Response.length > 0) {
                            if (EmailCtrl.mode == "2") {
                                CloseModal();
                            } else {
                                let _response = response.data.Response[0];
                                if (!EmailCtrl.ePage.Masters.Email.ListView.ListSource) {
                                    EmailCtrl.ePage.Masters.Email.ListView.ListSource = [];
                                }
                                _response.GroupMapping = PrepareAccessInput(_response);
                                EmailCtrl.ePage.Masters.Email.ListView.ListSource.push(_response);

                                EmailCtrl.ePage.Masters.Email.ViewMode = "List";
                                EmailCtrl.ePage.Masters.Email.ActiveEmail = undefined;
                            }
                            toastr.success("Mail Send Successfully...!");
                        } else {
                            toastr.error("Mail Send Failed...!");
                        }
                        EmailCtrl.ePage.Masters.Email.EditView.SendBtnText = "Send";
                        EmailCtrl.ePage.Masters.Email.EditView.IsDisableSendBtn = false;
                    });
                } else {
                    toastr.warning("Please Enter the Subject and Body...!");
                }
            } else {
                toastr.warning("Please enter email id...!");
            }
        }

        // #region Attachment
        function InitAttachment() {
            let _additionalValue = {
                "Entity": EmailCtrl.ePage.Entities.Entity,
                "Path": EmailCtrl.ePage.Entities.Entity + "," + EmailCtrl.ePage.Entities.EntityRefCode
            };

            EmailCtrl.ePage.Masters.Email.Attachment = {
                Autherization: authService.getUserInfo().AuthToken,
                fileDetails: [],
                fileSize: 10,
                UserId: authService.getUserInfo().UserId,
                AdditionalValue: JSON.stringify(_additionalValue),
                UploadUrl: APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url
            };

            EmailCtrl.ePage.Masters.Email.Attachment.GetSelectedFiles = GetSelectedFiles;
            EmailCtrl.ePage.Masters.Email.Attachment.GetUploadedFiles = GetUploadedFiles;
            EmailCtrl.ePage.Masters.Email.Attachment.DownloadAttachment = DownloadAttachment;
            EmailCtrl.ePage.Masters.Email.Attachment.DeleteAttachment = DeleteAttachmentConfirmation;
        }

        function GetAttachmentList() {
            EmailCtrl.ePage.Masters.Email.Attachment.ListSource = undefined;
            let _filter = {
                Status: "Success",
                DocumentType: "EML",
                EntityRefKey: EmailCtrl.ePage.Entities.EntityRefKey,
                ParentEntityRefKey: EmailCtrl.ePage.Masters.Email.ActiveEmail.PK,
                AdditionalEntityRefKey: EmailCtrl.ePage.Entities.ParentEntityRefKey,
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    EmailCtrl.ePage.Masters.Email.Attachment.ListSource = response.data.Response;
                } else {
                    EmailCtrl.ePage.Masters.Email.Attachment.ListSource = [];
                }
            });
        }

        function CopyDocument(docList) {
            let _docPK = docList[0].PK;
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.DocumentCopy.Url + _docPK).then(function (response) {
                if (response.data.Response) {
                    EmailCtrl.ePage.Masters.Email.Attachment.ListSource = angular.copy([response.data.Response]);
                }
            });
        }

        function GetSelectedFiles(files) {
            EmailCtrl.ePage.Masters.Email.Attachment.TempListSource = [];
            files.map(x => {
                let _obj = {
                    type: x.type,
                    name: x.name,
                    IsActive: true,
                    DocumentType: "EML",
                    DocumentName: x.name,
                    Status: "Success",
                    IsNew: true
                };

                EmailCtrl.ePage.Masters.Email.Attachment.TempListSource.push(_obj);
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
                DocumentType: "EML",
                FileName: $item.FileName,
                FileExtension: $item.FileExtension,
                ContentType: $item.DocType,
                IsActive: true,
                IsModified: true,
                DocFK: $item.Doc_PK,
                DocumentName: ($item.FileName.indexOf(".") != -1) ? $item.FileName.split(".")[0] : $item.FileName,

                EntityRefKey: EmailCtrl.ePage.Entities.EntityRefKey,
                EntitySource: EmailCtrl.ePage.Entities.EntitySource,
                EntityRefCode: EmailCtrl.ePage.Entities.EntityRefCode,

                ParentEntityRefKey: EmailCtrl.ePage.Masters.Email.ActiveEmail.PK,
                ParentEntitySource: "EML",
                ParentEntityRefCode: EmailCtrl.ePage.Masters.Email.ActiveEmail.Subject,

                AdditionalEntityRefKey: EmailCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntitySource: EmailCtrl.ePage.Entities.ParentEntitySource,
                AdditionalEntityRefCode: EmailCtrl.ePage.Entities.ParentEntityRefCode
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Insert.Url + authService.getUserInfo().AppPK, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    EmailCtrl.ePage.Masters.Email.Attachment.TempListSource.map(x => {
                        if ($item.FileName == x.name && x.IsNew) {
                            x.IsNew = false;
                        }
                    });

                    if (!EmailCtrl.ePage.Masters.Email.Attachment.ListSource) {
                        EmailCtrl.ePage.Masters.Email.Attachment.ListSource = [];
                    }
                    EmailCtrl.ePage.Masters.Email.Attachment.ListSource.push(_response);

                    let _isExist = EmailCtrl.ePage.Masters.Email.Attachment.TempListSource.some(x => x.IsNew == true);

                    if (!_isExist) {
                        EmailCtrl.ePage.Masters.Email.Attachment.TempListSource = undefined;
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
                    let _index = EmailCtrl.ePage.Masters.Email.Attachment.ListSource.findIndex(x => x.PK === $item.PK);
                    if (_index !== -1) {
                        EmailCtrl.ePage.Masters.Email.Attachment.ListSource.splice(_index, 1);
                    }
                } else {
                    toastr.error("Failed to Delete...!");
                }
            });
        }
        // #endregion
        // #endregion

        Init();
    }
})();
