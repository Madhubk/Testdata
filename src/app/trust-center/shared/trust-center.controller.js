(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrustCenterController", TrustCenterController);

    TrustCenterController.$inject = ["helperService"];

    function TrustCenterController(helperService) {
        /* jshint validthis: true */
        var TrustCenterCtrl = this;

        function Init() {
            TrustCenterCtrl.ePage = {
                "Title": "",
                "Prefix": "TrustCenter",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
