(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisController", EAxisController);

    EAxisController.$inject = ["helperService", "authService"];

    function EAxisController(helperService, authService) {
        /* jshint validthis: true */
        var EAxisCtrl = this;

        function Init() {
            EAxisCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EAxisCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().MenuType;
        }

        Init();
    }
})();
