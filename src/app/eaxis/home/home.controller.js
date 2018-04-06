(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisHomeController", EAxisHomeController);

    EAxisHomeController.$inject = ["authService", "helperService"];

    function EAxisHomeController(authService, helperService) {
        /* jshint validthis: true */
        var EAxisHomeCtrl = this;

        function Init() {
            EAxisHomeCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Home",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EAxisHomeCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
