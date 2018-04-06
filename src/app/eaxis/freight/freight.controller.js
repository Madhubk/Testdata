(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FreightController", FreightController);

    FreightController.$inject = ["authService", "helperService"];

    function FreightController(authService, helperService) {
        /* jshint validthis: true */
        var FreightCtrl = this;

        function Init() {
            FreightCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_Freight",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            FreightCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
