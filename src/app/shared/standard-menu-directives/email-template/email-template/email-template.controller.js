(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailTemplateController", EmailTemplateController);

    EmailTemplateController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "confirmation", "toastr"];

    function EmailTemplateController($timeout, authService, apiService, helperService, appConfig, confirmation, toastr) {
        /* jshint validthis: true */
        var EmailTemplateCtrl = this;

        function Init() {
            EmailTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailTemplate",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": EmailTemplateCtrl.input
            };

            if (EmailTemplateCtrl.input) {
                InitEmailTemplate();
            }
        }

        function InitEmailTemplate() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate = {};
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.Compose = Compose;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.GetUserList = GetUserList;

            InitSideBar();
            InitListView();
            InitReadView();
            InitEditView();

            if (EmailTemplateCtrl.mode == "1") {
                EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "List";
            } else if (EmailTemplateCtrl.mode == "2") {
                Compose();
            }
        }

        function Compose() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "Edit";
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.ModeType = "Compose";
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = {};

            if (EmailTemplateCtrl.mode == "2") {
                EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = angular.copy(EmailTemplateCtrl.type);

                if (EmailTemplateCtrl.type.TemplateObj) {
                    if(EmailTemplateCtrl.type.TemplateObj.Code){
                        OnTemplateChange(EmailTemplateCtrl.type.TemplateObj);
                    }
                }
            }

            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.FROM = authService.getUserInfo().UserId;
        }

        function GetUserList(val){
            var _filter = {
                "Autocompletefield": val
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
            };

            return apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function (response) {
                return response.data.Response;
            });
        }

        // ============================ SideBar Start ============================

        function InitSideBar() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.SideBar = {};
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.SideBar.OnListClick = OnSideBarListClick;

            GetSideBarList();
        }

        function GetSideBarList() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.SideBar.MenuList = [{
                Code: "inbox",
                Desc: "Inbox"
            }, {
                Code: "sent",
                Desc: "Sent"
            }];

            OnSideBarListClick(EmailTemplateCtrl.ePage.Masters.EmailTemplate.SideBar.MenuList[0]);
        }

        function OnSideBarListClick($item) {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.SideBar.ActiveMenu = $item;
        }

        // ============================ SideBar End ============================

        // ============================ List View Start ============================

        function InitListView() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView = {};
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.Refresh = RefreshListView;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.OnListViewClick = OnListViewClick;

            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ToolbarOptions = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['insertImage', 'insertLink']
            ];

            GetEmailList();
        }

        function GetEmailList() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ListSource = undefined;
            var _filter = {
                "EntityRefKey": EmailTemplateCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": EmailTemplateCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": EmailTemplateCtrl.ePage.Entities.EntityRefCode
            };

            if (EmailTemplateCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = EmailTemplateCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = EmailTemplateCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = EmailTemplateCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (EmailTemplateCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = EmailTemplateCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = EmailTemplateCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = EmailTemplateCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ListSource = response.data.Response;
                } else {
                    EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ListSource = [];
                }
            });
        }

        function RefreshListView() {
            GetEmailList();
        }

        function OnListViewClick($item) {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = angular.copy($item);

            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "Read";

            PrepareGroupMapping();
        }

        function PrepareGroupMapping() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ReadView.GroupMapping = undefined;

            $timeout(function () {
                EmailTemplateCtrl.ePage.Masters.EmailTemplate.ReadView.GroupMapping = {
                    "MappingCode": "EXCP_GRUP_APP_TNT",
                    "Item_FK": EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.PK,
                    "ItemCode": EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.Subject,
                    "ItemName": "EXCP",
                    "Title": " Group Access",
                    "AccessTo": {
                        "Type": "GRUP",
                        "API": "eAxisAPI",
                        "APIUrl": "MenuGroups/FindAll",
                        "FilterID": "MENUGRO",
                        "TextField": "GroupName",
                        "ValueField": "PK",
                        "Input": []
                    }
                };
            });
        }

        // ============================ List View End ============================

        // ============================ Read View Start ============================

        function InitReadView() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ReadView = {};
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ReadView.GoToList = GoToList;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ReadView.Reply = Reply;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ReadView.Forward = Forward;
        }

        function GoToList() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "List";
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = undefined;
        }

        function Reply() {
            var _temp = angular.copy(EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail);
            var _input = angular.copy(EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail);
            _input.TO = _temp.FROM;
            _input.FROM = authService.getUserInfo().UserId;

            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = _input;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "Edit";
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.ModeType = "Reply";
        }

        function Forward() {
            var _input = angular.copy(EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail);
            _input.TO = "";
            _input.FROM = authService.getUserInfo().UserId;

            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = _input;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "Edit";
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.ModeType = "Forward";
        }

        // ============================ Read View End ============================

        // ============================ Edit View Start ============================

        function InitEditView() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView = {};
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.Discard = Discard;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.Send = UpdateMail;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.OnTemplateChange = OnTemplateChange;

            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.ModeType = "Compose";

            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.SendBtnText = "Send";
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.IsDisableSendBtn = false;

            GetTemplateList();
        }

        function Discard() {
            if (EmailTemplateCtrl.mode == "1") {
                EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "List";
                EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = undefined;
            } else if (EmailTemplateCtrl.mode == "2") {
                CloseModal();
            }
        }

        function GetTemplateList() {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.TemplateList = [{
                Code: "temp1",
                Desc: "Template 1"
            }, {
                Code: "temp2",
                Desc: "Template 2"
            }, {
                Code: "temp3",
                Desc: "Template 3"
            }, {
                Code: "temp4",
                Desc: "Template 4"
            }
        ];
        }

        function OnTemplateChange($item) {
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.Template = undefined;
            EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.Body = "";

            $timeout(function () {
                if ($item) {
                    EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.Template = $item.Code;
                }
            });
        }

        function UpdateMail() {
            var _input = angular.copy(EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail);

            _input.EntityRefKey = EmailTemplateCtrl.ePage.Entities.EntityRefKey;
            _input.EntitySource = EmailTemplateCtrl.ePage.Entities.EntitySource;
            _input.EntityRefCode = EmailTemplateCtrl.ePage.Entities.EntityRefCode;
            _input.Status = "Sent";
            _input.PK = undefined;
            _input.FROM = authService.getUserInfo().UserId;

            if (EmailTemplateCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.ParentEntityRefKey = EmailTemplateCtrl.ePage.Entities.ParentEntityRefKey;
                _input.ParentEntitySource = EmailTemplateCtrl.ePage.Entities.ParentEntitySource;
                _input.ParentEntityRefCode = EmailTemplateCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (EmailTemplateCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = EmailTemplateCtrl.ePage.Entities.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = EmailTemplateCtrl.ePage.Entities.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = EmailTemplateCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            if (EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.ModeType == "Reply" || EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.ModeType == "Forward") {
                _input.ParentEntityRefKey = EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.PK;
                _input.ParentEntitySource = EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.EntitySource;
                _input.ParentEntityRefCode = EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.EntityRefCode;
            }

            if (_input.TO || _input.CC || _input.BCC) {
                if (_input.Body && _input.Subject) {
                    EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.SendBtnText = "Please Wait...";
                    EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.IsDisableSendBtn = true;

                    apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.Insert.Url, [_input]).then(function (response) {
                        if (response.data.Response) {
                            Send();
                        } else {
                            toastr.error("Update Failed...!");
                        }
                    });
                } else {
                    toastr.warning("Please Enter the Subject and Body...!");
                }
            } else {
                toastr.warning("Please Enter mail Address...!");
            }
        }

        function Send() {
            var _input = angular.copy(EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail);

            _input.FROM = authService.getUserInfo().UserId;
            _input.TO = (_input.TO) ? _input.TO : authService.getUserInfo().UserId;
            _input.TO = (_input.TO.indexOf(",") != -1) ? (_input.TO.split(",")) : [_input.TO];
            if (_input.CC) {
                _input.CC = (_input.CC.indexOf(",") != -1) ? (_input.CC.split(",")) : [_input.CC];
            }
            if (_input.BCC) {
                _input.BCC = (_input.BCC.indexOf(",") != -1) ? (_input.BCC.split(",")) : [_input.BCC];
            }

            apiService.post("alertAPI", appConfig.Entities.NotificationEmail.API.Send.Url, _input).then(function (response) {
                if (response.data == "Success") {
                    toastr.success("Mail Sent Successfully...!");

                    if (EmailTemplateCtrl.mode == "1") {
                        EmailTemplateCtrl.ePage.Masters.EmailTemplate.ViewMode = "List";
                        EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail = undefined;
                    }
                } else {
                    toastr.error("Mail Sent Failed...!");
                }

                EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.SendBtnText = "Send";
                EmailTemplateCtrl.ePage.Masters.EmailTemplate.EditView.IsDisableSendBtn = false;

                if (EmailTemplateCtrl.mode == "1") {
                    GetEmailList();
                } else if (EmailTemplateCtrl.mode == "2") {
                    CloseModal();
                }
            });
        }

        function CloseModal() {
            EmailTemplateCtrl.closeModal();
        }

        // ============================ Edit View End ============================

        Init();
    }
})();
