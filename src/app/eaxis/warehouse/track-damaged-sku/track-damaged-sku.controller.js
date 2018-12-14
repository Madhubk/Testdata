(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackdamagedSKUController", TrackdamagedSKUController);

        TrackdamagedSKUController.$inject = ["$location", "helperService"];
    function TrackdamagedSKUController($location,helperService) {
        var TrackdamagedSKUCtrl = this,
            location = $location;

        function Init() {
            TrackdamagedSKUCtrl.ePage = {
                "Title": "",
                "Prefix": "TrackDamagedSKU",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            TrackdamagedSKUCtrl.ePage.Masters.dataentryName = "TrackDamagedSKU";
        }
        Init();
    }
})();