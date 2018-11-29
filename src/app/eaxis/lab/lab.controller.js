(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EALabController", EALabController);

    EALabController.$inject = ["helperService"];

    function EALabController(helperService) {
        /* jshint validthis: true */
        var EALabCtrl = this;

        function Init() {
            EALabCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Lab",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
