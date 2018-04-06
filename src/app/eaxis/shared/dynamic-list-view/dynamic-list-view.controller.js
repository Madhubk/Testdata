(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicListViewController", DynamicListViewController);

    DynamicListViewController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService"];

    function DynamicListViewController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService) {
        /* jshint validthis: true */
        var DynamicListViewCtrl = this;

        function Init() {
            DynamicListViewCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicPageList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicListViewCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;

            DynamicListViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            DynamicListViewCtrl.ePage.Masters.QueryString = $location.search();
            if (DynamicListViewCtrl.ePage.Masters.QueryString) {
                var _isEmpty = angular.equals({}, DynamicListViewCtrl.ePage.Masters.QueryString);

                if (!_isEmpty) {
                    var _decrypted = helperService.decryptData(DynamicListViewCtrl.ePage.Masters.QueryString.item);

                    if (typeof _decrypted == "string") {
                        _decrypted = JSON.parse(_decrypted);
                    }
                    DynamicListViewCtrl.ePage.Masters.defaultFilter = _decrypted;
                }
            }

            DynamicListViewCtrl.ePage.Masters.dataentryName = $location.path().split("/").pop();
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                var _detailKey = $item.data.entity[$item.data.DataEntryMaster.GridConfig.DetailKey];
                $location.path("/EA/dynamic-details-view/" + DynamicListViewCtrl.ePage.Masters.dataentryName).search({
                    item: helperService.encryptData(_detailKey)
                });
            } else {
                $location.path("/EA/dynamic-details-view/" + DynamicListViewCtrl.ePage.Masters.dataentryName);
            }
        }

        Init();
    }
})();
