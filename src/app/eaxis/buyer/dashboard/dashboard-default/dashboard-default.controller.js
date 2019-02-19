(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DashboardDefaultDirectiveController", DashboardDefaultDirectiveController);

    DashboardDefaultDirectiveController.$inject = ["helperService", "authService", "apiService", "appConfig"];

    function DashboardDefaultDirectiveController(helperService, authService, apiService, appConfig) {
        /* jshint validthis: true */
        var DashboardDefaultDirectiveCtrl = this;

        function Init() {
            DashboardDefaultDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard_Default",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

        }

        Init();
    }
})();