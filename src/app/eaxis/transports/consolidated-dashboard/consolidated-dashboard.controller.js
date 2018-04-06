(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolidatedDashboardController", ConsolidatedDashboardController);

    ConsolidatedDashboardController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function ConsolidatedDashboardController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $injector, $window, confirmation) {

        var ConsolidatedDashboardCtrl = this;

        function Init() {

            ConsolidatedDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };

            ConsolidatedDashboardCtrl.ePage.Masters.emptyText = "-";
            ConsolidatedDashboardCtrl.ePage.Masters.GotoReceiveItemsPage = GotoReceiveItemsPage;
        }

        function GotoReceiveItemsPage() {
            var _queryString = {
                PK: null,
                ManifestNumber: null
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/receivelines/" + _queryString, "_blank");
        }

        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "SortColumn": "WUA_Code",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    consolidatedDashboardCtrl.ePage.Masters.SenderDetails = response.data.Response[0];
                    // to get sender is store or DC or depot
                    getSenderType()
                }
            });
        }
        function getSenderType(){
            // get Sender Type thru Findall
            var _filter = {
                "SortColumn": "ORG_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGHEAD"
            };
            apiService.post("eAxisAPI", "OrgHeader/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    consolidatedDashboardCtrl.ePage.Masters.SenderTypeDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }

})();