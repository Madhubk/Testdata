(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SmartTrackController", SmartTrackController);

    SmartTrackController.$inject = ["helperService"];

    function SmartTrackController(helperService) {
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
        }

        Init();
    }
})();
