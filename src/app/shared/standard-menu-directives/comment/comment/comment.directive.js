(function () {
    "use strict";

    angular
        .module("Application")
        .directive("comment", Comment);

    function Comment() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/comment/comment/comment.html",
            controller: 'CommentController',
            controllerAs: 'CommentCtrl',
            bindToController: true,
            scope: {
                input: "=",
                config: "=",
                mode: "=",
                type: "=",
                closeModal: "&",
                listSource: "=?"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("CommentController", CommentController);

    CommentController.$inject = ["authService", "apiService", "helperService", "appConfig", "toastr"];

    function CommentController(authService, apiService, helperService, appConfig, toastr) {
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

            InitComments();
        }

        function InitComments() {
            CommentCtrl.ePage.Masters.Comments = {};

            CommentCtrl.ePage.Masters.Comments.UserId = authService.getUserInfo().UserId;

            CommentCtrl.ePage.Masters.Comments.OnCommentTypeChange = OnCommentTypeChange;
            CommentCtrl.ePage.Masters.Comments.Compose = Compose;
            CommentCtrl.ePage.Masters.Comments.Refresh = Refresh;
            CommentCtrl.ePage.Masters.Comments.Discard = Discard;
            CommentCtrl.ePage.Masters.Comments.Save = Save;

            CommentCtrl.ePage.Masters.Comments.IsShowCommentSection = false;
            CommentCtrl.ePage.Masters.Comments.SaveBtnText = "Save";
            CommentCtrl.ePage.Masters.Comments.IsDisableSaveBtn = false;

            CheckMode();
        }

        function CheckMode() {
            if (CommentCtrl.mode == "2" && CommentCtrl.input.CommentsType) {
                let _type = CommentCtrl.input.CommentsType,
                    _index = _type.indexOf(","),
                    _typeList = [];

                if (_index != -1) {
                    let _split = _type.split(",");
                    _split.map(x => {
                        let _obj = {
                            TypeCode: x,
                            Value: x,
                            Key: x,
                            PartyType_FK: CommentCtrl.input.PartyType_FK,
                            PartyType_Code: CommentCtrl.input.PartyType_Code
                        };
                        _typeList.push(_obj);
                    });
                } else {
                    let _obj = {
                        TypeCode: _type,
                        Value: _type,
                        Key: _type,
                        PartyType_FK: CommentCtrl.input.PartyType_FK,
                        PartyType_Code: CommentCtrl.input.PartyType_Code
                    };
                    _typeList.push(_obj);
                }

                CommentCtrl.ePage.Masters.Comments.CommentTypeList = _typeList;
                OnCommentTypeChange(CommentCtrl.ePage.Masters.Comments.CommentTypeList[0]);
            } else if (CommentCtrl.mode != "2") {
                GetCommentTypeConfiguration();
            }
        }

        function GetCommentTypeConfiguration() {
            let _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": CommentCtrl.ePage.Entities.Entity
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _type = response.data.Response[0].Value;
                    CommentCtrl.ePage.Masters.Comments.CommentTypeConfigValue = _type;
                    if (_type) {
                        GetCommentTypeList();
                    }
                } else {
                    let _type = "GEN";
                    CommentCtrl.ePage.Masters.Comments.CommentTypeConfigValue = _type;
                    GetCommentTypeList();
                }
            });
        }

        function GetCommentTypeList() {
            CommentCtrl.ePage.Masters.Comments.CommentTypeList = undefined;
            let _filter = {
                TypeCode: CommentCtrl.ePage.Masters.Comments.CommentTypeConfigValue,
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstCommentType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstCommentType.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    let _list = response.data.Response ? response.data.Response : [];
                    let _all = [{
                        TypeCode: "ALL",
                        Value: "All",
                        Key: "All"
                    }];

                    _list = [..._all, ..._list];
                    CommentCtrl.ePage.Masters.Comments.CommentTypeList = _list;

                    OnCommentTypeChange(CommentCtrl.ePage.Masters.Comments.CommentTypeList[0]);
                } else {
                    CommentCtrl.ePage.Masters.Comments.CommentTypeList = [];
                    CommentCtrl.ePage.Masters.Comments.ListSource = [];
                }
            });
        }

        function OnCommentTypeChange($item) {
            CommentCtrl.ePage.Masters.Comments.ActiveCommentType = angular.copy($item);

            GetCommentList();
        }

        function GetCommentList() {
            CommentCtrl.ePage.Masters.Comments.ListSource = undefined;
            let _filter = {
                EntityRefKey: CommentCtrl.ePage.Entities.EntityRefKey,
            };

            if (CommentCtrl.mode == "2") {
                _filter.CommentsType = CommentCtrl.input.CommentsType;
            } else {
                _filter.CommentsType = (CommentCtrl.ePage.Masters.Comments.ActiveCommentType.TypeCode == "ALL") ? CommentCtrl.ePage.Masters.Comments.CommentTypeConfigValue :
                    CommentCtrl.ePage.Masters.Comments.ActiveCommentType.TypeCode;
            }

            if (CommentCtrl.ePage.Entities.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = CommentCtrl.ePage.Entities.ParentEntityRefKey;
            }
            if (CommentCtrl.ePage.Entities.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = CommentCtrl.ePage.Entities.AdditionalEntityRefKey;
            }

            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    CommentCtrl.ePage.Masters.Comments.ListSource = response.data.Response;

                    if (CommentCtrl.ePage.Masters.Comments.ListSource.length > 0) {
                        CommentCtrl.ePage.Masters.Comments.ListSource.map(x => x.GroupMapping = PrepareAccessInput(x));
                    }
                } else {
                    CommentCtrl.ePage.Masters.Comments.ListSource = [];
                }
            });
        }

        function PrepareAccessInput($item) {
            return {
                "Item": $item,
                "MappingCode": "CMNT_GRUP_APP_TNT",
                "Item_FK": $item.PK,
                "ItemCode": $item.CommentsType,
                "ItemName": "GRUP",
                "Title": " Group Access",
                "MappingAPI": {
                    "API": "eAxisAPI",
                    "FilterID": "JOCOAC",
                    "FindAll": appConfig.Entities.JobCommentsAccess.API.FindAll.Url,
                    "Insert": appConfig.Entities.JobCommentsAccess.API.Insert.Url,
                    "Update": appConfig.Entities.JobCommentsAccess.API.Update.Url,
                    "Delete": appConfig.Entities.JobCommentsAccess.API.Delete.Url
                },
                "AccessTo": {
                    "Type": "COMMENT",
                    "API": "eAxisAPI",
                    "APIUrl": "JobComments/CommentsTypeAccess",
                    "TextField": "ItemCode",
                    "ValueField": "Item_FK",
                    "Input": {
                        "PartyTypeCode": $item.PartyType_Code,
                        "PartyTypeRefKey": $item.PartyType_FK,
                        "StandardType": $item.CommentsType,
                        "ParentRefKey": $item.EntityRefKey,
                        "ParentRefCode": $item.EntityRefCode,
                        "ParentSource": $item.EntitySource,
                        "MappingCode": "GRUP_CTYP_APP_TNT",
                        "IsroleInclude": "True"
                    }
                }
            };
        }

        function Refresh() {
            GetCommentList();
        }

        function Compose() {
            CommentCtrl.ePage.Masters.Comments.IsShowCommentSection = true;
            CommentCtrl.ePage.Masters.Comments.ActiveComment = {};
        }

        function Discard() {
            CommentCtrl.ePage.Masters.Comments.IsShowCommentSection = false;
        }

        function Save() {
            if (CommentCtrl.ePage.Masters.Comments.ActiveComment.Comments) {
                CommentCtrl.ePage.Masters.Comments.SaveBtnText = "Please wait...";
                CommentCtrl.ePage.Masters.Comments.IsDisableSaveBtn = true;

                let _input = CommentCtrl.ePage.Masters.Comments.ActiveComment;
                _input.CommentsType = CommentCtrl.ePage.Masters.Comments.ActiveCommentType.TypeCode;
                _input.Description = CommentCtrl.ePage.Masters.Comments.ActiveCommentType.Value;
                _input.PartyType_FK = CommentCtrl.ePage.Masters.Comments.ActiveCommentType.PartyType_FK;
                _input.PartyType_Code = CommentCtrl.ePage.Masters.Comments.ActiveCommentType.PartyType_Code;

                _input.EntityRefKey = CommentCtrl.ePage.Entities.EntityRefKey;
                _input.EntitySource = CommentCtrl.ePage.Entities.EntitySource;
                _input.EntityRefCode = CommentCtrl.ePage.Entities.EntityRefCode;
                _input.ParentEntityRefKey = CommentCtrl.ePage.Entities.ParentEntityRefKey;
                _input.ParentEntitySource = CommentCtrl.ePage.Entities.ParentEntitySource;
                _input.ParentEntityRefCode = CommentCtrl.ePage.Entities.ParentEntityRefCode;
                _input.AdditionalEntityRefKey = CommentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = CommentCtrl.ePage.Entities.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = CommentCtrl.ePage.Entities.AdditionalEntityRefCode;

                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(response => {
                    if (response.data.Response && response.data.Response.length > 0) {
                        let _response = response.data.Response[0];
                        _response.GroupMapping = PrepareAccessInput(_response);

                        CommentCtrl.ePage.Masters.Comments.ListSource = [...[_response], ...CommentCtrl.ePage.Masters.Comments.ListSource];
                    } else {
                        toastr.error("Failed to Save...!");
                    }

                    CommentCtrl.ePage.Masters.Comments.SaveBtnText = "Save";
                    CommentCtrl.ePage.Masters.Comments.IsDisableSaveBtn = false;

                    Discard();
                });
            } else {
                toastr.warning("Comment should not be empty...!");
            }
        }

        Init();
    }
})();
