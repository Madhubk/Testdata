(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisAdminController", EAxisAdminController);

    EAxisAdminController.$inject = ["helperService"];

    function EAxisAdminController(helperService) {
        /* jshint validthis: true */
        var EAxisAdminCtrl = this;

        function Init() {
            EAxisAdminCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Admin",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
