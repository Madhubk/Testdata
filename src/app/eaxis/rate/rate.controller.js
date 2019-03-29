(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RateController", RateController);

    RateController.$inject = [ "helperService"];

    function RateController(helperService) {
        /* jshint validthis: true */
        var RateCtrl = this;

        function Init() {
            RateCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Rate",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

        }

        Init();
    }
})();
