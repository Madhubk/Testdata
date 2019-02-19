(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ViewDocumentOrdController", ViewDocumentOrdController);

    ViewDocumentOrdController.$inject = ["authService", "apiService", "helperService", "appConfig", "$filter"];

    function ViewDocumentOrdController(authService, apiService, helperService, appConfig, $filter) {
        /* jshint validthis: true */
        var ViewDocumentOrdCtrl = this;

        function Init() {
            ViewDocumentOrdCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ViewDocumentOrdCtrl.input
            };
            ViewDocumentOrdCtrl.ePage.Masters.Document = {};
            ViewDocumentOrdCtrl.ePage.Masters.GetDocumentList = GetDocumentList;
            ViewDocumentOrdCtrl.ePage.Masters.Document.DownloadRecord = DownloadRecord;

            GetDocumentList();
        }

        function GetDocumentList() {
            ViewDocumentOrdCtrl.isDocumentUploaded = undefined;
            ViewDocumentOrdCtrl.ePage.Masters.Document.ListSource = undefined;
            var _filter = {
                "Status": "Success",
                // "CommonRefKey": ViewDocumentOrdCtrl.ePage.Entities.EntityRefKey
            };

            if (ViewDocumentOrdCtrl.ePage.Entities.EntityRefKey) {
                _filter.EntityRefKey = ViewDocumentOrdCtrl.ePage.Entities.EntityRefKey;
                _filter.EntitySource = ViewDocumentOrdCtrl.ePage.Entities.EntitySource;
                _filter.EntityRefCode = ViewDocumentOrdCtrl.ePage.Entities.EntityRefCode;
            }

            if (ViewDocumentOrdCtrl.ePage.Entities.ParentEntityRefKey && ViewDocumentOrdCtrl.ePage.Entities.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = ViewDocumentOrdCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = ViewDocumentOrdCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = ViewDocumentOrdCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (ViewDocumentOrdCtrl.ePage.Entities.AdditionalEntityRefKey && ViewDocumentOrdCtrl.ePage.Entities.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = ViewDocumentOrdCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = ViewDocumentOrdCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = ViewDocumentOrdCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    ViewDocumentOrdCtrl.ePage.Masters.Document.ListSource = response.data.Response;
                    ViewDocumentOrdCtrl.ePage.Masters.Document.TempListSource = $filter('filter')(ViewDocumentOrdCtrl.ePage.Masters.Document.ListSource, {
                        ParentEntityRefCode: ViewDocumentOrdCtrl.input.ParentEntityRefCode
                    })
                    ViewDocumentOrdCtrl.ePage.Masters.Document.TempListDocument = [];
                    var count = 0;
                    angular.forEach(ViewDocumentOrdCtrl.ePage.Masters.Document.TempListSource, function (value, key) {
                        // count = count + 1;
                        // if (count < 4) {
                        ViewDocumentOrdCtrl.ePage.Masters.Document.TempListDocument.push(value);
                        // }
                    });
                    // ViewDocumentOrdCtrl.ePage.Masters.RemainingCount = ViewDocumentOrdCtrl.ePage.Masters.Document.ListSource.length - 3;
                    ViewDocumentOrdCtrl.listSource = ViewDocumentOrdCtrl.ePage.Masters.Document.ListSource;
                    ViewDocumentOrdCtrl.ePage.Masters.Document.ListSourceCopy = angular.copy(response.data.Response);

                    if (response.data.Response.length > 0) {
                        ViewDocumentOrdCtrl.ePage.Masters.Document.ListSource.map(function (value, key) {
                            value.DocumentNameTemp = value.DocumentName;
                        });
                    }
                } else {
                    ViewDocumentOrdCtrl.ePage.Masters.Document.ListSource = [];
                }
            });
        }

        function DownloadRecord($item) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + $item.PK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    } else {
                        console.log("No Records Found..!");
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        Init();
    }
})();