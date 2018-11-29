(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ViewDocumentController", ViewDocumentController);

    ViewDocumentController.$inject = ["$scope", "$timeout", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "confirmation", "toastr", "$filter"];

    function ViewDocumentController($scope, $timeout, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, confirmation, toastr, $filter) {
        /* jshint validthis: true */
        var ViewDocumentCtrl = this;

        function Init() {
            ViewDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ViewDocumentCtrl.input
            };
            ViewDocumentCtrl.ePage.Masters.Document = {};
            ViewDocumentCtrl.ePage.Masters.GetDocumentList = GetDocumentList;
            GetDocumentList();
        }

        function GetDocumentList() {
            ViewDocumentCtrl.ePage.Masters.Document.ListSource = undefined;
            var _filter = {
                "Status": "Success",
                // "CommonRefKey": ViewDocumentCtrl.ePage.Entities.EntityRefKey
            };

            if (ViewDocumentCtrl.ePage.Entities.EntityRefKey) {
                _filter.EntityRefKey = ViewDocumentCtrl.ePage.Entities.EntityRefKey;
                _filter.EntitySource = ViewDocumentCtrl.ePage.Entities.EntitySource;
                _filter.EntityRefCode = ViewDocumentCtrl.ePage.Entities.EntityRefCode;
            }

            if (ViewDocumentCtrl.ePage.Entities.ParentEntityRefKey && ViewDocumentCtrl.ePage.Entities.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = ViewDocumentCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = ViewDocumentCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = ViewDocumentCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (ViewDocumentCtrl.ePage.Entities.AdditionalEntityRefKey && ViewDocumentCtrl.ePage.Entities.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = ViewDocumentCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = ViewDocumentCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = ViewDocumentCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    ViewDocumentCtrl.ePage.Masters.Document.ListSource = response.data.Response;
                    ViewDocumentCtrl.ePage.Masters.Document.TempListSource = $filter('filter')(ViewDocumentCtrl.ePage.Masters.Document.ListSource, { ParentEntityRefCode: ViewDocumentCtrl.input.ParentEntityRefCode })
                    ViewDocumentCtrl.ePage.Masters.Document.TempListDocument = [];
                    var count = 0;
                    angular.forEach(ViewDocumentCtrl.ePage.Masters.Document.TempListSource, function (value, key) {
                        count = count + 1;
                        if (count < 4) {
                            ViewDocumentCtrl.ePage.Masters.Document.TempListDocument.push(value);
                        }
                    });
                    ViewDocumentCtrl.ePage.Masters.RemainingCount = ViewDocumentCtrl.ePage.Masters.Document.ListSource.length - 3;
                    ViewDocumentCtrl.listSource = ViewDocumentCtrl.ePage.Masters.Document.ListSource;
                    ViewDocumentCtrl.ePage.Masters.Document.ListSourceCopy = angular.copy(response.data.Response);

                    if (response.data.Response.length > 0) {
                        ViewDocumentCtrl.ePage.Masters.Document.ListSource.map(function (value, key) {
                            value.DocumentNameTemp = value.DocumentName;
                        });
                    }
                } else {
                    ViewDocumentCtrl.ePage.Masters.Document.ListSource = [];
                }
            });
        }


        Init();
    }
})();
