(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisDynamicPageListController", EAxisDynamicPageListController);

    EAxisDynamicPageListController.$inject = ["$location", "authService", "apiService", "helperService", "labConfig"];

    function EAxisDynamicPageListController($location, authService, apiService, helperService, labConfig) {
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
            let _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": labConfig.Entities.DataEntryMaster.API.FindAllColumn.FilterID
            };

            apiService.post("eAxisAPI", labConfig.Entities.DataEntryMaster.API.FindAllColumn.Url, _input).then(response => EAxisDynamicPageListCtrl.ePage.Masters.DynamicPageList = response.data.Response ? response.data.Response : []);
        }

        function RedirectPage($item) {
            $location.path("EA/dynamic-list-view/" + $item.DataEntryName);
        }

        Init();
    }
})();
