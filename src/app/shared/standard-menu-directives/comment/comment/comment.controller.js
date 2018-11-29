(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CommentController", CommentController);

    CommentController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "toastr"];

    function CommentController($timeout, authService, apiService, helperService, appConfig, toastr) {
        /* jshint validthis: true */
        var CommentCtrl = this;

        function Init() {
            CommentCtrl.ePage = {
                "Title": "",
                "Prefix": "Comment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": CommentCtrl.input
            };

            (CommentCtrl.config) ? CommentCtrl.Config = CommentCtrl.config: CommentCtrl.Config = {};

            if (CommentCtrl.ePage.Entities) {
                InitComments();
            }

           
        }

        function InitComments() {
            CommentCtrl.ePage.Masters.Comments = {};

            CommentCtrl.ePage.Masters.Comments.UserId = authService.getUserInfo().UserId;
            CommentCtrl.ePage.Masters.Comments.ViewMode = "List";
            CommentCtrl.ePage.Masters.Comments.Compose = Compose;

            InitListView();
            InitReadView();
            InitEditView();

            if (CommentCtrl.mode != "2") {
                InitSideBar();
                GetCommentsFilterList();
            }
        }

        function GetCommentsFilterList() {
            CommentCtrl.ePage.Masters.Comments.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": CommentCtrl.ePage.Entities.Entity
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        CommentCtrl.ePage.Masters.Comments.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "ALL",
                            Value: "All",
                            Key: "All"
                        }, {
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        CommentCtrl.ePage.Masters.Comments.CommentDescriptionList = _commentTypeList;

                        CommentCtrl.ePage.Masters.Comments.CommentTypeList = "GEN";

                        OnSideBarListClick(CommentCtrl.ePage.Masters.Comments.CommentDescriptionList[0]);
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            CommentCtrl.ePage.Masters.Comments.CommentDescriptionList = undefined;
            var _filter = {
                TypeCode: $item,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstCommentType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstCommentType.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    if (!_list) {
                        _list = [];
                    }

                    var _obj = {
                        TypeCode: "ALL",
                        Value: "All",
                        Key: "All"
                    };

                    _list.push(_obj);
                    _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

                    CommentCtrl.ePage.Masters.Comments.CommentDescriptionList = _list;

                    OnSideBarListClick(CommentCtrl.ePage.Masters.Comments.CommentDescriptionList[0]);
                } else {
                    CommentCtrl.ePage.Masters.Comments.CommentDescriptionList = [];
                }
            });
        }

        function Compose($item) {
            CommentCtrl.ePage.Masters.Comments.ViewMode = "Edit";
            CommentCtrl.ePage.Masters.Comments.EditView.ModeType = "Compose";

            CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment = {};

            if ($item) {
                CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.CommentsType = $item.TypeCode;
                CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.Description = $item.Value;
                if (CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.Value != $item.Value) {
                    OnSideBarListClick($item);
                }
            } else {
                CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.CommentsType = CommentCtrl.type.CommentsType;
                CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.Description = CommentCtrl.type.Value;
            }
        }

        // ============================ SideBar Start ============================

        function InitSideBar() {
            CommentCtrl.ePage.Masters.Comments.SideBar = {};
            CommentCtrl.ePage.Masters.Comments.SideBar.OnListClick = OnSideBarListClick;
        }

        function OnSideBarListClick($item) {
            CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu = angular.copy($item);

            GetCommentsList();
        }

        // ============================ SideBar End ============================

        // ============================ List View Start ============================

        function InitListView() {
            CommentCtrl.ePage.Masters.Comments.ListView = {};
            CommentCtrl.ePage.Masters.Comments.ListView.Refresh = RefreshListView;
            CommentCtrl.ePage.Masters.Comments.ListView.OnListViewClick = OnListViewClick;

            if (CommentCtrl.mode == "2") {
                GetCommentsList();
            }
        }

        function GetCommentsList() {
            CommentCtrl.ePage.Masters.Comments.ListView.ListSource = undefined;
            var _filter = {
                "EntityRefKey": CommentCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": CommentCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": CommentCtrl.ePage.Entities.EntityRefCode
            };

            if (CommentCtrl.mode == "1") {
                if (CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu) {
                    if (CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.TypeCode != "ALL") {
                        _filter.CommentsType = CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.TypeCode;
                    }
                }
            } else if (CommentCtrl.mode == "2") {
                _filter.CommentsType = CommentCtrl.type.CommentsType;
            } else if (CommentCtrl.mode == "3") {
                if (CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu) {
                    if (CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.TypeCode == "ALL") {
                        _filter.CommentsType = CommentCtrl.ePage.Masters.Comments.CommentTypeList;
                    } else {
                        _filter.CommentsType = CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.TypeCode;
                    }
                }
            }

            if (CommentCtrl.ePage.Entities.ParentEntityRefKey && CommentCtrl.ePage.Entities.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = CommentCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = CommentCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = CommentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (CommentCtrl.ePage.Entities.AdditionalEntityRefKey && CommentCtrl.ePage.Entities.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = CommentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = CommentCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = CommentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    CommentCtrl.ePage.Masters.Comments.ListView.ListSource = response.data.Response;
                    CommentCtrl.listSource = CommentCtrl.ePage.Masters.Comments.ListView.ListSource;
                } else {
                    CommentCtrl.ePage.Masters.Comments.ListView.ListSource = [];
                }
            });
        }

        function RefreshListView() {
            GetCommentsList();
        }

        function OnListViewClick($item) {
            CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment = angular.copy($item);
            if (CommentCtrl.mode == "1") {
                PrepareGroupMapping();
            } else {
                CommentCtrl.ePage.Masters.Comments.ViewMode = "Read";
            }
        }

        function PrepareGroupMapping() {
            CommentCtrl.ePage.Masters.Comments.ReadView.GroupMapping = undefined;

            $timeout(function () {
                CommentCtrl.ePage.Masters.Comments.ReadView.GroupMapping = {
                    "MappingCode": "CMNT_GRUP_APP_TNT",
                    "Item_FK": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.PK,
                    "ItemCode": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.CommentsType,
                    "ItemName": "GRUP",
                    "Title": " Group Access",
                    "MappingAPI": {
                        "API":"eAxisAPI",
                        "FilterID":"JOCOAC",
                        "FindAll":appConfig.Entities.JobCommentsAccess.API.FindAll.Url,
                        "Insert":appConfig.Entities.JobCommentsAccess.API.Insert.Url,
                        "Update":appConfig.Entities.JobCommentsAccess.API.Update.Url,
                        "Delete":appConfig.Entities.JobCommentsAccess.API.Delete.Url
                    },
                    "AccessTo": {
                        "Type": "COMMENT",
                        "API": "eAxisAPI",
                        "APIUrl": "JobComments/CommentsTypeAccess",
                        "TextField": "ItemCode",
                        "ValueField": "Item_FK",
                        "Input": {
                            "PartyTypeCode": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.PartyType_Code,
                            "PartyTypeRefKey": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.PartyType_FK,
                            "StandardType": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.CommentsType,
                            "ParentRefKey": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.EntityRefKey,
                            "ParentRefCode":CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.EntityRefCode,
                            "ParentSource":CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.EntitySource,
                            "MappingCode": "GRUP_CTYP_APP_TNT",
                            "IsroleInclude":"True"
                        }
                    }
                };

                CommentCtrl.ePage.Masters.Comments.ViewMode = "Read";
            });
        }

        // ============================ List View End ============================

        // ============================ Read View Start ============================

        function InitReadView() {
            CommentCtrl.ePage.Masters.Comments.ReadView = {};
            CommentCtrl.ePage.Masters.Comments.ReadView.GoToList = GoToList;
            CommentCtrl.ePage.Masters.Comments.ReadView.Reply = Reply;
        }

        function GoToList() {
            CommentCtrl.ePage.Masters.Comments.ViewMode = "List";
            CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment = undefined;
        }

        function Reply() {
            var _temp = angular.copy(CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment);
            var _input = angular.copy(CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment);
            _input.TO = _temp.FROM;
            _input.FROM = authService.getUserInfo().UserId;

            CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment = _input;
            CommentCtrl.ePage.Masters.Comments.ViewMode = "Edit";
            CommentCtrl.ePage.Masters.Comments.EditView.ModeType = "Reply";
        }

        // ============================ Read View End ============================

        // ============================ Edit View Start ============================

        function InitEditView() {
            CommentCtrl.ePage.Masters.Comments.EditView = {};
            CommentCtrl.ePage.Masters.Comments.EditView.Discard = Discard;
            CommentCtrl.ePage.Masters.Comments.EditView.Save = SaveComment;

            CommentCtrl.ePage.Masters.Comments.EditView.ModeType = "Compose";

            CommentCtrl.ePage.Masters.Comments.EditView.SaveBtnText = "Save";
            CommentCtrl.ePage.Masters.Comments.EditView.IsDisableSaveBtn = false;
        }

        function SaveComment() {
            if (CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.Comments) {
                CommentCtrl.ePage.Masters.Comments.EditView.SaveBtnText = "Please Wait...";
                CommentCtrl.ePage.Masters.Comments.EditView.IsDisableSaveBtn = true;

                InsertComments();
            } else {
                toastr.warning("Comments should not be empty...!");
            }
        }

        function InsertComments() {
            var _input = angular.copy(CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment);
            _input.EntityRefKey = CommentCtrl.ePage.Entities.EntityRefKey;
            _input.EntitySource = CommentCtrl.ePage.Entities.EntitySource;
            _input.EntityRefCode = CommentCtrl.ePage.Entities.EntityRefCode;

            if (CommentCtrl.mode != "2") {
                _input.PartyType_FK = CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.PartyType_FK;
                _input.PartyType_Code = CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.PartyType_Code;
                _input.CommentsType = CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.TypeCode;
                _input.Description = CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.Value;
            }

            if (CommentCtrl.mode == "2") {
                _input.Description = CommentCtrl.input.Description;
                _input.PartyType_FK = CommentCtrl.input.PartyType_FK;
                _input.PartyType_Code = CommentCtrl.input.PartyType_Code;
                _input.CommentsType = CommentCtrl.input.CommentsType;
                _input.Description = CommentCtrl.input.Value;
            }

            if (CommentCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.ParentEntityRefKey = CommentCtrl.ePage.Entities.ParentEntityRefKey;
                _input.ParentEntitySource = CommentCtrl.ePage.Entities.ParentEntitySource;
                _input.ParentEntityRefCode = CommentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (CommentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = CommentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = CommentCtrl.ePage.Entities.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = CommentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    CommentCtrl.ePage.Masters.Comments.ListView.ListSource.push(response.data.Response[0]);
                } else {
                    console.log("Empty comments Response");
                }

                CommentCtrl.ePage.Masters.Comments.EditView.SaveBtnText = "Save";
                CommentCtrl.ePage.Masters.Comments.EditView.IsDisableSaveBtn = false;
                Discard();
            });
        }

        function Discard() {
            CommentCtrl.ePage.Masters.Comments.ViewMode = "List";
            CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment = undefined;
        }

        // ============================ Edit View End ============================

        Init();
    }
})();
