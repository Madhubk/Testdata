(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisDashboardController", EAxisDashboardController);

    EAxisDashboardController.$inject = ["helperService"];

    function EAxisDashboardController(helperService) {
        /* jshint validthis: true */
        var EAxisDashboardCtrl = this;

        function Init() {
            EAxisDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }

})();
