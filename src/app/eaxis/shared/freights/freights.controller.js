(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FreightsController", FreightsController);

    FreightsController.$inject = ["helperService"];

    function FreightsController(helperService) {
        /* jshint validthis: true */
        var FreightsCtrl = this;

        function Init() {
            FreightsCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Buyer",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();