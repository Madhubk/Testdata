(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EALabController", EALabController);

    EALabController.$inject = ["authService", "helperService"];

    function EALabController(authService, helperService) {
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

            EALabCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
