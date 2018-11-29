(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FreightDashboardController", FreightDashboardController);

    FreightDashboardController.$inject = ["helperService"];

    function FreightDashboardController(helperService) {
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

            InitCustom();
        }

        function InitCustom() {
            FreightDashboardCtrl.ePage.Masters.BuyerDashBoard = {};
            FreightDashboardCtrl.ePage.Masters.SupplierDashBoard = {};
            FreightDashboardCtrl.ePage.Masters.ImporterDashBoard = {};
            FreightDashboardCtrl.ePage.Masters.ExorterDashBoard = {};
        }

        Init();
    }

})();
