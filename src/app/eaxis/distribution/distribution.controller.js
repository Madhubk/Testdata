(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DistributionController", DistributionController);

    DistributionController.$inject = ["helperService"];

    function DistributionController(helperService) {
        /* jshint validthis: true */
        var DistributionCtrl = this;

        function Init() {
            DistributionCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Distribution",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
