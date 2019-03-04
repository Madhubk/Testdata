(function () {
    "use strict";

    angular
        .module("Application")
        .directive("keyword", Keyword);

    function Keyword() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/keyword/keyword/keyword.html",
            controller: 'KeywordController',
            controllerAs: 'KeywordCtrl',
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
        .controller("KeywordController", KeywordController);

    KeywordController.$inject = ["apiService", "authService", "helperService", "appConfig", "toastr", "confirmation"];

    function KeywordController(apiService, authService, helperService, appConfig, toastr, confirmation) {
        /* jshint validthis: true */
        let KeywordCtrl = this;

        function Init() {
            KeywordCtrl.ePage = {
                "Title": "",
                "Prefix": "Keyword",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": KeywordCtrl.input
            };

            InitKeywords();
        }

        function InitKeywords() {
            KeywordCtrl.ePage.Masters.Keywords = {};

            KeywordCtrl.ePage.Masters.Keywords.Refresh = Refresh;
            KeywordCtrl.ePage.Masters.Keywords.AddNewKeyword = AddNewKeyword;
            KeywordCtrl.ePage.Masters.Keywords.DeleteKeyword = DeleteConfirmation;

            KeywordCtrl.ePage.Masters.Keywords.AddBtnText = "Add";
            KeywordCtrl.ePage.Masters.Keywords.IsDisableAddBtn = false;

            if (KeywordCtrl.ePage.Entities) {
                GetKeywordList();
            }
        }

        function GetKeywordList() {
            KeywordCtrl.ePage.Masters.Keywords.ListSource = undefined;
            let _filter = {
                EntityRefKey: KeywordCtrl.ePage.Entities.EntityRefKey,
                ParentEntityRefKey: KeywordCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntityRefKey: KeywordCtrl.ePage.Entities.AdditionalEntityRefKey
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataFullTextSearch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataFullTextSearch.API.FindAll.Url, _input).then(response => {
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

                let _input = {
                    NewValue: KeywordCtrl.ePage.Masters.Keywords.Keyword,
                    EntityRefKey: KeywordCtrl.ePage.Entities.EntityRefKey,
                    EntitySource: KeywordCtrl.ePage.Entities.EntitySource,
                    EntityRefCode: KeywordCtrl.ePage.Entities.EntityRefCode,
                    ParentEntityRefKey: KeywordCtrl.ePage.Entities.ParentEntityRefKey,
                    ParentEntitySource: KeywordCtrl.ePage.Entities.ParentEntitySourc,
                    ParentEntityRefCode: KeywordCtrl.ePage.Entities.ParentEntityRefCode,
                    AdditionalEntityRefKey: KeywordCtrl.ePage.Entities.AdditionalEntityRefKey,
                    AdditionalEntitySource: KeywordCtrl.ePage.Entities.AdditionalEntitySource,
                    AdditionalEntityRefCode: KeywordCtrl.ePage.Entities.AdditionalEntityRefCode,
                    AppCode: authService.getUserInfo().AppCode,
                    SAP_FK: authService.getUserInfo().AppPK,
                    ClassSource: KeywordCtrl.ePage.Entities.EntitySource,
                    FieldName: "UserKeyword",
                    UIField: "UserKeyword",
                    Actions: "I",
                    IsModified: true
                };

                apiService.post("eAxisAPI", appConfig.Entities.DataFullTextSearch.API.Insert.Url, [_input]).then(response => {
                    if (response.data.Response && response.data.Response.length > 0) {
                        KeywordCtrl.ePage.Masters.Keywords.ListSource.push(response.data.Response[0]);
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

        function DeleteConfirmation($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => DeleteKeyword($item, $index), () => {});
        }

        function DeleteKeyword($item, $index) {
            apiService.get("eAxisAPI", appConfig.Entities.DataFullTextSearch.API.Delete.Url + $item.PK).then(response => {
                if (response.data.Response) {
                    KeywordCtrl.ePage.Masters.Keywords.ListSource.splice($index, 1);
                } else {
                    toastr.error("Could not Add...!");
                }
            });
        }

        Init();
    }
})();
