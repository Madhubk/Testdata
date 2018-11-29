(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportsController", TransportsController);

    TransportsController.$inject = ["helperService"];

    function TransportsController(helperService) {
        /* jshint validthis: true */
        var TransportsCtrl = this;

        function Init() {
            TransportsCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Transports",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
