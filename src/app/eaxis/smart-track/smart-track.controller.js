(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SmartTrackController", SmartTrackController);

    SmartTrackController.$inject = ["authService", "helperService"];

    function SmartTrackController(authService, helperService) {
        /* jshint validthis: true */
        var SmartTrackCtrl = this;

        function Init() {
            SmartTrackCtrl.ePage = {
                "Title": "",
                "Prefix": "Smart_Track",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SmartTrackCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
