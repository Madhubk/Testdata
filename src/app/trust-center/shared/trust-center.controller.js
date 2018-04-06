(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrustCenterController", TrustCenterController);

    TrustCenterController.$inject = ["trustCenterConfig", "helperService"];

    function TrustCenterController(trustCenterConfig, helperService) {
        /* jshint validthis: true */
        var TrustCenterCtrl = this;

        function Init() {
            TrustCenterCtrl.ePage = {
                "Title": "",
                "Prefix": "TrustCenter",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": trustCenterConfig.Entities
            };
        }

        Init();
    }
})();
