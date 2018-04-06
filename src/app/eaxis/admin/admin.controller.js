(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisAdminController", EAxisAdminController);

    EAxisAdminController.$inject = ["authService", "apiService", "helperService", "toastr", "appConfig"];

    function EAxisAdminController(authService, apiService, helperService, toastr, appConfig) {
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

            EAxisAdminCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
