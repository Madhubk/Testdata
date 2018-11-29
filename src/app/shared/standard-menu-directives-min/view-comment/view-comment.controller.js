(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ViewCommentController", ViewCommentController);

    ViewCommentController.$inject = ["$scope", "$timeout", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "confirmation", "toastr", "$filter"];

    function ViewCommentController($scope, $timeout, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, confirmation, toastr, $filter) {
        /* jshint validthis: true */
        var ViewCommentCtrl = this;

        function Init() {
            ViewCommentCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ViewCommentCtrl.input
            };
            ViewCommentCtrl.ePage.Masters.Comments = {};
            GetCommentsList();
        }

        function GetCommentsList() {
            ViewCommentCtrl.ePage.Masters.Comments.ListSource = undefined;
            var _filter = {
                "EntityRefKey": ViewCommentCtrl.ePage.Entities.EntityRefKey,
                "EntitySource": ViewCommentCtrl.ePage.Entities.EntitySource,
                "EntityRefCode": ViewCommentCtrl.ePage.Entities.EntityRefCode
            };

            if (ViewCommentCtrl.ePage.Entities.ParentEntityRefKey && ViewCommentCtrl.ePage.Entities.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = ViewCommentCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = ViewCommentCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = ViewCommentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (ViewCommentCtrl.ePage.Entities.AdditionalEntityRefKey && ViewCommentCtrl.ePage.Entities.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = ViewCommentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = ViewCommentCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = ViewCommentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    ViewCommentCtrl.ePage.Masters.Comments.ListSource = response.data.Response;
                    ViewCommentCtrl.listSource = ViewCommentCtrl.ePage.Masters.Comments.ListSource;
                } else {
                    ViewCommentCtrl.ePage.Masters.Comments.ListSource = [];
                }
            });
        }
        Init();
    }
})();
