(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceRequestDashboardController", ServiceRequestDashboardController);

        ServiceRequestDashboardController.$inject = ["helperService"];

    function ServiceRequestDashboardController(helperService) {
        var ServiceRequestDashboardCtrl = this;

        function Init() {
            ServiceRequestDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "ServiceRequest-Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }
        Init();
    }

})();