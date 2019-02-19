(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FreightDashboardController", FreightDashboardController);

    FreightDashboardController.$inject = ["helperService", "authService", "apiService", "appConfig", "$filter", "$ocLazyLoad"];

    function FreightDashboardController(helperService, authService, apiService, appConfig, $filter, $ocLazyLoad) {
        /* jshint validthis: true */
        var FreightDashboardCtrl = this;

        function Init() {
            FreightDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Freight_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }

})();