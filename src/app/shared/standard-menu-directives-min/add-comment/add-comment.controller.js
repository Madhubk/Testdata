(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AddCommentController", AddCommentController);

    AddCommentController.$inject = ["$scope", "$timeout", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "confirmation", "toastr"];

    function AddCommentController($scope, $timeout, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, confirmation, toastr) {
        /* jshint validthis: true */
        var AddCommentCtrl = this;

        function Init() {
            AddCommentCtrl.ePage = {
                "Title": "",
                "Prefix": "Add_Comment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": AddCommentCtrl.input
            };


            AddCommentCtrl.ePage.Masters.SaveBtnText = "Add";
            AddCommentCtrl.ePage.Masters.ActiveComment = {};
            AddCommentCtrl.ePage.Masters.ListSource = [];
            GetCommentsFilterList();
            AddCommentCtrl.ePage.Masters.SaveComment = SaveComment;
        }

        function SaveComment() {
            if (AddCommentCtrl.ePage.Masters.ActiveComment.Comments) {
                AddCommentCtrl.ePage.Masters.SaveBtnText = "Please Wait...";
                AddCommentCtrl.ePage.Masters.IsDisableSaveBtn = true;
                AddCommentCtrl.ePage.Masters.IsLoading = true;
                InsertComments();
            } else {
                AddCommentCtrl.ePage.Masters.SaveBtnText = "Add";
                AddCommentCtrl.ePage.Masters.IsDisableSaveBtn = false;
                toastr.warning("Comments should not be empty...!");
            }
        }

        function InsertComments() {
            AddCommentCtrl.ePage.Masters.ActiveComment.CommentsType = AddCommentCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            AddCommentCtrl.ePage.Masters.ActiveComment.Description = AddCommentCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(AddCommentCtrl.ePage.Masters.ActiveComment);

            _input.EntityRefKey = AddCommentCtrl.ePage.Entities.EntityRefKey;
            _input.EntitySource = AddCommentCtrl.ePage.Entities.EntitySource;
            _input.EntityRefCode = AddCommentCtrl.ePage.Entities.EntityRefCode;

            if (AddCommentCtrl.ePage.Entities.ParentEntityRefKey) {
                _input.ParentEntityRefKey = AddCommentCtrl.ePage.Entities.ParentEntityRefKey;
                _input.ParentEntitySource = AddCommentCtrl.ePage.Entities.ParentEntitySource;
                _input.ParentEntityRefCode = AddCommentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (AddCommentCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = AddCommentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = AddCommentCtrl.ePage.Entities.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = AddCommentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    AddCommentCtrl.ePage.Masters.ListSource.push(response.data.Response[0]);
                    AddCommentCtrl.ePage.Masters.IsLoading = false;
                    AddCommentCtrl.ePage.Masters.IsShowRecords = true;
                    toastr.success("Comments added Successfully");
                } else {
                    console.log("Empty comments Response");
                }
                AddCommentCtrl.ePage.Masters.SaveBtnText = "Add";
                AddCommentCtrl.ePage.Masters.IsDisableSaveBtn = false;
                AddCommentCtrl.ePage.Masters.ActiveComment.Comments = "";
            });
        }

        function GetCommentsFilterList() {
            AddCommentCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": AddCommentCtrl.ePage.Entities.Entity
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        AddCommentCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        AddCommentCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;

                        AddCommentCtrl.ePage.Masters.CommentTypeList = "GEN";

                        // OnSideBarListClick(AddCommentCtrl.ePage.Masters.CommentDescriptionList[0]);
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            AddCommentCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    AddCommentCtrl.ePage.Masters.CommentDescriptionList = _list;

                    // OnSideBarListClick(AddCommentCtrl.ePage.Masters.CommentDescriptionList[0]);
                } else {
                    AddCommentCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }


        Init();
    }
})();
