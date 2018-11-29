(function () {
    "use strict";

    angular
        .module("Application")
        .controller("KeywordController", KeywordController);

    KeywordController.$inject = ["apiService", "authService", "helperService", "appConfig", "toastr"];

    function KeywordController(apiService, authService, helperService, appConfig, toastr) {
        /* jshint validthis: true */
        var KeywordCtrl = this;

        function Init() {
            KeywordCtrl.ePage = {
                "Title": "",
                "Prefix": "Keyword",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": KeywordCtrl.input
            };

            if (KeywordCtrl.ePage.Entities) {
                InitKeywords();
            }
        }

        function InitKeywords() {
            KeywordCtrl.ePage.Masters.Keywords = {};

            KeywordCtrl.ePage.Masters.Keywords.Refresh = Refresh;
            KeywordCtrl.ePage.Masters.Keywords.AddNewKeyword = AddNewKeyword;
            KeywordCtrl.ePage.Masters.Keywords.DeleteKeyword = DeleteKeyword;

            KeywordCtrl.ePage.Masters.Keywords.AddBtnText = "Add";
            KeywordCtrl.ePage.Masters.Keywords.IsDisableAddBtn = false;

            GetKeywordList();
        }

        function GetKeywordList() {
            KeywordCtrl.ePage.Masters.Keywords.ListSource = undefined;
            var _filter = {
                "EntityRefKey": KeywordCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": KeywordCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": KeywordCtrl.ePage.Entities.EntityRefCode
            };

            if (KeywordCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = KeywordCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = KeywordCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = KeywordCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (KeywordCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = KeywordCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = KeywordCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = KeywordCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataFullTextSearch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataFullTextSearch.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    KeywordCtrl.ePage.Masters.Keywords.ListSource = response.data.Response;
                } else {
                    KeywordCtrl.ePage.Masters.Keywords.ListSource = [];
                }
            });
        }

        function Refresh() {
            GetKeywordList()
        }

        function AddNewKeyword() {
            if (KeywordCtrl.ePage.Masters.Keywords.Keyword) {
                KeywordCtrl.ePage.Masters.Keywords.AddBtnText = "Please Wait...";
                KeywordCtrl.ePage.Masters.Keywords.IsDisableAddBtn = true;

                var _input = {
                    NewValue: KeywordCtrl.ePage.Masters.Keywords.Keyword,
                    EntityRefKey: KeywordCtrl.ePage.Entities.EntityRefKey,
                    EntitySource: KeywordCtrl.ePage.Entities.EntitySource,
                    EntityRefCode: KeywordCtrl.ePage.Entities.EntityRefCode,
                    AppCode: authService.getUserInfo().AppCode,
                    SAP_FK: authService.getUserInfo().AppPK,
                    ClassSource: KeywordCtrl.ePage.Entities.EntitySource,
                    FieldName: "UserKeyword",
                    UIField: "UserKeyword",
                    Actions: "I",
                    IsModified: true
                }

                if (KeywordCtrl.ePage.Entities.ParentEntityRefKey) {
                    _input.ParentEntityRefKey = KeywordCtrl.ePage.Entities.ParentEntityRefKey;
                    _input.ParentEntitySource = KeywordCtrl.ePage.Entities.ParentEntitySource;
                    _input.ParentEntityRefCode = KeywordCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (KeywordCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    _input.AdditionalEntityRefKey = KeywordCtrl.ePage.Entities.AdditionalEntityRefKey;
                    _input.AdditionalEntitySource = KeywordCtrl.ePage.Entities.AdditionalEntitySource;
                    _input.AdditionalEntityRefCode = KeywordCtrl.ePage.Entities.AdditionalEntityRefCode;
                }

                apiService.post("eAxisAPI", appConfig.Entities.DataFullTextSearch.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            KeywordCtrl.ePage.Masters.Keywords.ListSource.push(response.data.Response[0]);
                        }
                    } else {
                        toastr.error("Could not Add...!");
                    }

                    KeywordCtrl.ePage.Masters.Keywords.AddBtnText = "Add";
                    KeywordCtrl.ePage.Masters.Keywords.IsDisableAddBtn = false;
                    KeywordCtrl.ePage.Masters.Keywords.Keyword = undefined;
                });
            } else {
                toastr.warning("Keyword Should not be Empy...!");
            }
        }

        function DeleteKeyword($item, $index) {
            if ($item) {
                var _input = $item;
                _input.IsModified = true;
                _input.IsDeleted = true;

                apiService.post("eAxisAPI", appConfig.Entities.DataFullTextSearch.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        KeywordCtrl.ePage.Masters.Keywords.ListSource.splice($index, 1);
                    } else {
                        toastr.error("Could not Add...!");
                    }
                });
            }
        }

        Init();
    }
})();
