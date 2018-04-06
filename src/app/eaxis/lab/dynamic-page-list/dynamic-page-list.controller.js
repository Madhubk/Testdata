(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisDynamicPageListController", EAxisDynamicPageListController);

    EAxisDynamicPageListController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig"];

    function EAxisDynamicPageListController($location, authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var EAxisDynamicPageListCtrl = this;

        function Init() {
            EAxisDynamicPageListCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicPageList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EAxisDynamicPageListCtrl.ePage.Masters.RedirectPage = RedirectPage;

            GetDynamicPageList();
        }

        function GetDynamicPageList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EAxisDynamicPageListCtrl.ePage.Masters.DynamicPageList = response.data.Response;
                } else {
                    EAxisDynamicPageListCtrl.ePage.Masters.DynamicPageList = [];
                }
            });
        }

        function RedirectPage($item) {
            $location.path("EA/dynamic-list-view/" + $item.DataEntryName);
        }

        Init();
    }
})();
