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
            InitSideBar();

            if (CommentCtrl.mode == "1") {
                GetCommentsFilterList();
            }
        }

        function GetCommentsFilterList() {
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
                        var _response = response.data.Response[0];
                        if (!_response.Value) {
                            _response.Value = "General";
                        }
                        GetCommentsDescription(_response.Value);
                    }else{
                        GetCommentsDescription("General");
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            var _filter = {
                TypeCode: "COMT_DESC",
                Key: $item
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    var _obj = {
                        Description: "All",
                        Value: "All"
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
                CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.Description = $item.Key;
                if (CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.Value != $item.Value) {
                    OnSideBarListClick($item);
                }
            } else {
                CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.Description = CommentCtrl.type;
            }
        }

        // ============================ SideBar Start ============================

        function InitSideBar() {
            CommentCtrl.ePage.Masters.Comments.SideBar = {};
            CommentCtrl.ePage.Masters.Comments.SideBar.OnListClick = OnSideBarListClick;
        }

        function OnSideBarListClick($item) {
            CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu = $item;

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

            if (CommentCtrl.mode == "2") {
                _filter.Description = CommentCtrl.type;
            } else {
                if (CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu) {
                    _filter.Description = CommentCtrl.ePage.Masters.Comments.SideBar.ActiveMenu.Key;
                }
            }

            if (CommentCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = CommentCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = CommentCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = CommentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (CommentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = CommentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = CommentCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = CommentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CommentCtrl.ePage.Masters.Comments.ListView.ListSource = response.data.Response;
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
            }else{
                CommentCtrl.ePage.Masters.Comments.ViewMode = "Read";
            }
        }

        function PrepareGroupMapping() {
            CommentCtrl.ePage.Masters.Comments.ReadView.GroupMapping = undefined;

            $timeout(function () {
                CommentCtrl.ePage.Masters.Comments.ReadView.GroupMapping = {
                    "MappingCode": "COMT_GRUP_APP_TNT",
                    "Item_FK": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.PK,
                    "ItemCode": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.Description,
                    "ItemName": "GRUP",
                    "Title": " Group Access",
                    "AccessTo": {
                        "Type": "COMMENT",
                        "API": "authAPI",
                        "APIUrl": "SecMappings/FindAll",
                        "FilterID": "SECMAPP",
                        "TextField": "ItemCode",
                        "ValueField": "Item_FK",
                        "Input": [{
                            "FieldName": "AccessCode",
                            "Value": CommentCtrl.ePage.Masters.Comments.ListView.ActiveComment.Description
                        }, {
                            "FieldName": "MappingCode",
                            "Value": "GRUP_CTYP_APP_TNT"
                        }, {
                            "FieldName": "AppCode",
                            "Value": authService.getUserInfo().AppCode
                        }, {
                            "FieldName": "TenantCode",
                            "Value": authService.getUserInfo().TenantCode
                        }]
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
            _input.CommentsType = "PUB";

            if (CommentCtrl.mode == "2") {
                _input.Description = CommentCtrl.type;
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
